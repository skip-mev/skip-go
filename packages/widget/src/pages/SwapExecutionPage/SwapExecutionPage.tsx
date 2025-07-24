import { Column, Spacer } from "@/components/Layout";
import { SwapPageFooter } from "@/pages/SwapPage/SwapPageFooter";
import { PageHeader } from "@/components/PageHeader";
import React, { useMemo, useState } from "react";
import { ICONS } from "@/icons";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { SwapExecutionPageRouteSimple } from "./SwapExecutionPageRouteSimple";
import { SwapExecutionPageRouteDetailed } from "./SwapExecutionPageRouteDetailed";
import { currentPageAtom, Routes } from "@/state/router";
import {
  chainAddressesAtom,
  feeRouteAddressesAtomEffect,
  feeRouteChainAddressesAtom,
  gasRouteEffect,
  skipSubmitSwapExecutionAtom,
  swapExecutionStateAtom,
} from "@/state/swapExecutionPage";
import { useAutoSetAddress } from "@/hooks/useAutoSetAddress";
import { useHandleTransactionTimeout } from "./useHandleTransactionTimeout";
import NiceModal from "@ebay/nice-modal-react";
import { Modals } from "@/modals/registerModals";
import { useSwapExecutionState } from "./useSwapExecutionState";
import { SwapExecutionButton } from "./SwapExecutionButton";
import { useHandleTransactionFailed } from "./useHandleTransactionFailed";
import { track } from "@amplitude/analytics-browser";
import { createSkipExplorerLink } from "@/utils/explorerLink";
import { usePreventPageUnload } from "@/hooks/usePreventPageUnload";
import { currentTransactionAtom } from "@/state/history";
import {
  gasOnReceiveAtomEffect,
  gasOnReceiveRouteAtom,
  isSomeDestinationFeeBalanceAvailableAtom,
} from "@/state/gasOnReceive";
import { GasOnReceive } from "@/components/GasOnReceive";
import { useFeeRouteAutoSetAddress } from "@/hooks/useFeeRouteAutoSetAddress";
import { useTheme } from "styled-components";

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
  pendingGettingAddresses,
  pendingGettingDestinationBalance,
  pendingGettingFeeRouteAddresses,
  feeRouteRecoveryAddressUnset,
}

