import { Column } from "@/components/Layout";
import { Modals } from "@/modals/registerModals";
import { SwapPageFooter } from "@/pages/SwapPage/SwapPageFooter";
import { shadowRootAtom } from "@/state/shadowRoot";
import NiceModal from "@ebay/nice-modal-react";
import { useAtomValue } from "jotai";
import React, { ReactNode, useState } from "react";

export const useSettingsDrawer = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const shadowRoot = useAtomValue(shadowRootAtom);

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
          <SwapPageFooter showRouteInfo showEstimatedTime onClick={openSettingsDrawer} />
        </Column>
      </React.Fragment>
    );
  };

  return { SettingsDrawerPageContainer };
};
