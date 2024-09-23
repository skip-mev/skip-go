import styled, { useTheme } from "styled-components";
import { Column } from "@/components/Layout";
import { useAtomValue } from "jotai";
import { SwapExecutionPageRouteSimpleRow } from "./SwapExecutionPageRouteSimpleRow";
import { BridgeArrowIcon } from "@/icons/BridgeArrowIcon";
import { ICONS } from "@/icons";
import { ClientOperation, ClientTransferEvent } from "@/utils/clientType";
import { swapExecutionStateAtom } from "@/state/swapExecutionPage";
import { useCallback } from "react";

export type SwapExecutionPageRouteSimpleProps = {
  operations: ClientOperation[];
  operationTransferEvents: ClientTransferEvent[];
  onClickEditDestinationWallet?: () => void;
};

export const SwapExecutionPageRouteSimple = ({
  operations,
  operationTransferEvents,
  onClickEditDestinationWallet,
}: SwapExecutionPageRouteSimpleProps) => {
  const theme = useTheme();
  const { transactionDetailsArray } = useAtomValue(swapExecutionStateAtom);

  const getExplorerLink = useCallback((index: number) => {
    return transactionDetailsArray[index]?.explorerLink;
  }, [transactionDetailsArray]);

  const firstOperation = operations[0];
  const overallSwapState = getOverallSwapState(operationTransferEvents);
  const lastOperation = operations[operations.length - 1];

  const sourceDenom = firstOperation.denomIn;
  const destinationDenom = lastOperation.denomOut;

  const source = {
    denom: sourceDenom,
    tokenAmount: firstOperation.amountIn,
    chainID: firstOperation.fromChainID ?? firstOperation.chainID,
  };
  const destination = {
    denom: destinationDenom,
    tokenAmount: lastOperation.amountOut,
    chainID: lastOperation.toChainID ?? lastOperation.chainID,
  };

  return (
    <StyledSwapExecutionPageRoute justify="space-between">
      <SwapExecutionPageRouteSimpleRow
        {...source}
        status={overallSwapState}
        context="source"
      />
      <StyledBridgeArrowIcon color={theme.primary.text.normal} />
      <SwapExecutionPageRouteSimpleRow
        {...destination}
        destination
        icon={ICONS.pen}
        status={overallSwapState}
        onClickEditDestinationWallet={onClickEditDestinationWallet}
        explorerLink={getExplorerLink(lastOperation.txIndex)}
        context="destination"
      />
    </StyledSwapExecutionPageRoute>
  );
};

export const getOverallSwapState = (operationTransferEvents: ClientTransferEvent[]) => {
  if (operationTransferEvents.find((state) => state.status === "failed")) {
    return "failed";
  } else if (operationTransferEvents.find((state) => state.status === "pending")) {
    return "pending";
  } else if (operationTransferEvents.every((state) => state.status === "broadcasted")) {
    return "broadcasted";
  } else if (operationTransferEvents.every((state) => state.status === "completed")) {
    return "completed";
  }
};

const StyledBridgeArrowIcon = styled(BridgeArrowIcon)`
  height: 18px;
  width: 54px;
`;

const StyledSwapExecutionPageRoute = styled(Column)`
  padding: 35px;
  background-color: ${({ theme }) => theme.primary.background.normal};
  border-radius: 25px;
  min-height: 225px;
`;
