import { Column } from "@/components/Layout";
import { MainButton } from "@/components/MainButton";
import { SwapPageFooter } from "@/pages/SwapPage/SwapPageFooter";
import { SwapPageHeader } from "@/pages/SwapPage/SwapPageHeader";
import { useMemo, useState } from "react";
import { ICONS } from "@/icons";
import { ManualAddressModal } from "@/modals/ManualAddressModal/ManualAddressModal";
import { useTheme } from "styled-components";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { destinationWalletAtom } from "@/state/swapPage";
import { SwapExecutionPageRouteSimple } from "./SwapExecutionPageRouteSimple";
import { SwapExecutionPageRouteDetailed } from "./SwapExecutionPageRouteDetailed";

import { withBoundProps } from "@/utils/misc";
import { txState } from "./SwapExecutionPageRouteDetailedRow";
import { useModal } from "@/components/Modal";
import { currentPageAtom, Routes } from "@/state/router";
import { ClientOperation, getClientOperations } from "@/utils/clientType";
import {
  chainAddressesAtom,
  skipSubmitSwapExecutionAtom,
  swapExecutionStateAtom,
} from "@/state/swapExecutionPage";
import { useAutoSetAddress } from "@/hooks/useAutoSetAddress";

enum SwapExecutionState {
  recoveryAddressUnset,
  destinationAddressUnset,
  ready,
  pending,
  confirmed,
}

const TX_DELAY_MS = 5_000;

export const SwapExecutionPage = () => {
  const theme = useTheme();
  const setCurrentPage = useSetAtom(currentPageAtom);
  const { route } = useAtomValue(swapExecutionStateAtom);
  const chainAddresses = useAtomValue(chainAddressesAtom);

  const { connectRequiredChains } = useAutoSetAddress();

  const clientOperations = useMemo(() => {
    if (!route?.operations) return [] as ClientOperation[];
    return getClientOperations(route.operations);
  }, [route?.operations]);

  const [_destinationWallet] = useAtom(destinationWalletAtom);

  const [simpleRoute, setSimpleRoute] = useState(true);
  const modal = useModal(ManualAddressModal);

  const [txStateMap, _setTxStateMap] = useState<Record<number, txState>>({
    0: "pending",
    1: "pending",
    2: "pending",
  });

  const { mutate, isPending, isSuccess } = useAtomValue(
    skipSubmitSwapExecutionAtom
  );

  const swapExecutionState = useMemo(() => {
    if (!chainAddresses) return;
    const requiredChainAddresses = route?.requiredChainAddresses;
    if (!requiredChainAddresses) return;
    const allAddressesSet = requiredChainAddresses.every(
      (_chainId, index) => chainAddresses[index]?.address
    );
    const lastChainAddress =
      chainAddresses[requiredChainAddresses.length - 1]?.address;

    if (!isPending) {
      if (allAddressesSet) {
        return SwapExecutionState.ready;
      }
      if (!lastChainAddress) {
        return SwapExecutionState.destinationAddressUnset;
      }
      return SwapExecutionState.recoveryAddressUnset;
    }
    if (isSuccess) {
      return SwapExecutionState.confirmed;
    }
    return SwapExecutionState.pending;
  }, [chainAddresses, isPending, isSuccess, route?.requiredChainAddresses]);

  const renderMainButton = useMemo(() => {
    switch (swapExecutionState) {
      case SwapExecutionState.recoveryAddressUnset:
        return (
          <MainButton
            label="Set recovery address"
            icon={ICONS.rightArrow}
            onClick={connectRequiredChains}
          />
        );
      case SwapExecutionState.destinationAddressUnset:
        return (
          <MainButton
            label="Set destination address"
            icon={ICONS.rightArrow}
            onClick={() => modal.show()}
          />
        );
      case SwapExecutionState.ready:
        return (
          <MainButton
            label="Confirm swap"
            icon={ICONS.rightArrow}
            onClick={mutate}
          />
        );
      case SwapExecutionState.pending:
        return (
          <MainButton
            label="Swap in progress"
            loading
            loadingTimeString={`${(clientOperations.length * TX_DELAY_MS) / 1000
              } secs.`}
          />
        );
      case SwapExecutionState.confirmed:
        return (
          <MainButton
            label="Swap Complete"
            icon={ICONS.checkmark}
            backgroundColor={theme.success.text}
          />
        );
    }
  }, [
    clientOperations.length,
    connectRequiredChains,
    modal,
    mutate,
    swapExecutionState,
    theme.success.text,
  ]);

  const SwapExecutionPageRoute = useMemo(() => {
    if (simpleRoute) {
      return withBoundProps(SwapExecutionPageRouteSimple, {
        onClickEditDestinationWallet: () => {
          modal.show();
        },
      });
    }
    return SwapExecutionPageRouteDetailed;
  }, [modal, simpleRoute]);

  return (
    <Column gap={5}>
      <SwapPageHeader
        leftButton={{
          label: "Back",
          icon: ICONS.thinArrow,
          onClick: () => setCurrentPage(Routes.SwapPage),
        }}
        rightButton={{
          label: simpleRoute ? "Details" : "Hide details",
          icon: simpleRoute ? ICONS.hamburger : ICONS.horizontalLine,
          onClick: () => setSimpleRoute(!simpleRoute),
        }}
      />
      <SwapExecutionPageRoute
        txStateMap={txStateMap}
        operations={clientOperations}
      />
      {renderMainButton}
      <SwapPageFooter showRouteInfo />
    </Column>
  );
};
