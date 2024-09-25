import { Column } from "@/components/Layout";
import { MainButton } from "@/components/MainButton";
import { SwapPageFooter } from "@/pages/SwapPage/SwapPageFooter";
import { SwapPageHeader } from "@/pages/SwapPage/SwapPageHeader";
import { useEffect, useMemo, useState } from "react";
import { ICONS } from "@/icons";
import { ManualAddressModal } from "@/modals/ManualAddressModal/ManualAddressModal";
import { useTheme } from "styled-components";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { SwapExecutionPageRouteSimple } from "./SwapExecutionPageRouteSimple";
import { SwapExecutionPageRouteDetailed } from "./SwapExecutionPageRouteDetailed";

import { useModal } from "@/components/Modal";
import { currentPageAtom, Routes } from "@/state/router";
import {
  ClientOperation,
  getClientOperations,
} from "@/utils/clientType";
import {
  chainAddressesAtom,
  skipSubmitSwapExecutionAtom,
  swapExecutionStateAtom,
} from "@/state/swapExecutionPage";
import { useAutoSetAddress } from "@/hooks/useAutoSetAddress";
import { convertSecondsToMinutesOrHours } from "@/utils/number";
import { useFetchTransactionStatus } from "./useFetchTransactionStatus";

enum SwapExecutionState {
  recoveryAddressUnset,
  destinationAddressUnset,
  ready,
  pending,
  waitingForSigning,
  confirmed,
}

export const SwapExecutionPage = () => {
  const theme = useTheme();
  const setCurrentPage = useSetAtom(currentPageAtom);
  const {
    route,
    overallStatus,
  } = useAtomValue(swapExecutionStateAtom);
  const chainAddresses = useAtomValue(chainAddressesAtom);
  const { connectRequiredChains } = useAutoSetAddress();
  const [simpleRoute, setSimpleRoute] = useState(true);
  const modal = useModal(ManualAddressModal);

  const { mutate } = useAtomValue(skipSubmitSwapExecutionAtom);
  const operationToTransferEventsMap = useFetchTransactionStatus();

  const clientOperations = useMemo(() => {
    if (!route?.operations) return [] as ClientOperation[];
    return getClientOperations(route.operations);
  }, [route?.operations]);

  const swapExecutionState = useMemo(() => {
    if (!chainAddresses) return;
    const requiredChainAddresses = route?.requiredChainAddresses;
    if (!requiredChainAddresses) return;
    const allAddressesSet = requiredChainAddresses.every(
      (_chainId, index) => chainAddresses[index]?.address
    );
    const lastChainAddress =
      chainAddresses[requiredChainAddresses.length - 1]?.address;

    if (overallStatus === "completed") {
      return SwapExecutionState.confirmed;
    }
    if (overallStatus === "pending") {
      return SwapExecutionState.pending;
    }
    if (overallStatus === "signing") {
      return SwapExecutionState.waitingForSigning;
    }
    if (!lastChainAddress) {
      return SwapExecutionState.destinationAddressUnset;
    }
    if (!allAddressesSet) {
      return SwapExecutionState.recoveryAddressUnset;
    }
    return SwapExecutionState.ready;
  }, [chainAddresses, overallStatus, route?.requiredChainAddresses]);

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
      case SwapExecutionState.waitingForSigning:
        return (
          <MainButton label="Confirm swap" icon={ICONS.rightArrow} loading />
        );
      case SwapExecutionState.pending:
        return (
          <MainButton
            label="Swap in progress"
            loading
            loadingTimeString={convertSecondsToMinutesOrHours(
              route?.estimatedRouteDurationSeconds
            )}
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
    connectRequiredChains,
    modal,
    mutate,
    route?.estimatedRouteDurationSeconds,
    swapExecutionState,
    theme.success.text,
  ]);

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
      {simpleRoute ? (
        <SwapExecutionPageRouteSimple
          onClickEditDestinationWallet={() => modal.show()}
          operations={clientOperations}
          operationToTransferEventsMap={operationToTransferEventsMap}
        />
      ) : (
        <SwapExecutionPageRouteDetailed
          operations={clientOperations}
          operationToTransferEventsMap={operationToTransferEventsMap}
        />
      )}
      {renderMainButton}
      <SwapPageFooter showRouteInfo />
    </Column>
  );
};
