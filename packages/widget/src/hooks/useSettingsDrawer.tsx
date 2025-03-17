import { Modals } from "@/modals/registerModals";
import { SwapPageFooter, SwapPageFooterItemsProps } from "@/pages/SwapPage/SwapPageFooter";
import { skipRouteAtom } from "@/state/route";
import { settingsDrawerAtom } from "@/state/settingsDrawer";
import { goFastWarningAtom, isWaitingForNewRouteAtom } from "@/state/swapPage";
import { track } from "@amplitude/analytics-browser";
import NiceModal from "@ebay/nice-modal-react";
import { useAtomValue, useSetAtom } from "jotai";
import React, { useState } from "react";

export const useSettingsDrawer = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const settingsDrawer = useAtomValue(settingsDrawerAtom);
  const { isError: isRouteError, data: route } = useAtomValue(skipRouteAtom);
  const isWaitingForNewRoute = useAtomValue(isWaitingForNewRouteAtom);
  const setShowGoFastErrorAtom = useSetAtom(goFastWarningAtom);

  const SettingsFooter = ({ content, ...props }: SwapPageFooterItemsProps) => {
    const openSettingsDrawer = () => {
      track("settings drawer - clicked");
      setShowGoFastErrorAtom(false);
      NiceModal.show(Modals.SwapSettingsDrawer, {
        drawer: true,
        container: settingsDrawer,
        onOpenChange: (open: boolean) => {
          if (open) {
            setDrawerOpen(true);
          } else {
            track("settings drawer - closed");
            setDrawerOpen(false);
          }
        },
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
