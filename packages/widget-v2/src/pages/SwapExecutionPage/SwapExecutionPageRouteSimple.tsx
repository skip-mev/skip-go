import styled, { useTheme } from "styled-components";
import { Column } from "@/components/Layout";
import { txState } from "./SwapExecutionPageRouteDetailedRow";
import { useAtom } from "jotai";
import { SwapExecutionPageRouteSimpleRow } from "./SwapExecutionPageRouteSimpleRow";
import { BridgeArrowIcon } from "@/icons/BridgeArrowIcon";
import { ICONS } from "@/icons";
import { destinationWalletAtom } from "@/state/swapPage";
import { ClientOperation } from "@/utils/clientType";

export type SwapExecutionPageRouteSimpleProps = {
  operations: ClientOperation[];
  txStateMap: Record<number, txState>;
  onClickEditDestinationWallet?: () => void;
};

export const SwapExecutionPageRouteSimple = ({
  operations,
  txStateMap,
  onClickEditDestinationWallet,
}: SwapExecutionPageRouteSimpleProps) => {
  const theme = useTheme();

  const [destinationWallet] = useAtom(destinationWalletAtom);

  const firstOperation = operations[0];
  const overallSwapState = getOverallSwapState(txStateMap);
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
        explorerLink={
          overallSwapState !== "pending" ? "https://www.google.com/" : undefined
        }
      />
    </StyledSwapExecutionPageRoute>
  );
};

const getOverallSwapState = (txStateMap: Record<number, txState>) => {
  const txStateArray = Object.values(txStateMap);

  if (txStateArray.find((state) => state === "failed")) {
    return "failed";
  } else if (txStateArray.find((state) => state === "broadcasted")) {
    return "broadcasted";
  } else if (txStateArray.every((state) => state === "pending")) {
    return "pending";
  } else if (txStateArray.every((state) => state === "confirmed")) {
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
