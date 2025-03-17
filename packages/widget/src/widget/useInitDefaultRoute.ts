import { defaultRouteAtom, setRouteToDefaultRouteAtom } from "@/state/route";
import { skipAssetsAtom } from "@/state/skipClient";
import { useSetAtom, useAtom } from "jotai";
import { useEffect } from "react";

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
  const setDefaultRoute = useSetAtom(defaultRouteAtom);
  const setRouteToDefaultRoute = useSetAtom(setRouteToDefaultRouteAtom);
  const [{ data: assets }] = useAtom(skipAssetsAtom);

  useEffect(() => {
    if (!defaultRoute) return;
    setDefaultRoute(defaultRoute);
    setRouteToDefaultRoute(assets);
  }, [assets, defaultRoute, setDefaultRoute, setRouteToDefaultRoute]);
};
