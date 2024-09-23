import styled, { useTheme } from "styled-components";
import { Column } from "@/components/Layout";
import { useAtom } from "jotai";
import { SwapExecutionPageRouteSimpleRow } from "./SwapExecutionPageRouteSimpleRow";
import { BridgeArrowIcon } from "@/icons/BridgeArrowIcon";
import { ICONS } from "@/icons";
import { destinationWalletAtom } from "@/state/swapPage";
import { ClientOperation } from "@/utils/clientType";
import { OperationExecutionDetails } from "@/state/swapExecutionPage";

export type SwapExecutionPageRouteSimpleProps = {
  operations: ClientOperation[];
  operationExecutionDetails: OperationExecutionDetails[];
  onClickEditDestinationWallet?: () => void;
};

export const SwapExecutionPageRouteSimple = ({
  operations,
  operationExecutionDetails,
  onClickEditDestinationWallet,
}: SwapExecutionPageRouteSimpleProps) => {
  const theme = useTheme();

  const [destinationWallet] = useAtom(destinationWalletAtom);

  const firstOperation = operations[0];
  const overallSwapState = getOverallSwapState(operationExecutionDetails);
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
        wallet={destinationWallet}
        txState={overallSwapState}
      />
      <StyledBridgeArrowIcon color={theme.primary.text.normal} />
      <SwapExecutionPageRouteSimpleRow
        {...destination}
        wallet={destinationWallet}
        destination
        icon={ICONS.pen}
        txState={overallSwapState}
        onClickEditDestinationWallet={onClickEditDestinationWallet}
        explorerLink={operationExecutionDetails[operationExecutionDetails.length - 1]?.explorerLink}
      />
    </StyledSwapExecutionPageRoute>
  );
};

const getOverallSwapState = (operationExecutionDetails: OperationExecutionDetails[]) => {
  if (operationExecutionDetails.find((state) => state.status === "failed")) {
    return "failed";
  } else if (operationExecutionDetails.find((state) => state.status === "broadcasted")) {
    return "broadcasted";
  } else if (operationExecutionDetails.every((state) => state.status === "pending")) {
    return "pending";
  } else if (operationExecutionDetails.every((state) => state.status === "confirmed")) {
    return "confirmed";
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
