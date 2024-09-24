import styled, { useTheme } from "styled-components";
import { Column } from "@/components/Layout";
import { useAtomValue } from "jotai";
import { SwapExecutionPageRouteSimpleRow } from "./SwapExecutionPageRouteSimpleRow";
import { BridgeArrowIcon } from "@/icons/BridgeArrowIcon";
import { ICONS } from "@/icons";
import { ClientOperation, ClientTransferEvent, SimpleStatus } from "@/utils/clientType";
import { swapExecutionStateAtom } from "@/state/swapExecutionPage";
import { useCallback, useMemo } from "react";
import { getIsOperationSignRequired } from "@/utils/operations";

export type SwapExecutionPageRouteSimpleProps = {
  operations: ClientOperation[];
  operationToTransferEventsMap: Record<number, ClientTransferEvent>;
  onClickEditDestinationWallet?: () => void;
};

export const SwapExecutionPageRouteSimple = ({
  operations,
  operationToTransferEventsMap,
  onClickEditDestinationWallet: _onClickEditDestinationWallet,
}: SwapExecutionPageRouteSimpleProps) => {
  const theme = useTheme();
  const { transactionDetailsArray, overallStatus } = useAtomValue(swapExecutionStateAtom);

  const getExplorerLink = useCallback((index: number) => {
    return transactionDetailsArray[index]?.explorerLink;
  }, [transactionDetailsArray]);

  const firstOperation = operations[0];
  const lastOperation = operations[operations.length - 1];
  const sourceStatus = operationToTransferEventsMap?.[0]?.status;
  const destinationStatus = operationToTransferEventsMap?.[operations.length - 1]?.status;

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

  const isSignRequired = getIsOperationSignRequired(0, operations, firstOperation, lastOperation);

  const onClickEditDestinationWallet = useMemo(() => {
    if (isSignRequired) return;
    if (overallStatus) return;
    return _onClickEditDestinationWallet;
  }, [isSignRequired, overallStatus, _onClickEditDestinationWallet]);

  return (
    <StyledSwapExecutionPageRoute justify="space-between">
      <SwapExecutionPageRouteSimpleRow
        {...source}
        status={sourceStatus}
        context="source"
      />
      <StyledBridgeArrowIcon color={theme.primary.text.normal} />
      <SwapExecutionPageRouteSimpleRow
        {...destination}
        destination
        icon={ICONS.pen}
        status={destinationStatus}
        onClickEditDestinationWallet={onClickEditDestinationWallet}
        explorerLink={getExplorerLink(lastOperation.txIndex)}
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
  padding: 35px;
  background-color: ${({ theme }) => theme.primary.background.normal};
  border-radius: 25px;
  min-height: 225px;
`;
