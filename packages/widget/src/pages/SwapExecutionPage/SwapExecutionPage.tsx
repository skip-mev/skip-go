import { Column } from "@/components/Layout";
import { SwapPageFooter } from "@/pages/SwapPage/SwapPageFooter";
import { SwapPageHeader } from "@/pages/SwapPage/SwapPageHeader";
import { useMemo, useState } from "react";
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
  const {
    route,
    overallStatus,
    transactionDetailsArray,
    isValidatingGasBalance,
  } = useAtomValue(swapExecutionStateAtom);
  const chainAddresses = useAtomValue(chainAddressesAtom);
  const { connectRequiredChains } = useAutoSetAddress();
  const [simpleRoute, setSimpleRoute] = useState(true);


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

  const swapExecutionState = useSwapExecutionState({
    chainAddresses,
    route,
    overallStatus,
    isValidatingGasBalance,
    signaturesRemaining,
  });

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
