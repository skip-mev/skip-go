import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import { skipChainsAtom } from "./skipClient";
import { CaughtRouteError, _skipRouteAtom, routeConfigAtom } from "./route";
import { ROUTE_ERROR_CODE_MAP } from "@/constants/routeErrorCodeMap";
import { ChainType, route, RouteResponse } from "@skip-go/client";
import { errorWarningAtom } from "./errorWarning";
import { currentPageAtom, Routes } from "./router";
import {
  destinationAssetAtom,
  isInvertingSwapAtom,
  sourceAssetAtom,
  swapSettingsAtom,
} from "./swapPage";
import { RoutePreference } from "./types";
import { skipAllBalancesAtom } from "./balances";
import { convertHumanReadableAmountToCryptoAmount } from "@/utils/crypto";

const GAS_ON_RECEIVE_AMOUNT_USD = {
  [ChainType.Cosmos]: 0.5,
  [ChainType.Evm]: 10,
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
    if (destinationChain?.chainId === "1") {
      return GAS_ON_RECEIVE_AMOUNT_USD.evm_l2;
    }
    if (destinationChain?.chainType === ChainType.Evm) {
      return GAS_ON_RECEIVE_AMOUNT_USD[ChainType.Evm];
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

export const _gasOnReceiveRouteAtom: ReturnType<
  typeof atomWithQuery<Awaited<ReturnType<typeof route> | CaughtRouteError>>
> = atomWithQuery((get) => {
  const isGasOnReceive = get(gasOnReceiveAtom);
  const params = get(gasOnReceiveRouteRequestAtom);
  const currentPage = get(currentPageAtom);
  const isInvertingSwap = get(isInvertingSwapAtom);
  const errorWarning = get(errorWarningAtom);
  const routeConfig = get(routeConfigAtom);
  const swapSettings = get(swapSettingsAtom);
  const destinationAsset = get(destinationAssetAtom);

  const isDestinationIsAFeeAsset = params?.destAssetDenoms.includes(destinationAsset?.denom ?? "");

  const queryEnabled =
    params !== undefined &&
    Number(params.amountIn) > 0 &&
    !isInvertingSwap &&
    currentPage === Routes.SwapPage &&
    errorWarning === undefined &&
    isGasOnReceive &&
    !isDestinationIsAFeeAsset;

  return {
    queryKey: [
      "gasRoute",
      params?.destAssetDenoms,
      params?.destAssetChainId,
      params?.sourceAssetChainId,
      params?.sourceAssetDenom,
      routeConfig,
      swapSettings,
    ],
    queryFn: async () => {
      if (!params) {
        throw new Error("No route request provided");
      }
      const { destAssetDenoms, ...restParams } = params;
      let lastError;
      for (const denom of destAssetDenoms) {
        try {
          const response = await route({
            destAssetDenom: denom,
            ...restParams,
            smartRelay: true,
            ...routeConfig,
            goFast: swapSettings.routePreference === RoutePreference.FASTEST,
            abortDuplicateRequests: true,
          });
          return response;
        } catch (error) {
          lastError = error;
        }
      }
      return {
        isError: true,
        error: lastError,
      };
    },
    retry: 1,
    enabled: queryEnabled,
    refetchInterval: 1000 * 30,
  };
});

export const gasOnReceiveRouteAtom = atom<{
  data?: RouteResponse | undefined;
  isError: boolean;
  error?: Error | null;
  isLoading: boolean;
}>((get) => {
  const { data, isError, error, isFetching, isPending } = get(_gasOnReceiveRouteAtom);
  const caughtError = data as CaughtRouteError;
  const routeResponse = data as RouteResponse;
  if (caughtError?.isError) {
    const error = caughtError.error;

    if (caughtError?.error?.code && ROUTE_ERROR_CODE_MAP[caughtError.error.code]) {
      error.message = ROUTE_ERROR_CODE_MAP[caughtError.error.code];
    }

    return {
      data: undefined,
      isError: true,
      error: caughtError.error as Error,
      isLoading: false,
    };
  }

  return {
    data: routeResponse,
    isError,
    error,
    isLoading: isFetching && isPending,
  };
});

// export const gasOnReceiveEffectAtom = atomEffect((get, set) => {
//   const gasRouteRequest = get(gasOnReceiveRouteRequestAtom);
//   if (!gasRouteRequest) return;

//   const gasRouteAmountIn = gasRouteRequest.amountIn;
//   set(sourceAssetAmountAtom, (prev) => {
//     if (!prev?.amount) return prev;
//     const mainRouteAmountReducedByGasRoute = BigNumber(
//       convertHumanReadableAmountToCryptoAmount(prev?.amount, prev?.decimals),
//     ).minus(gasRouteAmountIn);
//     if (mainRouteAmountReducedByGasRoute.isLessThanOrEqualTo(0)) {
//       return prev;
//     }
//     return {
//       ...prev,
//       amount: convertTokenAmountToHumanReadableAmount(
//         mainRouteAmountReducedByGasRoute.toString(),
//         prev?.decimals,
//       ),
//     };
//   });
// });
