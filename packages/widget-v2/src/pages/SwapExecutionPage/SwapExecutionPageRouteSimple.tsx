import { styled, useTheme } from "styled-components";
import { Column } from "@/components/Layout";
import { useAtomValue } from "jotai";
import { SwapExecutionPageRouteSimpleRow } from "./SwapExecutionPageRouteSimpleRow";
import { BridgeArrowIcon } from "@/icons/BridgeArrowIcon";
import { ICONS } from "@/icons";
import { ClientOperation, ClientTransferEvent } from "@/utils/clientType";
import { swapExecutionStateAtom } from "@/state/swapExecutionPage";
import { useMemo } from "react";
import { TxsStatus } from "./useBroadcastedTxs";

export type SwapExecutionPageRouteSimpleProps = {
  operations: ClientOperation[];
  onClickEditDestinationWallet?: () => void;
  statusData?: TxsStatus
};

export const SwapExecutionPageRouteSimple = ({
  operations,
  statusData,
  onClickEditDestinationWallet: _onClickEditDestinationWallet,
}: SwapExecutionPageRouteSimpleProps) => {
  const theme = useTheme();
  const { route, overallStatus } = useAtomValue(swapExecutionStateAtom);

  const firstOperation = operations[0];
  const lastOperation = operations[operations.length - 1];
  const status = statusData?.transferEvents;
  const sourceStatus = status?.[firstOperation.transferIndex]?.status;
  const destinationStatus = status?.[lastOperation.transferIndex]?.status;

  const sourceDenom = firstOperation.denomIn;
  const destinationDenom = lastOperation.denomOut;

  const source = {
    denom: sourceDenom,
    tokenAmount: firstOperation.amountIn,
    chainId: firstOperation.fromChainID ?? firstOperation.chainID,
    usdValue: route?.usdAmountIn,
  };
  const destination = {
    denom: destinationDenom,
    tokenAmount: lastOperation.amountOut,
    chainId: lastOperation.toChainID ?? lastOperation.chainID,
    usdValue: route?.usdAmountOut,
  };

  const isSignRequired = lastOperation.signRequired;

  const sourceExplorerLink = status?.[firstOperation.transferIndex]?.fromExplorerLink;
  const destinationExplorerLink = status?.[lastOperation.transferIndex]?.toExplorerLink;

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
  padding: 35px;
  background-color: ${({ theme }) => theme.primary.background.normal};
  border-radius: 25px;
  min-height: 225px;
`;
