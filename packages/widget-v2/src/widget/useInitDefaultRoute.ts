import { skipAssetsAtom } from "@/state/skipClient";
import { sourceAssetAtom, destinationAssetAtom } from "@/state/swapPage";
import { useSetAtom, useAtom } from "jotai";
import { useCallback, useLayoutEffect } from "react";

export type DefaultRouteConfig = {
  amountIn?: number;
  amountOut?: number;
  srcChainId?: string;
  srcAssetDenom?: string;
  destChainId?: string;
  destAssetDenom?: string;
};

export const useInitDefaultRoute = (defaultRoute?: DefaultRouteConfig) => {
  const setSourceAsset = useSetAtom(sourceAssetAtom);
  const setDestinationAsset = useSetAtom(destinationAssetAtom);

  const [{ data: assets }] = useAtom(skipAssetsAtom);

  const getClientAsset = useCallback(
    (denom?: string, chainId?: string) => {
      if (!denom || !chainId) return;
      if (!assets) return;
      return assets.find((a) => a.denom === denom && a.chainID === chainId);
    },
    [assets]
  );

  useLayoutEffect(() => {
    if (!defaultRoute) return;
    if (defaultRoute && assets) {
      const {
        srcAssetDenom,
        srcChainId,
        destAssetDenom,
        destChainId,
        amountIn,
        amountOut,
      } = defaultRoute;
      const sourceAsset = getClientAsset(srcAssetDenom, srcChainId);
      const destinationAsset = getClientAsset(destAssetDenom, destChainId);
      setDestinationAsset({
        ...destinationAsset,
        amount: amountOut?.toString(),
      });
      setSourceAsset({
        ...sourceAsset,
        amount: amountIn?.toString(),
      });
    }
  }, [assets, defaultRoute, getClientAsset, setDestinationAsset, setSourceAsset]);
};