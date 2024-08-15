import { styled, useTheme } from 'styled-components';
import { Column } from '../../components/Layout';
import { ICONS } from '../../icons';
import { SwapExecutionFlowSimpleRouteRow } from './SwapExecutionFlowSimpleRouteRow';
import { useAtom } from 'jotai';
import {
  sourceAssetAtom,
  destinationAssetAtom,
  AssetAtom,
  destinationWalletAtom,
} from '../../state/swap';
import { WALLET_LIST } from '../WalletSelectorFlow/WalletSelectorFlow';
import { useModal } from '@ebay/nice-modal-react';
import { ManualAddressFlow } from '../ManualAddressFlow/ManualAddressFlow';

export type SwapExecutionFlowRouteProps = {
  simple?: boolean;
};

export const SwapExecutionFlowRoute = ({
  simple,
}: SwapExecutionFlowRouteProps) => {
  const theme = useTheme();
  const [sourceAsset] = useAtom(sourceAssetAtom);
  const [destinationAsset] = useAtom(destinationAssetAtom);
  const [destinationWallet] = useAtom(destinationWalletAtom);
  const modal = useModal(ManualAddressFlow);

  if (simple) {
    return (
      <StyledSwapExecutionFlowRoute justify="space-between">
        <SwapExecutionFlowSimpleRouteRow
          asset={sourceAsset as AssetAtom}
          wallet={WALLET_LIST[0]}
        />
        <SwapExecutionFlowSimpleRouteRow
          asset={destinationAsset as AssetAtom}
          wallet={destinationWallet}
          destination
          icon={ICONS.pen}
          onClickEditDestinationWallet={() =>
            modal.show({
              theme,
            })
          }
        />
      </StyledSwapExecutionFlowRoute>
    );
  }
  return (
    <StyledSwapExecutionFlowRoute justify="space-between">
      <SwapExecutionFlowSimpleRouteRow
        asset={sourceAsset as AssetAtom}
        wallet={WALLET_LIST[0]}
      />
      <SwapExecutionFlowSimpleRouteRow
        asset={destinationAsset as AssetAtom}
        wallet={WALLET_LIST[1]}
        destination
        icon={ICONS.pen}
        onClickEditDestinationWallet={() => {}}
      />
    </StyledSwapExecutionFlowRoute>
  );
};

const StyledSwapExecutionFlowRoute = styled(Column)`
  padding: 35px;
  background-color: ${({ theme }) => theme.primary.background.normal};
  border-radius: 25px;
  min-height: 225px;
`;
