import { convertHumanReadableAmountToCryptoAmount } from "@/utils/crypto";
import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import { errorWarningAtom } from "./errorWarning";
import { currentPageAtom, Routes } from "./router";
import { ClientAsset, skipAssetsAtom } from "./skipClient";
import {
  sourceAssetAtom,
  destinationAssetAtom,
  swapDirectionAtom,
  debouncedSourceAssetAmountAtom,
  debouncedDestinationAssetAmountAtom,
  isInvertingSwapAtom,
  debouncedSourceAssetAmountValueInitializedAtom,
  debouncedDestinationAssetAmountValueInitializedAtom,
  sourceAssetAmountAtom,
  destinationAssetAmountAtom,
  swapSettingsAtom,
} from "./swapPage";
import { atomEffect } from "jotai-effect";
import { WidgetRouteConfig } from "@/widget/Widget";
import { RoutePreference } from "./types";
import { DefaultRouteConfig } from "@/widget/useInitDefaultRoute";
import { route, RouteRequest, RouteResponse } from "@skip-go/client";
import { ROUTE_ERROR_CODE_MAP } from "@/constants/routeErrorCodeMap";
import { gasOnReceiveRouteRequestAtom } from "./gasOnReceive";
import { BigNumber } from "bignumber.js";

export const initializeDebounceValuesEffect: ReturnType<typeof atomEffect> = atomEffect(
  (get, set) => {
    const sourceAsset = get(sourceAssetAtom);
    const destinationAsset = get(destinationAssetAtom);
    const defaultRoute = get(defaultRouteAtom);
    const debouncedSourceAssetInitialized = get(debouncedSourceAssetAmountValueInitializedAtom);
    const debouncedDestinationAssetInitialized = get(
      debouncedDestinationAssetAmountValueInitializedAtom,
    );

    if (!debouncedSourceAssetInitialized && sourceAsset?.amount) {
      set(debouncedSourceAssetAmountAtom, sourceAsset.amount, undefined, true);
      set(sourceAssetAtom, (prev) => ({ ...prev, locked: defaultRoute?.srcLocked }));
    }

    if (!debouncedDestinationAssetInitialized && destinationAsset?.amount) {
      set(debouncedDestinationAssetAmountAtom, destinationAsset.amount, undefined, true);
      set(destinationAssetAtom, (prev) => ({ ...prev, locked: defaultRoute?.destLocked }));
    }
  },
);

export const skipRouteRequestAtom = atom<RouteRequest | undefined>((get) => {
  const sourceAsset = get(sourceAssetAtom);
  const destinationAsset = get(destinationAssetAtom);
  const direction = get(swapDirectionAtom);
  const sourceAssetAmount = get(debouncedSourceAssetAmountAtom);
  const destinationAssetAmount = get(debouncedDestinationAssetAmountAtom);

  get(initializeDebounceValuesEffect);

  if (
    !sourceAsset?.chainId ||
    !sourceAsset.denom ||
    !destinationAsset?.chainId ||
    !destinationAsset.denom
  ) {
    return undefined;
  }
  const amount =
    direction === "swap-in"
      ? {
          amountIn: convertHumanReadableAmountToCryptoAmount(
            sourceAssetAmount ?? "0",
            sourceAsset.decimals,
          ),
        }
      : {
          amountOut: convertHumanReadableAmountToCryptoAmount(
            destinationAssetAmount ?? "0",
            destinationAsset.decimals,
          ),
        };

  return {
    ...amount,
    sourceAssetChainId: sourceAsset.chainId,
    sourceAssetDenom: sourceAsset.denom,
    destAssetChainId: destinationAsset.chainId,
    destAssetDenom: destinationAsset.denom,
  };
});

export type CaughtRouteError = {
  isError: boolean;
  error: {
    message?: string;
    code?: number;
  };
  message?: string;
};

export const routeConfigAtom = atom<WidgetRouteConfig>({
  experimentalFeatures: ["stargate", "eureka", "layer_zero"],
  allowMultiTx: true,
  allowUnsafe: true,
  smartSwapOptions: {
    splitRoutes: true,
    evmSwaps: true,
  },
  goFast: true,
  timeoutSeconds: undefined,
});

export type SwapRoute = RouteResponse & {
  mainRoute: RouteResponse;
  feeRoute?: RouteResponse;
  gasOnReceiveAsset?: {
    amountUsd: string;
    denom: string;
    chainId: string;
  };
};

export const _skipRouteAtom: ReturnType<
  typeof atomWithQuery<Awaited<SwapRoute | CaughtRouteError>>
