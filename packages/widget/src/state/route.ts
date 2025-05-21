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

const skipRouteRequestAtom = atom<RouteRequest | undefined>((get) => {
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

type CaughtRouteError = {
  isError: boolean;
  error: unknown;
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

export const _skipRouteAtom: ReturnType<
  typeof atomWithQuery<Awaited<ReturnType<typeof route> | CaughtRouteError>>
> = atomWithQuery((get) => {
  const params = get(skipRouteRequestAtom);
  const currentPage = get(currentPageAtom);
  const isInvertingSwap = get(isInvertingSwapAtom);
  const blockingPage = get(errorWarningAtom);
  const routeConfig = get(routeConfigAtom);
  const swapSettings = get(swapSettingsAtom);

  const queryEnabled =
    params !== undefined &&
    (Number(params.amountIn) > 0 || Number(params.amountOut) > 0) &&
    !isInvertingSwap &&
    currentPage === Routes.SwapPage &&
    blockingPage === undefined;

  return {
    queryKey: ["skipRoute", params, routeConfig, swapSettings],
    queryFn: async () => {
      if (!params) {
        throw new Error("No route request provided");
      }
      try {
        const response = await route({
          ...params,
          smartRelay: true,
          ...routeConfig,
          goFast: swapSettings.routePreference === RoutePreference.FASTEST,
          abortDuplicateRequests: true,
        });
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
  data?: RouteResponse | undefined;
  isError: boolean;
  error?: Error | null;
  isLoading: boolean;
}>((get) => {
  const { data, isError, error, isFetching, isPending } = get(_skipRouteAtom);
  const caughtError = data as CaughtRouteError;
  const routeResponse = data as RouteResponse;
  if (caughtError?.isError) {
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
