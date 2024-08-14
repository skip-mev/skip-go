import { styled } from 'styled-components';
import { Column } from '../../components/Layout';
import { MainButton } from '../../components/MainButton';
import { SwapFlowFlooterItems } from '../SwapFlow/SwapFlowFooterItems';
import { SmallText } from '../../components/Typography';
import { SwapFlowHeaderItems } from '../SwapFlow/SwapFlowHeaderItems';
import { useMemo, useState } from 'react';
import { ICONS } from '../../icons';
import { SwapExecutionFlowRow } from './SwapExecutionFlowRow';
import { useAtom } from 'jotai';
import { sourceAtom, destinationAtom, AssetAtom } from '../../state/swap';
import { WALLET_LIST } from '../WalletSelectorFlow/WalletSelectorFlow';

enum SwapExecutionState {
  destinationAddressUnset,
  unconfirmed,
  broadcasted,
  confirmed,
}

export const SwapExecutionFlow = () => {
  const [swapExecutionState, setSwapExecutionState] = useState(
    SwapExecutionState.destinationAddressUnset
  );

  const [sourceAsset] = useAtom(sourceAtom);
  const [destinationAsset] = useAtom(destinationAtom);

  const renderMainButton = useMemo(() => {
    switch (swapExecutionState) {
      case SwapExecutionState.destinationAddressUnset:
        return (
          <MainButton label="Set destination address" icon={ICONS.rightArrow} />
        );
      case SwapExecutionState.unconfirmed:
        return <MainButton label="Confirm swap" icon={ICONS.rightArrow} />;
      case SwapExecutionState.broadcasted:
        return (
          <MainButton
            label="Swap in progress"
            loading
            loadingTimeString="2 mins."
          />
        );
      case SwapExecutionState.confirmed:
        return <MainButton label="Swap complete" icon={ICONS.checkmark} />;
    }
  }, [swapExecutionState]);

  return (
    <StyledSwapExecutionFlowContainer gap={5}>
      <SwapFlowHeaderItems
        leftButton={{
          label: 'Back',
          icon: ICONS.thinArrow,
          onClick: () => {},
        }}
        rightButton={{
          label: 'Details',
          icon: ICONS.hamburger,
          onClick: () => {},
        }}
      />
      <StyledSwapExecutionFlowRoute justify="space-between">
        <SwapExecutionFlowRow
          asset={sourceAsset as AssetAtom}
          wallet={WALLET_LIST[0]}
        />
        <SwapExecutionFlowRow
          asset={destinationAsset as AssetAtom}
          wallet={WALLET_LIST[1]}
          destination
          icon={ICONS.pen}
          onClickEditDestinationWallet={() => {}}
        />
      </StyledSwapExecutionFlowRoute>
      {renderMainButton}
      <SmallText>
        <SwapFlowFlooterItems />
      </SmallText>
    </StyledSwapExecutionFlowContainer>
  );
};

const StyledSwapExecutionFlowContainer = styled(Column)``;

const StyledSwapExecutionFlowRoute = styled(Column)`
  padding: 35px;
  background-color: ${({ theme }) => theme.primary.background.normal};
  border-radius: 25px;
  min-height: 225px;
`;
