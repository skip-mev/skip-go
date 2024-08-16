import styled, { useTheme } from 'styled-components';
import { Column, Row } from '../../components/Layout';
import { getChain, skipAssets } from '../../state/skip';
import { Operation } from './SwapExecutionFlowRouteDetailedRow';
import { useAtom } from 'jotai';
import { SwapExecutionFlowRouteSimpleRow } from './SwapExecutionFlowRouteSimpleRow';
import { BridgeArrowIcon } from '../../icons/BridgeArrowIcon';
import { ICONS } from '../../icons';
import { destinationWalletAtom } from '../../state/swap';
import { WALLET_LIST } from '../WalletSelectorFlow/WalletSelectorFlow';

export type SwapExecutionFlowRouteSimpleProps = {
  operations: Operation[];
  onClickEditDestinationWallet?: () => void;
};

export const SwapExecutionFlowRouteSimple = ({
  operations,
  onClickEditDestinationWallet,
}: SwapExecutionFlowRouteSimpleProps) => {
  const theme = useTheme();

  const [destinationWallet] = useAtom(destinationWalletAtom);

  const firstOperation = operations[0];
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
      <SwapExecutionFlowRouteSimpleRow {...source} wallet={WALLET_LIST[0]} />
      <StyledBridgeArrowIcon color={theme.primary.text.normal} />
      <SwapExecutionFlowRouteSimpleRow
        {...destination}
        wallet={destinationWallet}
        destination
        icon={ICONS.pen}
        onClickEditDestinationWallet={onClickEditDestinationWallet}
      />
    </StyledSwapExecutionFlowRoute>
  );
};

const StyledBridgeArrowIcon = styled(BridgeArrowIcon)`
  height: 18px;
  width: 50px;
`;

const StyledSwapExecutionFlowRoute = styled(Column)`
  padding: 35px;
  background-color: ${({ theme }) => theme.primary.background.normal};
  border-radius: 25px;
  min-height: 225px;
`;
