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

  const [{ data: assets }] = useAtom(skipAssets);

  const [destinationWallet] = useAtom(destinationWalletAtom);

  const firstOperation = operations[0];
  const lastOperation = operations[operations.length - 1];
  const sourceDenom = firstOperation.denomIn;
  const destinationDenom = lastOperation.denomOut;

  const source = {
    asset: assets?.find((asset) => asset.denom === sourceDenom),
    chain: firstOperation.fromChainID,
    chainImage: getChain(firstOperation.fromChainID ?? '').images?.find(
      (image) => image.svg ?? image.png
    ),
  };
  const destination = {
    asset: assets?.find((asset) => asset.denom === destinationDenom),
    chain: lastOperation.fromChainID,
    chainImage: getChain(lastOperation.fromChainID ?? '').images?.find(
      (image) => image.svg ?? image.png
    ),
  };

  if (!source.asset) {
    throw new Error(`Asset not found for sourceAsset denom: ${sourceDenom}`);
  }
  if (!destination.asset) {
    throw new Error(
      `Asset not found for destinationAsset denom: ${destinationDenom}`
    );
  }

  return (
    <StyledSwapExecutionFlowRoute justify="space-between">
      <SwapExecutionFlowRouteSimpleRow
        operation={firstOperation}
        wallet={WALLET_LIST[0]}
      />
      <StyledBridgeArrowIcon color={theme.primary.text.normal} />
      <SwapExecutionFlowRouteSimpleRow
        operation={lastOperation}
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
