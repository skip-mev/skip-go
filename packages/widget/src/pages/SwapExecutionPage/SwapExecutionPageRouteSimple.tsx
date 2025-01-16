import { styled, useTheme } from "styled-components";
import { Column } from "@/components/Layout";
import { useAtomValue } from "jotai";
import { SwapExecutionPageRouteSimpleRow } from "./SwapExecutionPageRouteSimpleRow";
import { BridgeArrowIcon } from "@/icons/BridgeArrowIcon";
import { ICONS } from "@/icons";
import { ClientOperation } from "@/utils/clientType";
import { swapExecutionStateAtom } from "@/state/swapExecutionPage";
import { TxsStatus } from "./useBroadcastedTxs";
import { SwapExecutionState } from "./SwapExecutionPage";

export type SwapExecutionPageRouteProps = {
  operations: ClientOperation[];
  onClickEditDestinationWallet?: () => void;
  statusData?: TxsStatus;
  swapExecutionState?: SwapExecutionState;
};

export const SwapExecutionPageRouteSimple = ({
  operations,
  statusData,
  onClickEditDestinationWallet,
  swapExecutionState,
}: SwapExecutionPageRouteProps) => {
  const theme = useTheme();
  const { route } = useAtomValue(swapExecutionStateAtom);

  const firstOperation = operations[0];
  const lastOperation = operations[operations.length - 1];
  const status = statusData?.transferEvents;

  const getSourceStatus = () => {
    if (swapExecutionState === SwapExecutionState.confirmed) {
      return "completed";
    }

    if (status?.[firstOperation.transferIndex]?.status) {
      return status[firstOperation.transferIndex].status;
    }

    if (
      swapExecutionState === SwapExecutionState.pending ||
      swapExecutionState === SwapExecutionState.signaturesRemaining
    ) {
      return "pending";
    }
  };

  const sourceStatus = getSourceStatus();

  const destinationStatus =
    swapExecutionState === SwapExecutionState.confirmed
      ? "completed"
      : status?.[lastOperation.transferIndex]?.status;

  const source = {
    denom: firstOperation.denomIn,
    tokenAmount: firstOperation.amountIn,
    chainId: firstOperation.fromChainID ?? firstOperation.chainID,
    usdValue: route?.usdAmountIn,
  };
  const destination = {
    denom: lastOperation.denomOut,
    tokenAmount: lastOperation.amountOut,
    chainId: lastOperation.toChainID ?? lastOperation.chainID,
    usdValue: route?.usdAmountOut,
  };

  const sourceExplorerLink = status?.[firstOperation.transferIndex]?.fromExplorerLink;
  const destinationExplorerLink = status?.[lastOperation.transferIndex]?.toExplorerLink;

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
  padding: 30px;
  background-color: ${({ theme }) => theme.primary.background.normal};
  border-radius: 25px;
  min-height: 225px;
`;