export const SwapExecutionPage = () => {
  const theme = useTheme();
  const setCurrentPage = useSetAtom(currentPageAtom);
  const { route, clientOperations, feeRoute } = useAtomValue(swapExecutionStateAtom);
  const currentTransaction = useAtomValue(currentTransactionAtom);
  const chainAddresses = useAtomValue(chainAddressesAtom);
  const feeRouteChainAddresses = useAtomValue(feeRouteChainAddressesAtom);
  console.log("feeRouteChainAddresses", feeRouteChainAddresses);
  const { connectRequiredChains, isLoading: isGettingAddressesLoading } = useAutoSetAddress();
  const {
    connectRequiredChains: connectFeeRouteRequiredChains,
    isLoading: isGettingFeeRouteAddressesLoading,
  } = useFeeRouteAutoSetAddress();

  const [simpleRoute, setSimpleRoute] = useState(true);
  const isSomeDestinationFeeBalanceAvailable = useAtomValue(
    isSomeDestinationFeeBalanceAvailableAtom,
  );
  const { data: gasRoute, isLoading: isGasRouteLoading } = useAtomValue(gasOnReceiveRouteAtom);

  const isFetchingDestinationBalance =
    isSomeDestinationFeeBalanceAvailable.isLoading || isGasRouteLoading;

  useAtom(gasRouteEffect);
  useAtom(feeRouteAddressesAtomEffect);
  useAtom(gasOnReceiveAtomEffect);

  const { mutate: submitExecuteRouteMutation, error } = useAtomValue(skipSubmitSwapExecutionAtom);

  const signaturesRemaining = useMemo(() => {
    if (!currentTransaction) return 0;

    return currentTransaction.txsRequired - currentTransaction.txsSigned;
  }, [currentTransaction]);

  const lastTransaction = currentTransaction?.transactionDetails.at(-1);
  const lastTxHash = lastTransaction?.txHash;
  const lastTxChainId = lastTransaction?.chainId;

  const lastOperation = clientOperations[clientOperations.length - 1];

  const swapExecutionState = useSwapExecutionState({
    chainAddresses,
    requiredChainAddresses: route?.requiredChainAddresses,
    feeRouteChainAddresses: feeRouteChainAddresses,
    feeRouteRequiredChainAddresses: feeRoute?.requiredChainAddresses,
    isGettingAddressesLoading: isGettingAddressesLoading,
    isGettingFeeRouteAddressesLoading: isGettingFeeRouteAddressesLoading,
    isFetchingDestinationBalance,
  });

  const isSafeToleave = route?.txsRequired === currentTransaction?.transactionDetails.length;

  usePreventPageUnload(
    swapExecutionState === SwapExecutionState.signaturesRemaining ||
      swapExecutionState === SwapExecutionState.waitingForSigning ||
      swapExecutionState === SwapExecutionState.approving ||
      swapExecutionState === SwapExecutionState.validatingGasBalance ||
      !isSafeToleave,
  );

  useHandleTransactionFailed(error as Error, currentTransaction);
  useHandleTransactionTimeout(swapExecutionState);

  const firstOperationStatus = useMemo(() => {
    if (
      swapExecutionState === SwapExecutionState.confirmed ||
      swapExecutionState === SwapExecutionState.pending ||
      swapExecutionState === SwapExecutionState.signaturesRemaining
    ) {
      return "completed";
    }
  }, [swapExecutionState]);

  const secondOperationStatus = useMemo(() => {
    const status = currentTransaction?.transferEvents;

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
  }, [currentTransaction?.transferEvents, swapExecutionState]);

  const onClickEditDestinationWallet = useMemo(() => {
    track("swap execution page: edit destination address button - clicked");
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
        signRequired:
          lastOperation.signRequired && lastOperation.fromChain === route?.destAssetChainId,
        chainId: route?.destAssetChainId,
        chainAddressIndex: route ? route?.requiredChainAddresses.length - 1 : undefined,
      });
    };
  }, [swapExecutionState, lastOperation.signRequired, lastOperation.fromChain, route]);

  const SwapExecutionPageRoute = simpleRoute
    ? SwapExecutionPageRouteSimple
    : SwapExecutionPageRouteDetailed;

  const shouldRenderTrackProgressButton =
    lastTxHash &&
    lastTxChainId &&
    route?.txsRequired === currentTransaction?.transactionDetails.length;
  console.log("ct", currentTransaction);
  return (
    <Column gap={5}>
      <PageHeader
        leftButton={
          simpleRoute
            ? {
                label: "Back",
                icon: ICONS.thinArrow,
                onClick: () => {
                  track("swap execution page: back button - clicked");
                  setCurrentPage(Routes.SwapPage);
                },
              }
            : undefined
        }
        centerButton={
          shouldRenderTrackProgressButton
            ? {
                label: "Track progress",
                onClick: () => {
                  window.open(
                    createSkipExplorerLink(currentTransaction?.transactionDetails),
                    "_blank",
                  );
                  track("swap execution page: track progress button - clicked", {
                    txHash: lastTxHash,
                  });
                },
              }
            : undefined
        }
        rightButton={{
          label: simpleRoute ? "Details" : "Hide details",
          icon: simpleRoute ? ICONS.hamburger : ICONS.horizontalLine,
          onClick: () => {
            track("swap execution page: toggle route details button - clicked", {
              shown: simpleRoute ? "simple" : "detailed",
            });
            setSimpleRoute(!simpleRoute);
          },
        }}
      />
      <SwapExecutionPageRoute
        onClickEditDestinationWallet={onClickEditDestinationWallet}
        operations={clientOperations}
        statusData={currentTransaction}
        swapExecutionState={swapExecutionState}
        firstOperationStatus={firstOperationStatus}
        secondOperationStatus={secondOperationStatus}
        bottomContent={
          (gasRoute !== undefined || feeRoute !== undefined) &&
          !isGasRouteLoading && (
            <Column>
              <Spacer height={30} showLine lineColor={theme.secondary.background.transparent} />
              <GasOnReceive routeDetails={currentTransaction?.relatedRoutes?.[0]} />
            </Column>
          )
        }
      />
      <SwapExecutionButton
        swapExecutionState={swapExecutionState}
        route={route}
        signaturesRemaining={signaturesRemaining}
        lastOperation={lastOperation}
        connectRequiredChains={connectRequiredChains}
        connectFeeRouteRequiredChains={connectFeeRouteRequiredChains}
        submitExecuteRouteMutation={submitExecuteRouteMutation}
      />
      <SwapPageFooter />
    </Column>
  );
};
