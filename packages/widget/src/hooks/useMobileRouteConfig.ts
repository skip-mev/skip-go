import { routeConfigAtom } from "@/state/route";
import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { WidgetRouteConfig } from "@/widget/Widget";
import { isMobile } from "@/utils/os";

export const useMobileRouteConfig = () => {
  const mobile = isMobile();
  const setRouteConfig = useSetAtom(routeConfigAtom);

  useEffect(() => {
    setRouteConfig((prev: WidgetRouteConfig) => ({
      ...prev,
      allowMultiTx: !mobile,
    }));
  }, [isMobile, setRouteConfig]);
};
