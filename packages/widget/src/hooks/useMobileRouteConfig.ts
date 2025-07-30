import { routeConfigAtom } from "@/state/route";
import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { useIsMobileScreenSize } from "./useIsMobileScreenSize";
import { WidgetRouteConfig } from "@/widget/Widget";

export const useMobileRouteConfig = () => {
  const isMobile = useIsMobileScreenSize();
  const setRouteConfig = useSetAtom(routeConfigAtom);

  useEffect(() => {
    setRouteConfig((prev: WidgetRouteConfig) => ({
      ...prev,
      allowMultiTx: !isMobile,
    }));
  }, [isMobile, setRouteConfig]);
};
