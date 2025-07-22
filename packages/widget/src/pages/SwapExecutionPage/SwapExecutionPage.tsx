import { Column, Row } from "@/components/Layout";
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
  gasOnReceiveAtom,
  gasOnReceiveAtomEffect,
  gasOnReceiveRouteAtom,
  isSomeDestinationFeeBalanceAvailableAtom,
} from "@/state/gasOnReceive";
import { SkeletonElement } from "@/components/Skeleton";
import { Switch } from "@/components/Switch";
import { SmallText } from "@/components/Typography";
import { GasIcon } from "@/icons/GasIcon";
import { formatUSD } from "@/utils/intl";
import styled, { useTheme } from "styled-components";
import { skipAssetsAtom } from "@/state/skipClient";

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
}

export const SwapExecutionPage = () => {
  const setCurrentPage = useSetAtom(currentPageAtom);
  const { route, clientOperations } = useAtomValue(swapExecutionStateAtom);
  const currentTransaction = useAtomValue(currentTransactionAtom);
  const chainAddresses = useAtomValue(chainAddressesAtom);
  const { connectRequiredChains, isLoading: isGettingAddressesLoading } = useAutoSetAddress();
  const [simpleRoute, setSimpleRoute] = useState(true);
  const isSomeDestinationFeeBalanceAvailable = useAtomValue(
    isSomeDestinationFeeBalanceAvailableAtom,
  );
  const isFetchingDestinationBalance = isSomeDestinationFeeBalanceAvailable.isLoading;
  useAtom(gasOnReceiveAtomEffect);
  useAtom(gasRouteEffect);

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
    route,
    isGettingAddressesLoading,
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
        bottomContent={<GasOnReceive />}
      />
      <SwapExecutionButton
        swapExecutionState={swapExecutionState}
        route={route}
        signaturesRemaining={signaturesRemaining}
        lastOperation={lastOperation}
        connectRequiredChains={connectRequiredChains}
        submitExecuteRouteMutation={submitExecuteRouteMutation}
      />
      <SwapPageFooter />
    </Column>
  );
};

const GasOnReceive = () => {
  const theme = useTheme();
  const [gasOnReceive, setGasOnReceive] = useAtom(gasOnReceiveAtom);
  const { data: gasRoute, isLoading: fetchingGasRoute } = useAtomValue(gasOnReceiveRouteAtom);
  const { data: assets } = useAtomValue(skipAssetsAtom);
  const isSomeDestinationFeeBalanceAvailable = useAtomValue(
    isSomeDestinationFeeBalanceAvailableAtom,
  );
  const isFetchingBalance = isSomeDestinationFeeBalanceAvailable.isLoading;
  const gasOnReceiveAsset = useMemo(() => {
    if (!gasRoute?.gasOnReceiveAsset) return;

    const asset = assets?.find(
      (a) =>
        a.chainId === gasRoute.gasOnReceiveAsset?.chainId &&
        a.denom === gasRoute.gasOnReceiveAsset?.denom,
    );
    return asset;
  }, [assets, gasRoute?.gasOnReceiveAsset]);

  if (!gasRoute?.gasOnReceiveAsset) {
    return null;
  }
  return (
    <GasOnReceiveWrapper>
      <>
        <Row gap={8} align="center">
          <GasIcon color={theme.primary.text.lowContrast} />
          {isFetchingBalance || fetchingGasRoute ? (
            <SkeletonElement height={20} width={300} />
          ) : (
            <SmallText>
              {gasOnReceive
                ? `You'll receive ${formatUSD(gasRoute?.gasOnReceiveAsset?.amountUsd ?? "")} in ${gasOnReceiveAsset?.recommendedSymbol?.toUpperCase()} as gas top-up`
                : "Gas top up available, enable to receive gas on destination"}
            </SmallText>
          )}
        </Row>
        {!isFetchingBalance && (
          <Switch
            checked={gasOnReceive}
            onChange={(v) => {
              setGasOnReceive(v);
            }}
          />
        )}
      </>
    </GasOnReceiveWrapper>
  );
};

const GasOnReceiveWrapper = styled(Row)`
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-top: 20px;
  margin-top: 20px;
  border-top: 1px solid ${({ theme }) => theme.secondary.background.normal};
`;
