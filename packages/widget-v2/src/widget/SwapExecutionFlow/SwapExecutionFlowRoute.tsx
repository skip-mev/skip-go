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
import { SwapExecutionFlowDetailedRouteRow } from './SwapExecutionFlowDetailedRouteRow';
import operations from './operations.json';
import { BridgeArrowIcon } from '../../icons/BridgeArrowIcon';
import { SwapExecutionSendIcon } from '../../icons/SwapExecutionSendIcon';
import { SwapExecutionSwapIcon } from '../../icons/SwapExecutionSwapIcon';
import { SwapExecutionBridgeIcon } from '../../icons/SwapExecutionBridgeIcon';

export type SwapExecutionFlowRouteProps = {
  simple?: boolean;
};

type operationTypeToIcon = {
  [index: string]: JSX.Element;
};

const operationTypeToIcon: operationTypeToIcon = {
  axelarTransfer: <SwapExecutionBridgeIcon />,
  swap: <SwapExecutionSwapIcon />,
  transfer: <SwapExecutionSendIcon />,
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
        <StyledBridgeArrowIcon color={theme.primary.text.normal} />
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
    <StyledSwapExecutionFlowRoute justify="space-between" gap={8}>
      {operations.map((operation) => (
        <>
          <SwapExecutionFlowDetailedRouteRow operation={operation} />
          {operation !== operations[operations.length - 1] && (
            <OperationTypeIconContainer justify="center">
              {operationTypeToIcon[operation.type]}
            </OperationTypeIconContainer>
          )}
        </>
      ))}
    </StyledSwapExecutionFlowRoute>
  );
};

const OperationTypeIconContainer = styled(Column)`
  color: ${({ theme }) => theme.primary.text.lowContrast};
  &:hover {
    color: ${({ theme }) => theme.primary.text.normal};
  }
`;

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
