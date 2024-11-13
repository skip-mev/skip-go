import { Column } from "@/components/Layout";
import { MainButton } from "@/components/MainButton";
import {
  StyledSignatureRequiredContainer,
  SwapPageFooter,
} from "@/pages/SwapPage/SwapPageFooter";
import { SwapPageHeader } from "@/pages/SwapPage/SwapPageHeader";
import { useMemo, useState } from "react";
import { ICONS } from "@/icons";
import { useTheme } from "styled-components";
import { useAtomValue, useSetAtom } from "jotai";
import { SwapExecutionPageRouteSimple } from "./SwapExecutionPageRouteSimple";
import { SwapExecutionPageRouteDetailed } from "./SwapExecutionPageRouteDetailed";

import { currentPageAtom, Routes } from "@/state/router";
import { ClientOperation, getClientOperations } from "@/utils/clientType";
import {
  chainAddressesAtom,
  skipSubmitSwapExecutionAtom,
  swapExecutionStateAtom,
} from "@/state/swapExecutionPage";
import { useAutoSetAddress } from "@/hooks/useAutoSetAddress";
import { convertSecondsToMinutesOrHours } from "@/utils/number";
import { SignatureIcon } from "@/icons/SignatureIcon";
import pluralize from "pluralize";
import { useBroadcastedTxsStatus } from "./useBroadcastedTxs";
import { useHandleTransactionTimeout } from "./useHandleTransactionTimeout";
import { useSyncTxStatus } from "./useSyncTxStatus";
import { clearAssetInputAmountsAtom } from "@/state/swapPage";
import NiceModal from "@ebay/nice-modal-react";
import { Modals } from "@/modals/registerModals";
import { errorAtom, ErrorType } from "@/state/errorPage";

export enum SwapExecutionState {
  recoveryAddressUnset,
  destinationAddressUnset,
  ready,
  pending,
  waitingForSigning,
  signaturesRemaining,
  confirmed,
  validatingGasBalance,
  approving
}

