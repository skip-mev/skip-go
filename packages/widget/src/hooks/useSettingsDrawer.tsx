import { Modals } from "@/modals/registerModals";
import { SwapPageFooter, SwapPageFooterItemsProps } from "@/pages/SwapPage/SwapPageFooter";
import { skipRouteAtom } from "@/state/route";
import { shadowRootAtom } from "@/state/shadowRoot";
import { goFastWarningAtom, isWaitingForNewRouteAtom } from "@/state/swapPage";
import NiceModal from "@ebay/nice-modal-react";
import { useAtomValue, useSetAtom } from "jotai";
import React, { useState } from "react";

export const useSettingsDrawer = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const shadowRoot = useAtomValue(shadowRootAtom);
  const { isError: isRouteError, data: route } = useAtomValue(skipRouteAtom);
  const isWaitingForNewRoute = useAtomValue(isWaitingForNewRouteAtom);
  const setShowGoFastErrorAtom = useSetAtom(goFastWarningAtom);

  const SettingsFooter = ({ content, ...props }: SwapPageFooterItemsProps) => {
    const openSettingsDrawer = () => {
      const container = shadowRoot?.getElementById("settings-drawer");
      setShowGoFastErrorAtom(false);
      NiceModal.show(Modals.SwapSettingsDrawer, {
        drawer: true,
        container: container,
        onOpenChange: (open: boolean) => (open ? setDrawerOpen(true) : setDrawerOpen(false)),
      });
    };

    return (
      <SwapPageFooter
        disabled={isRouteError || isWaitingForNewRoute || route === undefined}
        showRouteInfo
        showEstimatedTime
        onClick={openSettingsDrawer}
        {...props}
      />
    );
  };

  return { SettingsFooter, drawerOpen };
};