> = atomWithQuery((get) => {
  const params = get(skipRouteRequestAtom);
  const currentPage = get(currentPageAtom);
  const isInvertingSwap = get(isInvertingSwapAtom);
  const errorWarning = get(errorWarningAtom);
  const routeConfig = get(routeConfigAtom);
  const swapSettings = get(swapSettingsAtom);
  const gasOnReceiveRouteParams = get(gasOnReceiveRouteRequestAtom);
  const destinationAsset = get(destinationAssetAtom);
  const direction = get(swapDirectionAtom);
  console.log("destDenoms", gasOnReceiveRouteParams?.destAssetDenoms);
  const destinationAssetIsAFeeAsset = gasOnReceiveRouteParams?.destAssetDenoms.includes(
    destinationAsset?.denom ?? "",
  );

  const queryEnabled =
    params !== undefined &&
    (Number(params.amountIn) > 0 || Number(params.amountOut) > 0) &&
    !isInvertingSwap &&
    currentPage === Routes.SwapPage &&
    errorWarning === undefined;

  return {
    queryKey: ["skipRoute", params, routeConfig, swapSettings, gasOnReceiveRouteParams],
    queryFn: async () => {
      if (!params) {
        throw new Error("No route request provided");
      }
      try {
        console.log("Route request params:", params);
        const response = (await route({
          ...params,
          smartRelay: true,
          ...routeConfig,
          goFast: swapSettings.routePreference === RoutePreference.FASTEST,
          abortDuplicateRequests: true,
        })) as SwapRoute;

        response.mainRoute = response;
        console.log("destinationAssetIsAFeeAsset", destinationAssetIsAFeeAsset);
        let feeRoute: RouteResponse | undefined;
        if (
          !destinationAssetIsAFeeAsset &&
          gasOnReceiveRouteParams?.destAssetDenoms !== undefined
        ) {
          console.log("Gas on receive route params:", gasOnReceiveRouteParams);
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
          console.log("Fee route found:", feeRoute);
          if (feeRoute?.usdAmountOut && response?.usdAmountOut) {
            if (direction === "swap-in") {
              params.amountIn = BigNumber(response.amountOut)
                .minus(BigNumber(feeRoute?.amountIn ?? 0))
                .toString();
            } else if (direction === "swap-out") {
              params.amountOut = BigNumber(response.amountOut)
                .plus(BigNumber(feeRoute?.amountIn ?? 0))
                .toString();
            }

            const mainRoute = await route({
              ...params,
              smartRelay: true,
              ...routeConfig,
              goFast: swapSettings.routePreference === RoutePreference.FASTEST,
              abortDuplicateRequests: true,
            });
            if (mainRoute) {
              response.mainRoute = mainRoute;
              response.feeRoute = feeRoute;
              if (direction === "swap-in") {
                response.amountOut = mainRoute.amountOut;
                response.usdAmountOut = mainRoute.usdAmountOut;
              } else if (direction === "swap-out") {
                response.amountIn = mainRoute.amountIn;
                response.usdAmountIn = mainRoute.usdAmountIn;
              }

              response.gasOnReceiveAsset = {
                amountUsd: feeRoute?.usdAmountOut,
                denom: feeRoute?.destAssetDenom,
                chainId: feeRoute?.destAssetChainId,
              };
            }
          }
        }

        return response;
      } catch (error) {
        return {
          isError: true,
          error,
        };
      }
    },
    retry: 1,
    enabled: queryEnabled,
    refetchInterval: 1000 * 30,
  };
});

export const skipRouteAtom = atom<{
  data?: SwapRoute | undefined;
  isError: boolean;
  error?: Error | null;
  isLoading: boolean;
}>((get) => {
  const { data, isError, error, isFetching, isPending } = get(_skipRouteAtom);
  const caughtError = data as CaughtRouteError;
  const routeResponse = data as SwapRoute;
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

export const defaultRouteAtom = atom<DefaultRouteConfig>();

export const setRouteToDefaultRouteAtom = atom(null, (get, set, assets?: ClientAsset[]) => {
  const defaultRoute = get(defaultRouteAtom);
  const { data } = get(skipAssetsAtom);

  assets ??= data;

  const getClientAsset = (denom?: string, chainId?: string) => {
    if (!denom || !chainId) return;
    if (!assets) return;
    return assets.find(
      (a) => a.denom.toLowerCase() === denom.toLowerCase() && a.chainId === chainId,
    );
  };

  if (!defaultRoute || !assets) return;

  const { srcAssetDenom, srcChainId, destAssetDenom, destChainId, amountIn, amountOut } =
    defaultRoute;

  const sourceAsset = getClientAsset(srcAssetDenom, srcChainId);
  const destinationAsset = getClientAsset(destAssetDenom, destChainId);

  set(destinationAssetAtom, {
    ...destinationAsset,
    locked: defaultRoute?.destLocked,
    amount: amountOut?.toString(),
  });

  set(sourceAssetAtom, {
    ...sourceAsset,
    locked: defaultRoute?.srcLocked,
    amount: amountIn?.toString(),
  });

  if (amountIn) {
    set(sourceAssetAmountAtom, amountIn?.toString());
  } else if (amountOut) {
    set(destinationAssetAmountAtom, amountOut?.toString());
  }
});

const chunkArray = (arr: string[], size = 3): string[][] => {
  const result: string[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};
