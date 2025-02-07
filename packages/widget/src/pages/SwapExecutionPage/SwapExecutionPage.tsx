import { Column } from "@/components/Layout";
import { SwapPageFooter } from "@/pages/SwapPage/SwapPageFooter";
import { SwapPageHeader } from "@/pages/SwapPage/SwapPageHeader";
import { useEffect, useMemo, useState } from "react";
import { ICONS } from "@/icons";
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
import { useBroadcastedTxsStatus } from "./useBroadcastedTxs";
import { useHandleTransactionTimeout } from "./useHandleTransactionTimeout";
import { useSyncTxStatus } from "./useSyncTxStatus";
import NiceModal from "@ebay/nice-modal-react";
import { Modals } from "@/modals/registerModals";
import { useSwapExecutionState } from "./useSwapExecutionState";
import { SwapExecutionButton } from "./SwapExecutionButton";
import { StyledSignatureRequiredContainer } from "@/pages/SwapPage/SwapPageFooter";
import { SignatureIcon } from "@/icons/SignatureIcon";
import pluralize from "pluralize";
import { useHandleTransactionFailed } from "./useHandleTransactionFailed";

export enum SwapExecutionState {
  recoveryAddressUnset,
  destinationAddressUnset,
  ready,
  pending,
  waitingForSigning,
  signaturesRemaining,
  confirmed,
  validatingGasBalance,
  approving,
}

export const SwapExecutionPage = () => {
  const setCurrentPage = useSetAtom(currentPageAtom);
  const { route, overallStatus, transactionDetailsArray, isValidatingGasBalance } =
    useAtomValue(swapExecutionStateAtom);
  const chainAddresses = useAtomValue(chainAddressesAtom);
  const { connectRequiredChains } = useAutoSetAddress();
  const [simpleRoute, setSimpleRoute] = useState(true);

  useEffect(() => {
    connectRequiredChains();
  }, [connectRequiredChains]);

  const { mutate: submitExecuteRouteMutation } = useAtomValue(skipSubmitSwapExecutionAtom);

  const shouldDisplaySignaturesRemaining = route?.txsRequired && route.txsRequired > 1;
  const signaturesRemaining = shouldDisplaySignaturesRemaining
    ? route.txsRequired - (transactionDetailsArray?.length ?? 0)
    : 0;

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

  const swapExecutionState = useSwapExecutionState({
    chainAddresses,
    route,
    overallStatus,
    isValidatingGasBalance,
    signaturesRemaining,
  });

  useHandleTransactionFailed(statusData?.isSettled && !statusData?.isSuccess);
  useHandleTransactionTimeout(swapExecutionState);

  const renderSignaturesStillRequired = useMemo(() => {
    if (shouldDisplaySignaturesRemaining && signaturesRemaining) {
      return (
        <StyledSignatureRequiredContainer gap={5} align="center">
          <SignatureIcon />
          {signaturesRemaining} {pluralize("Signature", signaturesRemaining)} still required
        </StyledSignatureRequiredContainer>
      );
    }
  }, [signaturesRemaining, shouldDisplaySignaturesRemaining]);

  const firstOperationStatus = useMemo(() => {
    const status = statusData?.transferEvents;

    if (swapExecutionState === SwapExecutionState.confirmed) {
      return "completed";
    }

    if (status?.[0]?.status) {
      return status[0].status;
    }

    if (
      swapExecutionState === SwapExecutionState.pending ||
      swapExecutionState === SwapExecutionState.signaturesRemaining
    ) {
      return "pending";
    }
  }, [statusData, swapExecutionState]);

  const onClickEditDestinationWallet = useMemo(() => {
    const loadingStates = [
      SwapExecutionState.pending,
      SwapExecutionState.waitingForSigning,
      SwapExecutionState.validatingGasBalance,
      SwapExecutionState.confirmed,
      SwapExecutionState.signaturesRemaining,
    ];

    if (loadingStates.includes(swapExecutionState)) {
      return undefined;
    }

    return () => {
      NiceModal.show(Modals.SetAddressModal, {
        chainId: route?.destAssetChainID,
      });
    };
  }, [swapExecutionState, route?.destAssetChainID]);

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
        onClickEditDestinationWallet={onClickEditDestinationWallet}
        operations={clientOperations}
        statusData={statusData}
        swapExecutionState={swapExecutionState}
        firstOperationStatus={firstOperationStatus}
      />
      <SwapExecutionButton
        swapExecutionState={swapExecutionState}
        route={route}
        signaturesRemaining={signaturesRemaining}
        lastOperation={lastOperation}
        connectRequiredChains={connectRequiredChains}
        submitExecuteRouteMutation={submitExecuteRouteMutation}
      />
      <SwapPageFooter
        showRouteInfo={overallStatus === undefined}
        rightContent={renderSignaturesStillRequired}
      />
    </Column>
  );
};
