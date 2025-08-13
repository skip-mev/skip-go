import { atom } from "jotai";
import { skipAssetsAtom, skipChainsAtom } from "./skipClient";
import { _skipRouteAtom, routeConfigAtom, skipRouteAtom, skipRouteRequestAtom } from "./route";
import { ChainType, RouteResponse, balances, getRouteWithGasOnReceive } from "@skip-go/client";
import { destinationAssetAtom, sourceAssetAtom, swapSettingsAtom } from "./swapPage";
import { skipAllBalancesAtom } from "./balances";
import { convertHumanReadableAmountToCryptoAmount } from "@/utils/crypto";
import { atomWithQuery } from "jotai-tanstack-query";
import { Routes, currentPageAtom } from "./router";
import BigNumber from "bignumber.js";
import { chainAddressesAtom } from "./swapExecutionPage";
import { atomEffect } from "jotai-effect";
import { currentTransactionAtom } from "./history";
import { track } from "@amplitude/analytics-browser";
import { RoutePreference } from "./types";

type SwapRoute = {
  mainRoute?: RouteResponse;
  gasRoute?: RouteResponse;
  gasOnReceiveAsset?: {
    amountUsd?: string;
    amountOut: string;
    denom: string;
    chainId: string;
  };
};

const GAS_ON_RECEIVE_AMOUNT_USD = {
  [ChainType.Cosmos]: 0.1,
  evm_l2: 2,
};

export const gasOnReceiveAtom = atom<boolean | undefined>(undefined);
export const gasOnReceiveAmountAtom = atom<string | undefined>(undefined);

export const gasOnReceiveRouteRequestAtom = atom((get) => {
  const balances = get(skipAllBalancesAtom);
  const chains = get(skipChainsAtom);

  const sourceAsset = get(sourceAssetAtom);
  const destinationAsset = get(destinationAssetAtom);
  const _amount = get(gasOnReceiveAmountAtom);
  if (!sourceAsset || !destinationAsset) return;
  const destinationChain = chains.data?.find((c) => c.chainId === destinationAsset?.chainId);

  const amountUsd = (() => {
    if (_amount !== undefined) {
      const parsedAmount = Number(_amount);
      if (!isNaN(parsedAmount)) return parsedAmount;
    }
    if (destinationChain?.chainType === ChainType.Evm) {
      return GAS_ON_RECEIVE_AMOUNT_USD.evm_l2;
    }
    return GAS_ON_RECEIVE_AMOUNT_USD[ChainType.Cosmos];
  })();
  const destinationFeeAssets = (() => {
    const assets = get(skipAssetsAtom);
    if (destinationChain?.chainType === ChainType.Evm) {
      const evmFeeAsset = assets.data?.find(
        (asset) => asset.chain_key === destinationChain?.chainId && asset.denom.includes("-native"),
      );
      if (evmFeeAsset) {
        return [{ amountOut: undefined, denom: evmFeeAsset.denom }];
      }
    }
    return destinationChain?.feeAssets.map((asset) => {
      const destinationFeeAsset = assets.data?.find(
        (a) => a.chain_key === destinationChain?.chainId && a.denom === asset.denom,
      );
      const gasPrice = asset.gasPrice?.average ?? asset.gasPrice?.high ?? asset.gasPrice?.low;
      return {
        amountOut:
          gasPrice &&
          convertHumanReadableAmountToCryptoAmount(
            BigNumber(gasPrice).multipliedBy(3).toNumber(),
            destinationFeeAsset?.decimals,
          ),
        denom: asset.denom,
      };
    });
  })();

  if (!sourceAsset?.chainId || !sourceAsset.denom || !destinationFeeAssets) return;

  const sourceAssetUsdPrice =
    balances?.data?.chains?.[sourceAsset?.chainId]?.denoms?.[sourceAsset?.denom]?.price;
  if (!sourceAssetUsdPrice) return;
  const amount = BigNumber(amountUsd).dividedBy(sourceAssetUsdPrice).toString();

  return {
    amountIn: convertHumanReadableAmountToCryptoAmount(amount, sourceAsset?.decimals),
    sourceAssetChainId: sourceAsset.chainId,
    sourceAssetDenom: sourceAsset.denom,
    destAssetChainId: destinationAsset?.chainId,
    destAssetDenoms: destinationFeeAssets,
  };
});

