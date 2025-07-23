import { atom } from "jotai";
import { skipChainsAtom } from "./skipClient";
import { _skipRouteAtom, routeConfigAtom, skipRouteAtom, skipRouteRequestAtom } from "./route";
import { ChainType, RouteResponse, balances, route } from "@skip-go/client";
import {
  destinationAssetAtom,
  sourceAssetAtom,
  swapDirectionAtom,
  swapSettingsAtom,
} from "./swapPage";
import { skipAllBalancesAtom } from "./balances";
import { convertHumanReadableAmountToCryptoAmount } from "@/utils/crypto";
import { atomWithQuery } from "jotai-tanstack-query";
import { RoutePreference } from "./types";
import { Routes, currentPageAtom } from "./router";
import BigNumber from "bignumber.js";
import { chainAddressesAtom } from "./swapExecutionPage";
import { atomEffect } from "jotai-effect";
import { currentTransactionAtom } from "./history";

type SwapRoute = {
  mainRoute?: RouteResponse;
  feeRoute?: RouteResponse;
  gasOnReceiveAsset?: {
    amountUsd: string;
    denom: string;
    chainId: string;
  };
};

const GAS_ON_RECEIVE_AMOUNT_USD = {
  [ChainType.Cosmos]: 0.5,
  evm_l2: 4,
};

export const gasOnReceiveAtom = atom<boolean>(true);
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
    if (_amount !== undefined) return parseFloat(_amount);
    if (destinationChain?.chainType === ChainType.Evm) {
      return GAS_ON_RECEIVE_AMOUNT_USD.evm_l2;
    }
    return GAS_ON_RECEIVE_AMOUNT_USD[ChainType.Cosmos];
  })();
  const destinationFeeAssets = destinationChain?.feeAssets.map((asset) => asset.denom);

  if (!sourceAsset?.chainId || !sourceAsset.denom || !destinationFeeAssets) return;

  const sourceAssetUsdPrice =
    balances?.data?.chains?.[sourceAsset?.chainId]?.denoms?.[sourceAsset?.denom]?.price;
  if (!sourceAssetUsdPrice) return;
  const amount = Number(sourceAssetUsdPrice) * amountUsd;

  return {
    amountIn: convertHumanReadableAmountToCryptoAmount(amount, destinationAsset?.decimals),
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
        (denom) =>
          balanceResponse?.chains?.[destination.chainId]?.denoms?.[denom]?.amount &&
          balanceResponse?.chains?.[destination.chainId]?.denoms?.[denom]?.amount !== "0",
      );
      return isSomeBalanceAvailable;
    },
  };
});

export const gasOnReceiveAtomEffect = atomEffect((get, set) => {
  const isSomeDestinationFeeBalanceAvailable = get(isSomeDestinationFeeBalanceAvailableAtom);
  const currentTransactionItem = get(currentTransactionAtom);
  if (!currentTransactionItem) {
    if (
      isSomeDestinationFeeBalanceAvailable.data &&
      !isSomeDestinationFeeBalanceAvailable.isLoading
    ) {
      set(gasOnReceiveAtom, false);
    } else {
      set(gasOnReceiveAtom, true);
    }
  }
});

export const gasOnReceiveRouteAtom: ReturnType<
  typeof atomWithQuery<Awaited<SwapRoute | undefined>>
> = atomWithQuery((get) => {
  const { data: originalRoute } = get(skipRouteAtom);
  const params = get(skipRouteRequestAtom);
  const currentPage = get(currentPageAtom);
  const destinationAsset = get(destinationAssetAtom);
  const routeConfig = get(routeConfigAtom);
  const swapSettings = get(swapSettingsAtom);
  const gasOnReceiveRouteParams = get(gasOnReceiveRouteRequestAtom);
  const currentTransactionItem = get(currentTransactionAtom);
  const destinationAssetIsAFeeAsset = gasOnReceiveRouteParams?.destAssetDenoms.includes(
    destinationAsset?.denom ?? "",
  );
  const chainAddresses = get(chainAddressesAtom);
  const chainAddressesArray = Object.values(chainAddresses);
  const destination = chainAddressesArray?.[chainAddressesArray.length - 1];
  const destinationAddress = destination?.address;

  const queryEnabled =
    originalRoute &&
    currentPage === Routes.SwapExecutionPage &&
    !destinationAssetIsAFeeAsset &&
    !!destinationAddress &&
    !currentTransactionItem;

  return {
    enabled: queryEnabled,
    queryKey: [
      "gasOnReceiveRoute",
      originalRoute,
      {
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
      console.log({ originalRoute, gasOnReceiveRouteParams, params, destinationAddress });
      if (!params) throw new Error("No route request provided");
      let feeRoute: RouteResponse | undefined;
      if (
        destinationAssetIsAFeeAsset ||
        !gasOnReceiveRouteParams?.destAssetDenoms ||
        gasOnReceiveRouteParams.destAssetDenoms.length === 0
      ) {
        return null;
      }
      const { destAssetDenoms, ...restParams } = gasOnReceiveRouteParams;

      const splitDenoms = chunkArray(destAssetDenoms);
      for (const chunk of splitDenoms) {
        const feeAssetRoutes = chunk.map(async (denom) => {
          try {
            const res = await route({
              destAssetDenom: denom,
              ...restParams,
              smartRelay: true,
              ...routeConfig,
              goFast: swapSettings.routePreference === RoutePreference.FASTEST,
              allowMultiTx: false,
              abortDuplicateRequests: true,
            });
            return res;
          } catch (_e) {
            return;
          }
        });
        const result = await Promise.all(feeAssetRoutes);
        const _feeRoute = result.find((result) => result?.usdAmountOut);
        if (_feeRoute?.usdAmountOut) {
          feeRoute = _feeRoute;
          break;
        }
      }
      if (!feeRoute?.usdAmountOut || !originalRoute?.usdAmountOut) return;
      params.amountIn = BigNumber(originalRoute.amountOut)
        .minus(BigNumber(feeRoute?.amountIn ?? 0))
        .toString();
      params.amountOut = undefined;

      const mainRoute = await route({
        ...params,
        smartRelay: true,
        ...routeConfig,
        goFast: swapSettings.routePreference === RoutePreference.FASTEST,
        abortDuplicateRequests: true,
      });
      if (!mainRoute) return;
      return {
        mainRoute,
        feeRoute,
        gasOnReceiveAsset: {
          amountUsd: feeRoute.usdAmountOut,
          denom: feeRoute.destAssetDenom,
          chainId: feeRoute.destAssetChainId,
        },
      };
    },
  };
});

const chunkArray = (arr: string[], size = 3): string[][] => {
  const result: string[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};
