import styled, { useTheme } from 'styled-components';
import { Column } from '../../components/Layout';
import { Operation, txState } from './SwapExecutionFlowRouteDetailedRow';
import { useAtom } from 'jotai';
import { SwapExecutionFlowRouteSimpleRow } from './SwapExecutionFlowRouteSimpleRow';
import { BridgeArrowIcon } from '../../icons/BridgeArrowIcon';
import { ICONS } from '../../icons';
import { destinationWalletAtom } from '../../state/swap';
import { WALLET_LIST } from '../WalletSelectorFlow/WalletSelectorFlow';
import { useMemo } from 'react';

export type SwapExecutionFlowRouteSimpleProps = {
  operations: Operation[];
  txStateMap: { [index: number]: txState };
  onClickEditDestinationWallet?: () => void;
};

export const SwapExecutionFlowRouteSimple = ({
  operations,
  txStateMap,
  onClickEditDestinationWallet,
}: SwapExecutionFlowRouteSimpleProps) => {
  const theme = useTheme();

  const [destinationWallet] = useAtom(destinationWalletAtom);

  const firstOperation = operations[0];
  const overallSwapState = getOverallSwapState(txStateMap);
  const lastOperation = operations[operations.length - 1];
  const sourceDenom = firstOperation.denomIn;
  const destinationDenom = lastOperation.denomOut;

  const source = {
    denom: sourceDenom,
    amount: firstOperation.amountIn,
    chainID: firstOperation.fromChainID ?? firstOperation.chainID,
  };
  const destination = {
    denom: destinationDenom,
    amount: lastOperation.amountOut,
    chainID: lastOperation.toChainID ?? lastOperation.chainID,
  };

  return (
    <StyledSwapExecutionFlowRoute justify="space-between">
      <SwapExecutionFlowRouteSimpleRow
        {...source}
        wallet={WALLET_LIST[0]}
        txState={overallSwapState}
        explorerLink="https://www.google.com/"
      />
      <StyledBridgeArrowIcon color={theme.primary.text.normal} />
      <SwapExecutionFlowRouteSimpleRow
        {...destination}
        wallet={destinationWallet}
        destination
        icon={ICONS.pen}
        txState={overallSwapState}
        onClickEditDestinationWallet={onClickEditDestinationWallet}
        explorerLink="https://www.google.com/"
      />
    </StyledSwapExecutionFlowRoute>
  );
};

const getOverallSwapState = (txStateMap: { [index: number]: txState }) => {
  const txStateArray = Object.values(txStateMap);

  if (txStateArray.find((state) => state === 'failed')) {
    return 'failed';
  } else if (txStateArray.find((state) => state === 'broadcasted')) {
    return 'broadcasted';
  } else if (txStateArray.every((state) => state === 'pending')) {
    return 'pending';
  } else if (txStateArray.every((state) => state === 'confirmed')) {
    return 'confirmed';
  }
};

const StyledBridgeArrowIcon = styled(BridgeArrowIcon)`
  height: 18px;
  width: 54px;
`;

const StyledSwapExecutionFlowRoute = styled(Column)`
  padding: 35px;
  background-color: ${({ theme }) => theme.primary.background.normal};
  border-radius: 25px;
  min-height: 225px;
`;
