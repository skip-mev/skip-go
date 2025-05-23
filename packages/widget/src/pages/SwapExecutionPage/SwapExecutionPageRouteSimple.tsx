import { styled, useTheme } from "styled-components";
import { Column } from "@/components/Layout";
import { useAtomValue } from "jotai";
import { SwapExecutionPageRouteSimpleRow } from "./SwapExecutionPageRouteSimpleRow";
import { BridgeArrowIcon } from "@/icons/BridgeArrowIcon";
import { ICONS } from "@/icons";
import { ClientOperation, SimpleStatus } from "@/utils/clientType";
import { swapExecutionStateAtom } from "@/state/swapExecutionPage";
import { TxsStatus } from "./useBroadcastedTxs";
import { SwapExecutionState } from "@/utils/swapExecutionState";
import { useMemo } from "react";

export type SwapExecutionPageRouteProps = {
  operations: ClientOperation[];
  onClickEditDestinationWallet?: () => void;
  statusData?: TxsStatus;
  swapExecutionState?: SwapExecutionState;
  firstOperationStatus?: SimpleStatus | undefined;
  secondOperationStatus?: SimpleStatus | undefined;
};

export const SwapExecutionPageRouteSimple = ({
  operations,
  statusData,
  onClickEditDestinationWallet,
  swapExecutionState,
  firstOperationStatus,
}: SwapExecutionPageRouteProps) => {
  const theme = useTheme();
  const { route } = useAtomValue(swapExecutionStateAtom);

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
    denom: firstOperation.denomIn,
    tokenAmount: firstOperation.amountIn,
    chainId: firstOperation.fromChainId ?? firstOperation.chainId,
    usdValue: route?.usdAmountIn,
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
    <StyledSwapExecutionPageRoute justify="space-between">
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
    </StyledSwapExecutionPageRoute>
  );
};

const StyledBridgeArrowIcon = styled(BridgeArrowIcon)`
  height: 18px;
  width: 54px;
`;

const StyledSwapExecutionPageRoute = styled(Column)`
  padding: 30px;
  background: ${({ theme }) => theme.primary.background.normal};
  border-radius: 25px;
  min-height: 225px;
`;
