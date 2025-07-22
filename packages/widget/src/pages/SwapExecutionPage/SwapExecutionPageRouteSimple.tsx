import { css, keyframes, styled, useTheme } from "styled-components";
import { Column, Row } from "@/components/Layout";
import { useAtom, useAtomValue } from "jotai";
import { SwapExecutionPageRouteSimpleRow } from "./SwapExecutionPageRouteSimpleRow";
import { BridgeArrowIcon } from "@/icons/BridgeArrowIcon";
import { ICONS } from "@/icons";
import { ClientOperation } from "@/utils/clientType";
import { swapExecutionStateAtom } from "@/state/swapExecutionPage";
import { SwapExecutionState } from "./SwapExecutionPage";
import { useMemo } from "react";
import { convertToPxValue } from "@/utils/style";
import { RouteDetails, TransferEventStatus } from "@skip-go/client";
import { formatUSD } from "@/utils/intl";
import {
  gasOnReceiveAtom,
  gasOnReceiveRouteAtom,
  isSomeDestinationFeeBalanceAvailableAtom,
} from "@/state/gasOnReceive";
import { GasIcon } from "@/icons/GasIcon";
import { Switch } from "@/components/Switch";
import { SmallText } from "@/components/Typography";
import { skipAssetsAtom } from "@/state/skipClient";
import { SkeletonElement } from "@/components/Skeleton";

export type SwapExecutionPageRouteProps = {
  operations: ClientOperation[];
  onClickEditDestinationWallet?: () => void;
  statusData?: RouteDetails;
  swapExecutionState?: SwapExecutionState;
  firstOperationStatus?: TransferEventStatus | undefined;
  secondOperationStatus?: TransferEventStatus | undefined;
};

export const SwapExecutionPageRouteSimple = ({
  operations,
  statusData,
  onClickEditDestinationWallet,
  swapExecutionState,
  firstOperationStatus,
}: SwapExecutionPageRouteProps) => {
  const theme = useTheme();
  const { route, originalRoute } = useAtomValue(swapExecutionStateAtom);
  const [gasOnReceive, setGasOnReceive] = useAtom(gasOnReceiveAtom);
  const { data: gasRoute, isLoading: fetchingGasRoute } = useAtomValue(gasOnReceiveRouteAtom);
  const { data: assets } = useAtomValue(skipAssetsAtom);
  const isSomeDestinationFeeBalanceAvailable = useAtomValue(
    isSomeDestinationFeeBalanceAvailableAtom,
  );

  const gasOnReceiveAsset = useMemo(() => {
    if (!gasRoute?.gasOnReceiveAsset) return;

    const asset = assets?.find(
      (a) =>
        a.chainId === gasRoute.gasOnReceiveAsset?.chainId &&
        a.denom === gasRoute.gasOnReceiveAsset?.denom,
    );
    return asset;
  }, [assets, gasRoute?.gasOnReceiveAsset]);
  const isFetchingBalance = isSomeDestinationFeeBalanceAvailable.isLoading;

  const firstOperation = operations[0];
  const lastOperation = operations[operations.length - 1];
  const status = statusData?.transferEvents;

  const destinationStatus = useMemo(() => {
    const destinationStatus = status?.[lastOperation.transferIndex]?.status;
    if (swapExecutionState === SwapExecutionState.confirmed) {
      return "completed";
    }

    if (destinationStatus) return destinationStatus;

    if (firstOperationStatus === "completed") {
      return "pending";
    }
  }, [firstOperationStatus, lastOperation.transferIndex, status, swapExecutionState]);

  const source = {
    denom: originalRoute?.sourceAssetDenom,
    tokenAmount: originalRoute?.amountIn ?? "",
    chainId: originalRoute?.sourceAssetChainId,
    usdValue: originalRoute?.usdAmountIn,
  };

  const destination = {
    denom: lastOperation.denomOut,
    tokenAmount: lastOperation.amountOut,
    chainId: lastOperation.toChainId ?? lastOperation.chainId,
    usdValue: route?.usdAmountOut,
  };

  const sourceExplorerLink = status?.[firstOperation.transferIndex]?.fromExplorerLink;
  const destinationExplorerLink = status?.[lastOperation.transferIndex]?.toExplorerLink;

  return (
    <StyledSwapExecutionPageRoute isLoading={fetchingGasRoute} justify="space-between">
      <SwapExecutionPageRouteSimpleRow
        {...source}
        status={firstOperationStatus}
        context="source"
        explorerLink={sourceExplorerLink}
      />
      <StyledBridgeArrowIcon color={theme.primary.text.normal} />
      <SwapExecutionPageRouteSimpleRow
        {...destination}
        icon={ICONS.pen}
        status={destinationStatus}
        onClickEditDestinationWallet={onClickEditDestinationWallet}
        explorerLink={destinationExplorerLink}
        context="destination"
      />

      {gasRoute?.gasOnReceiveAsset && (
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
      )}
    </StyledSwapExecutionPageRoute>
  );
};

const StyledBridgeArrowIcon = styled(BridgeArrowIcon)`
  height: 18px;
  width: 54px;
`;

const sweepRightToLeft = keyframes`
  0% {
    background-position: 100% 0;
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
  100% {
    background-position: 0% 0;
    opacity: 0.2;
  }
`;

const StyledSwapExecutionPageRoute = styled(Column)<{
  isLoading?: boolean;
}>`
  padding: 30px;
  background: ${({ theme }) => theme.primary.background.normal};
  border-radius: ${({ theme }) => convertToPxValue(theme.borderRadius?.main)};
  min-height: 225px;
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    height: 4px;
    width: 100%;
    background: ${({ theme }) => `linear-gradient(
      90deg,
      transparent 0%,
      ${theme.primary.text.normal},
      transparent 100%
    )`};
    background-size: 300% 100%;
    background-repeat: no-repeat;
    background-position: 0% 0;

    opacity: ${({ isLoading }) => (isLoading ? 1 : 0)};
    animation: ${({ isLoading }) =>
      isLoading
        ? css`
            ${sweepRightToLeft} 1.5s linear infinite
          `
        : "none"};
    transition: opacity 0.4s ease;
    pointer-events: none;
  }
`;

const GasOnReceiveWrapper = styled(Row)`
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-top: 20px;
  margin-top: 20px;
  border-top: 1px solid ${({ theme }) => theme.secondary.background.normal};
`;
