import { routeConfigAtom } from "@/state/route";
import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { useIsMobileScreenSize } from "./useIsMobileScreenSize";

export const useMobileRouteConfig = () => {
  const isMobile = useIsMobileScreenSize();
  const setRouteConfig = useSetAtom(routeConfigAtom);

  useEffect(() => {
    setRouteConfig({
      allowMultiTx: !isMobile,
    });
  }, [isMobile, setRouteConfig]);
};
