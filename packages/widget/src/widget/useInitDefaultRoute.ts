import { skipAssetsAtom } from "@/state/skipClient";
import {
  sourceAssetAtom,
  destinationAssetAtom,
  sourceAssetAmountAtom,
  destinationAssetAmountAtom,
} from "@/state/swapPage";
import { useSetAtom, useAtom } from "jotai";
import { useCallback, useLayoutEffect } from "react";

export type DefaultRouteConfig = {
  amountIn?: number;
  amountOut?: number;
  srcChainId?: string;
  srcAssetDenom?: string;
  destChainId?: string;
  destAssetDenom?: string;
  srcLocked?: boolean;
  destLocked?: boolean;
};

export const useInitDefaultRoute = (defaultRoute?: DefaultRouteConfig) => {
  const setSourceAsset = useSetAtom(sourceAssetAtom);
  const setDestinationAsset = useSetAtom(destinationAssetAtom);
  const setSourceAssetAmount = useSetAtom(sourceAssetAmountAtom);
  const setDestinationAssetAmount = useSetAtom(destinationAssetAmountAtom);

  const [{ data: assets }] = useAtom(skipAssetsAtom);

  const getClientAsset = useCallback(
    (denom?: string, chainId?: string) => {
      if (!denom || !chainId) return;
      if (!assets) return;
      return assets.find(
        (a) => a.denom.toLowerCase() === denom.toLowerCase() && a.chainID === chainId,
      );
    },
    [assets],
  );

  useLayoutEffect(() => {
    if (!defaultRoute) return;
    if (defaultRoute && assets) {
      const { srcAssetDenom, srcChainId, destAssetDenom, destChainId, amountIn, amountOut } =
        defaultRoute;
      const sourceAsset = getClientAsset(srcAssetDenom, srcChainId);
      const destinationAsset = getClientAsset(destAssetDenom, destChainId);
      setDestinationAsset({
        ...destinationAsset,
        locked: defaultRoute?.destLocked,
        amount: amountOut?.toString(),
      });
      setSourceAsset({
        ...sourceAsset,
        locked: defaultRoute?.srcLocked,
        amount: amountIn?.toString(),
      });
      if (amountIn) {
        setSourceAssetAmount(amountIn?.toString());
      } else if (amountOut) {
        setDestinationAssetAmount(amountOut?.toString());
      }
    }
  }, [
    assets,
    defaultRoute,
    getClientAsset,
    setDestinationAsset,
    setDestinationAssetAmount,
    setSourceAsset,
    setSourceAssetAmount,
  ]);
};