export const isSomeDestinationFeeBalanceAvailableAtom = atomWithQuery((get) => {
  const chainAddresses = get(chainAddressesAtom);
  const chainAddressesArray = Object.values(chainAddresses);
  const destination = chainAddressesArray?.[chainAddressesArray.length - 1];
  const destinationAddress = destination?.address;
  const gasOnReceiveRouteParams = get(gasOnReceiveRouteRequestAtom);

  const queryEnabled = !!destinationAddress && !!gasOnReceiveRouteParams;

  return {
    enabled: queryEnabled,
    retry: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchInterval: false,
    queryKey: ["destinationBalances", { destination, gasOnReceiveRouteParams }],
    queryFn: async () => {
      if (!gasOnReceiveRouteParams) return false;
      const balanceResponse = await balances({
        chains: {
          [destination.chainId]: {
            address: destinationAddress,
          },
        },
      });
      const isSomeBalanceAvailable = gasOnReceiveRouteParams?.destAssetDenoms.some(
        ({ denom, amountOut }) => {
          const balanceAmount =
            balanceResponse?.chains?.[destination.chainId]?.denoms?.[denom]?.amount;
          const isMoreThanAmountOut =
            !!balanceAmount &&
            !!amountOut &&
            BigNumber(balanceAmount).isGreaterThanOrEqualTo(amountOut);
          return amountOut ? isMoreThanAmountOut : balanceAmount && balanceAmount !== "0";
        },
      );

      if (!isSomeBalanceAvailable) {
        track("gas on receive: no destination balance");
      }

      return isSomeBalanceAvailable;
    },
  };
});

export const gasOnReceiveAtomEffect = atomEffect((get, set) => {
  const gorRoute = get(gasOnReceiveRouteAtom);
  const isSomeDestinationFeeBalanceAvailable = get(isSomeDestinationFeeBalanceAvailableAtom);
  const currentTransactionItem = get(currentTransactionAtom);
  if (gorRoute.isLoading || isSomeDestinationFeeBalanceAvailable.isLoading) return;
  if (currentTransactionItem) return;
  if (!gorRoute.data?.gasOnReceiveAsset) return;
  if (isSomeDestinationFeeBalanceAvailable.data) {
    set(gasOnReceiveAtom, (prev) => prev ?? false);
  } else {
    set(gasOnReceiveAtom, (prev) => prev ?? true);
  }
});

export const gasOnReceiveRouteAtom: ReturnType<typeof atomWithQuery<Awaited<SwapRoute | null>>> =
  atomWithQuery((get) => {
    const { data: chains } = get(skipChainsAtom);
    const { data: originalRoute } = get(skipRouteAtom);
    const params = get(skipRouteRequestAtom);
    const currentPage = get(currentPageAtom);
    const destinationAsset = get(destinationAssetAtom);
    const routeConfig = get(routeConfigAtom);
    const swapSettings = get(swapSettingsAtom);
    const gasOnReceiveRouteParams = get(gasOnReceiveRouteRequestAtom);
    const currentTransactionItem = get(currentTransactionAtom);
    const destinationAssetIsAFeeAsset = gasOnReceiveRouteParams?.destAssetDenoms
      .map((i) => i.denom)
      .includes(destinationAsset?.denom ?? "");
    const chainAddresses = get(chainAddressesAtom);
    const chainAddressesArray = Object.values(chainAddresses);
    const destination = chainAddressesArray?.[chainAddressesArray.length - 1];
    const sourceAddress = chainAddressesArray?.[0]?.address;
    const destinationAddress = destination?.address;

    const enabledDestinationChainType = [ChainType.Cosmos, ChainType.Evm];
    const disabledChainIds = ["1", "solana"];

    const chain = chains?.find((i) => i.chainId === destination?.chainId);
    const isRouteEnabled = (() => {
      if (!chain) return false;
      if (disabledChainIds.includes(chain.chainId)) return false;
      if (!enabledDestinationChainType.includes(chain.chainType)) return false;
      return true;
    })();
    const isSameChainAndAddress =
      originalRoute?.sourceAssetChainId === originalRoute?.destAssetChainId &&
      sourceAddress === destinationAddress;

    const queryEnabled =
      originalRoute &&
      currentPage === Routes.SwapExecutionPage &&
      !destinationAssetIsAFeeAsset &&
      !!destinationAddress &&
      isRouteEnabled &&
      !currentTransactionItem &&
      !isSameChainAndAddress;

    return {
      enabled: queryEnabled,
      queryKey: [
        "gasOnReceiveRoute",
        {
          originalRoute: {
            usdAmountOut: originalRoute?.usdAmountOut,
          },
          params,
          destinationAddress,
          sourceAssetChainId: gasOnReceiveRouteParams?.sourceAssetChainId,
          sourceAssetDenom: gasOnReceiveRouteParams?.sourceAssetDenom,
          destAssetChainId: gasOnReceiveRouteParams?.destAssetChainId,
          destAssetDenoms: gasOnReceiveRouteParams?.destAssetDenoms,
        },
      ],
      retry: false,
      refetchInterval: false,
      queryFn: async () => {
        if (!params) throw new Error("No route request provided");
        if (!originalRoute) return null;
        const routes = await getRouteWithGasOnReceive({
          routeRequest: {
            ...params,
            ...routeConfig,
            goFast: swapSettings.routePreference === RoutePreference.FASTEST,
          },
          routeResponse: originalRoute,
        });

        if (!routes.gasRoute) {
          return null;
        }
        return {
          mainRoute: routes.mainRoute,
          gasRoute: routes.gasRoute,
          gasOnReceiveAsset: {
            amountOut: routes.gasRoute.amountOut,
            amountUsd: routes.gasRoute.usdAmountOut,
            denom: routes.gasRoute.destAssetDenom,
            chainId: routes.gasRoute.destAssetChainId,
          },
        };
      },
    };
  });