export const SwapExecutionPage = () => {
  const theme = useTheme();
  const setError = useSetAtom(errorAtom);
  const setCurrentPage = useSetAtom(currentPageAtom);
  const {
    route,
    overallStatus,
    transactionDetailsArray,
    isValidatingGasBalance,
  } = useAtomValue(swapExecutionStateAtom);
  const chainAddresses = useAtomValue(chainAddressesAtom);
  const { connectRequiredChains } = useAutoSetAddress();
  const [simpleRoute, setSimpleRoute] = useState(true);
  const clearAssetInputAmounts = useSetAtom(clearAssetInputAmountsAtom);

  const { mutate: submitExecuteRouteMutation } = useAtomValue(
    skipSubmitSwapExecutionAtom
  );

  const signaturesRemaining =
    (route?.txsRequired ?? 0) - transactionDetailsArray?.length;

  const { data: statusData } = useBroadcastedTxsStatus({
    txsRequired: route?.txsRequired,
    txs: transactionDetailsArray,
  });

  useSyncTxStatus({
    statusData,
  });

  const clientOperations = useMemo(() => {
    if (!route?.operations) return [] as ClientOperation[];
    return getClientOperations(route.operations);
  }, [route?.operations]);

  const lastOperation = clientOperations[clientOperations.length - 1];

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
      if (signaturesRemaining > 0) {
        return SwapExecutionState.signaturesRemaining;
      }
      return SwapExecutionState.pending;
    }
    if (overallStatus === "approving") {
      return SwapExecutionState.approving;
    }
    if (
      isValidatingGasBalance?.status !== "completed" &&
      !!isValidatingGasBalance
    ) {
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
  }, [
    chainAddresses,
    isValidatingGasBalance,
    overallStatus,
    route?.requiredChainAddresses,
    signaturesRemaining,
  ]);

  useHandleTransactionTimeout(swapExecutionState);

  const renderSignaturesStillRequired = useMemo(() => {
    if (signaturesRemaining) {
      return (
        <StyledSignatureRequiredContainer gap={5} align="center">
          <SignatureIcon />
          {signaturesRemaining} {pluralize("Signature", signaturesRemaining)}{" "}
          still required
        </StyledSignatureRequiredContainer>
      );
    }
  }, [signaturesRemaining]);

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
              NiceModal.show(Modals.SetAddressModal, {
                signRequired: lastOperation.signRequired,
                chainId: destinationChainID,
              });
            }}
          />
        );
      case SwapExecutionState.ready: {
        const onClickConfirmSwap = () => {
          if (route?.txsRequired && route.txsRequired > 1) {
            setError({
              errorType: ErrorType.AdditionalSigningRequired,
              onClickContinue: () => submitExecuteRouteMutation(),
              signaturesRequired: route.txsRequired,
            });
            return;
          }
          submitExecuteRouteMutation();
        };
        return (
          <MainButton
            label="Confirm swap"
            icon={ICONS.rightArrow}
            onClick={onClickConfirmSwap}
          />
        );
      }
      case SwapExecutionState.validatingGasBalance:
        return (
          <MainButton
            label="Validating gas and balance"
            icon={ICONS.rightArrow}
            loading
          />
        );
      case SwapExecutionState.waitingForSigning:
        return (
          <MainButton label="Confirm swap" icon={ICONS.rightArrow} loading />
        );
      case SwapExecutionState.approving:
        return (
          <MainButton label="Approving allowance" icon={ICONS.rightArrow} loading />
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
      case SwapExecutionState.signaturesRemaining:
        return (
          <MainButton
            label={`${signaturesRemaining} ${pluralize(
              "signature",
              signaturesRemaining
            )} ${signaturesRemaining > 1 ? "are" : "is"} still required`}
            loading
            loadingTimeString={convertSecondsToMinutesOrHours(
              route?.estimatedRouteDurationSeconds
            )}
          />
        );
      case SwapExecutionState.confirmed:
        return (
          <MainButton
            label="Swap again"
            icon={ICONS.checkmark}
            backgroundColor={theme.success.text}
            onClick={() => {
              clearAssetInputAmounts();
              setCurrentPage(Routes.SwapPage);
            }}
          />
        );
    }
  }, [
    clearAssetInputAmounts,
    connectRequiredChains,
    lastOperation.signRequired,
    route?.destAssetChainID,
    route?.estimatedRouteDurationSeconds,
    route?.txsRequired,
    setCurrentPage,
    setError,
    signaturesRemaining,
    submitExecuteRouteMutation,
    swapExecutionState,
    theme.success.text,
  ]);

  const SwapExecutionPageRoute = simpleRoute
    ? SwapExecutionPageRouteSimple
    : SwapExecutionPageRouteDetailed;

  return (
    <Column gap={5}>
      <SwapPageHeader
        leftButton={
          simpleRoute
            ? {
              label: "Back",
              icon: ICONS.thinArrow,
              onClick: () => setCurrentPage(Routes.SwapPage),
            }
            : undefined
        }
        rightButton={{
          label: simpleRoute ? "Details" : "Hide details",
          icon: simpleRoute ? ICONS.hamburger : ICONS.horizontalLine,
          onClick: () => setSimpleRoute(!simpleRoute),
        }}
      />
      <SwapExecutionPageRoute
        onClickEditDestinationWallet={() =>
          NiceModal.show(Modals.SetAddressModal, {
            chainId: route?.destAssetChainID,
            signRequired: lastOperation.signRequired,
          })
        }
        operations={clientOperations}
        statusData={statusData}
        swapExecutionState={swapExecutionState}
      />
      {renderMainButton}
      <SwapPageFooter
        showRouteInfo={overallStatus === undefined}
        rightContent={renderSignaturesStillRequired}
      />
    </Column>
  );
};
