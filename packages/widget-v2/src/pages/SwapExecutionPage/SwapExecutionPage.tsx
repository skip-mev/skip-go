import { Column } from "@/components/Layout";
import { MainButton } from "@/components/MainButton";
import {
  StyledSignatureRequiredContainer,
  SwapPageFooter,
} from "@/pages/SwapPage/SwapPageFooter";
import { SwapPageHeader } from "@/pages/SwapPage/SwapPageHeader";
import { useMemo, useState } from "react";
import { ICONS } from "@/icons";
import { SetAddressModal } from "@/modals/SetAddressModal/SetAddressModal";
import { useTheme } from "styled-components";
import { useAtomValue, useSetAtom } from "jotai";
import { SwapExecutionPageRouteSimple } from "./SwapExecutionPageRouteSimple";
import { SwapExecutionPageRouteDetailed } from "./SwapExecutionPageRouteDetailed";

import { useModal } from "@/components/Modal";
import { currentPageAtom, Routes } from "@/state/router";
import { ClientOperation, getClientOperations } from "@/utils/clientType";
import {
  chainAddressesAtom,
  skipSubmitSwapExecutionAtom,
  swapExecutionStateAtom,
} from "@/state/swapExecutionPage";
import { useAutoSetAddress } from "@/hooks/useAutoSetAddress";
import { convertSecondsToMinutesOrHours } from "@/utils/number";
import { useFetchTransactionStatus } from "./useFetchTransactionStatus";
import { getSignRequiredChainIds } from "@/utils/operations";
import { SignatureIcon } from "@/icons/SignatureIcon";
import pluralize from "pluralize";

enum SwapExecutionState {
  recoveryAddressUnset,
  destinationAddressUnset,
  ready,
  pending,
  waitingForSigning,
  confirmed,
  validatingGasBalance
}

export const SwapExecutionPage = () => {
  const theme = useTheme();
  const setCurrentPage = useSetAtom(currentPageAtom);
  const { route, overallStatus, transactionDetailsArray, isValidatingGasBalance } = useAtomValue(
    swapExecutionStateAtom
  );
  const chainAddresses = useAtomValue(chainAddressesAtom);
  const { connectRequiredChains } = useAutoSetAddress();
  const [simpleRoute, setSimpleRoute] = useState(true);
  const setManualAddressModal = useModal(SetAddressModal);

  const { mutate } = useAtomValue(skipSubmitSwapExecutionAtom);
  const operationToTransferEventsMap = useFetchTransactionStatus();

  const clientOperations = useMemo(() => {
    if (!route?.operations) return [] as ClientOperation[];
    return getClientOperations(route.operations);
  }, [route?.operations]);

  const signRequiredChains = useMemo(() => {
    const signRequiredChains = getSignRequiredChainIds(clientOperations);
    return signRequiredChains;
  }, [clientOperations]);

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
    if (isValidatingGasBalance?.status !== "completed" && !!isValidatingGasBalance) {
      return SwapExecutionState.validatingGasBalance;
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
  }, [chainAddresses, isValidatingGasBalance, overallStatus, route?.requiredChainAddresses]);

  const renderSignaturesStillRequired = useMemo(() => {
    const signaturesRemaining =
      (route?.txsRequired ?? 0) - transactionDetailsArray?.length;
    if (
      signaturesRemaining > 0
    ) {
      return (
        <StyledSignatureRequiredContainer gap={5} align="center">
          <SignatureIcon />
          {signaturesRemaining} {pluralize("Signature", signaturesRemaining)}{" "}
          still required
        </StyledSignatureRequiredContainer>
      );
    }
  }, [route?.txsRequired, transactionDetailsArray?.length]);

  const renderMainButton = useMemo(() => {
    switch (swapExecutionState) {
      case SwapExecutionState.recoveryAddressUnset:
        return (
          <MainButton
            label="Set recovery address"
            icon={ICONS.rightArrow}
            onClick={() => {
              connectRequiredChains(true);
            }}
          />
        );
      case SwapExecutionState.destinationAddressUnset:
        return (
          <MainButton
            label="Set destination address"
            icon={ICONS.rightArrow}
            onClick={() => {
              const destinationChainID = route?.destAssetChainID;
              if (!destinationChainID) return;
              setManualAddressModal.show({
                signRequired: signRequiredChains.includes(destinationChainID),
                chainId: destinationChainID,
              });
            }}
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
      case SwapExecutionState.validatingGasBalance:
        return (
          <MainButton label="Validating gas and balance" icon={ICONS.rightArrow} loading />
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
            onClick={() => setCurrentPage(Routes.SwapPage)}
          />
        );
    }
  }, [
    connectRequiredChains,
    mutate,
    route?.destAssetChainID,
    route?.estimatedRouteDurationSeconds,
    setCurrentPage,
    setManualAddressModal,
    signRequiredChains,
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
          onClickEditDestinationWallet={() =>
            setManualAddressModal.show({
              chainId: route?.destAssetChainID,
            })
          }
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
      <SwapPageFooter
        showRouteInfo={overallStatus === undefined}
        rightContent={renderSignaturesStillRequired}
      />
    </Column>
  );
};
