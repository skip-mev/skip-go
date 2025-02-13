import { Column } from "@/components/Layout";
import { Modals } from "@/modals/registerModals";
import { SwapPageFooter } from "@/pages/SwapPage/SwapPageFooter";
import { skipRouteAtom } from "@/state/route";
import { shadowRootAtom } from "@/state/shadowRoot";
import { isWaitingForNewRouteAtom } from "@/state/swapPage";
import NiceModal from "@ebay/nice-modal-react";
import { useAtomValue } from "jotai";
import React, { ReactNode, useState } from "react";

export const useSettingsDrawer = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const shadowRoot = useAtomValue(shadowRootAtom);
  const { isError: isRouteError } = useAtomValue(skipRouteAtom);
  const isWaitingForNewRoute = useAtomValue(isWaitingForNewRouteAtom);

  const SettingsDrawerPageContainer = ({ children }: { children?: ReactNode }) => {
    const openSettingsDrawer = () => {
      const container = shadowRoot?.getElementById("settings-drawer");
      NiceModal.show(Modals.SwapSettingsDrawer, {
        drawer: true,
        container: container,
        onOpenChange: (open: boolean) => (open ? setDrawerOpen(true) : setDrawerOpen(false)),
      });
    };

    return (
      <React.Fragment key={`${drawerOpen}`}>
        <Column
          gap={5}
          style={{
            opacity: drawerOpen ? 0.3 : 1,
          }}
        >
          {children}
          <SwapPageFooter
            disabled={isRouteError || isWaitingForNewRoute}
            showRouteInfo
            showEstimatedTime
            onClick={openSettingsDrawer}
          />
        </Column>
      </React.Fragment>
    );
  };

  return { SettingsDrawerPageContainer };
};
