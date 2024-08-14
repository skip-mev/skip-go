import { styled } from 'styled-components';
import { Column } from '../../components/Layout';
import { MainButton } from '../../components/MainButton';
import { SwapFlowFlooterItems } from '../SwapFlow/SwapFlowFooterItems';
import { SmallText } from '../../components/Typography';
import { SwapFlowHeaderItems } from '../SwapFlow/SwapFlowHeaderItems';
import { useMemo, useState } from 'react';
import { ICONS } from '../../icons';

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
          content: 'Back',
          onClick: () => {},
        }}
        rightButton={{
          content: 'Details',
          onClick: () => {},
        }}
      />
      <StyledSwapExecutionFlowRoute></StyledSwapExecutionFlowRoute>
      {renderMainButton}
      <SmallText>
        <SwapFlowFlooterItems />
      </SmallText>
    </StyledSwapExecutionFlowContainer>
  );
};

const StyledSwapExecutionFlowContainer = styled(Column)``;

const StyledSwapExecutionFlowRoute = styled(Column)`
  background-color: ${({ theme }) => theme.primary.background.normal};
  border-radius: 25px;
  min-height: 225px;
`;
