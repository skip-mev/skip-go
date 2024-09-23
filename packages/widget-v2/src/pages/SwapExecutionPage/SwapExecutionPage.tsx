import { Column } from "@/components/Layout";
import { MainButton } from "@/components/MainButton";
import { SwapPageFooter } from "@/pages/SwapPage/SwapPageFooter";
import { SwapPageHeader } from "@/pages/SwapPage/SwapPageHeader";
import { useMemo, useState } from "react";
import { ICONS } from "@/icons";
import { ManualAddressModal } from "@/modals/ManualAddressModal/ManualAddressModal";
import { useTheme } from "styled-components";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { getOverallSwapState, SwapExecutionPageRouteSimple } from "./SwapExecutionPageRouteSimple";
import { SwapExecutionPageRouteDetailed } from "./SwapExecutionPageRouteDetailed";

import { useModal } from "@/components/Modal";
import { currentPageAtom, Routes } from "@/state/router";
import {
  ClientOperation,
  ClientTransferEvent,
  getClientOperations,
  getSimpleStatus,
  getTransferEventsFromTxStatusResponse,
} from "@/utils/clientType";
import {
  chainAddressesAtom,
  skipSubmitSwapExecutionAtom,
  skipTransactionStatusAtom,
  swapExecutionStateAtom,
} from "@/state/swapExecutionPage";
import { useAutoSetAddress } from "@/hooks/useAutoSetAddress";

enum SwapExecutionState {
  recoveryAddressUnset,
  destinationAddressUnset,
  ready,
  pending,
  waitingForSigning,
  confirmed,
}

const TX_DELAY_MS = 5_000;

export const SwapExecutionPage = () => {
  const theme = useTheme();
  const setCurrentPage = useSetAtom(currentPageAtom);
  const { route } = useAtomValue(swapExecutionStateAtom);
  const chainAddresses = useAtomValue(chainAddressesAtom);
  const { connectRequiredChains } = useAutoSetAddress();
  const [{ data: transactionStatus }] = useAtom(skipTransactionStatusAtom);

  const clientOperations = useMemo(() => {
    if (!route?.operations) return [] as ClientOperation[];
    return getClientOperations(route.operations);
  }, [route?.operations]);

  const operationTransferEvents = useMemo(() => {
    const transferEvents =
      getTransferEventsFromTxStatusResponse(transactionStatus);
    if (!clientOperations) return [];
    return clientOperations.map((operation) => {
      const transferEvent = transferEvents?.find(
        (transferEvent) => transferEvent.fromChainID === operation.fromChainID
      );
      if (!transferEvent) return;
      transferEvent.status = getSimpleStatus(transferEvent?.state);
      return transferEvent;
    }).filter(transferEvent => transferEvent) as ClientTransferEvent[];
  }, [clientOperations, transactionStatus]);

  const overallSwapState = getOverallSwapState(operationTransferEvents);

  const [simpleRoute, setSimpleRoute] = useState(true);
  const modal = useModal(ManualAddressModal);

  const { mutate, isPending } = useAtomValue(
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

    if (overallSwapState === "completed") {
      return SwapExecutionState.confirmed;
    }
    if (overallSwapState === "pending") {
      return SwapExecutionState.pending;
    }
    if (isPending) {
      return SwapExecutionState.waitingForSigning;
    }
    if (!lastChainAddress) {
      return SwapExecutionState.destinationAddressUnset;
    }
    if (!allAddressesSet) {
      return SwapExecutionState.recoveryAddressUnset;
    }
    return SwapExecutionState.ready;
  }, [chainAddresses, isPending, overallSwapState, route?.requiredChainAddresses]);

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
          <MainButton
            label="Confirm swap"
            icon={ICONS.rightArrow}
            loading
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
          operationTransferEvents={operationTransferEvents}
        />
      ) : (
        <SwapExecutionPageRouteDetailed
          operations={clientOperations}
          operationTransferEvents={operationTransferEvents}
        />
      )}
      {renderMainButton}
      <SwapPageFooter showRouteInfo />
    </Column>
  );
};
