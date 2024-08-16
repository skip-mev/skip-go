import { Column } from '../../components/Layout';
import { MainButton } from '../../components/MainButton';
import { SwapFlowFooter } from '../SwapFlow/SwapFlowFooter';
import { SwapFlowHeader } from '../SwapFlow/SwapFlowHeader';
import { useEffect, useMemo, useState } from 'react';
import { ICONS } from '../../icons';
import { useModal } from '@ebay/nice-modal-react';
import { ManualAddressFlow } from '../ManualAddressFlow/ManualAddressFlow';
import { useTheme } from 'styled-components';
import { useAtom } from 'jotai';
import { destinationWalletAtom } from '../../state/swap';
import { SwapExecutionFlowRouteSimple } from './SwapExecutionFlowRouteSimple';
import { SwapExecutionFlowRouteDetailed } from './SwapExecutionFlowRouteDetailed';

import { withBoundProps } from '../../utils/misc';
import { Operation } from './SwapExecutionFlowRouteDetailedRow';

enum SwapExecutionState {
  destinationAddressUnset,
  unconfirmed,
  broadcasted,
  confirmed,
}

export type SwapExecutionFlowProps = {
  operations: Operation[];
};

export const SwapExecutionFlow = ({ operations }: SwapExecutionFlowProps) => {
  const theme = useTheme();

  const [destinationWallet] = useAtom(destinationWalletAtom);
  const [swapExecutionState, setSwapExecutionState] = useState(
    destinationWallet
      ? SwapExecutionState.unconfirmed
      : SwapExecutionState.destinationAddressUnset
  );
  const [simpleRoute, setSimpleRoute] = useState(true);
  const modal = useModal(ManualAddressFlow);

  useEffect(() => {
    if (destinationWallet) {
      setSwapExecutionState(SwapExecutionState.unconfirmed);
    }
  }, [destinationWallet]);

  const renderMainButton = useMemo(() => {
    switch (swapExecutionState) {
      case SwapExecutionState.destinationAddressUnset:
        return (
          <MainButton
            label="Set destination address"
            icon={ICONS.rightArrow}
            onClick={() =>
              modal.show({
                theme,
              })
            }
          />
        );
      case SwapExecutionState.unconfirmed:
        return (
          <MainButton
            label="Confirm swap"
            icon={ICONS.rightArrow}
            onClick={() => {
              setSwapExecutionState(SwapExecutionState.broadcasted);
              setTimeout(() => {
                setSwapExecutionState(SwapExecutionState.confirmed);
              }, 5_000);
            }}
          />
        );
      case SwapExecutionState.broadcasted:
        return (
          <MainButton
            label="Swap in progress"
            loading
            loadingTimeString="5 seconds"
          />
        );
      case SwapExecutionState.confirmed:
        return (
          <MainButton
            label="Swap complete"
            icon={ICONS.checkmark}
            backgroundColor={theme.success.text}
          />
        );
    }
  }, [swapExecutionState]);

  const SwapExecutionFlowRoute = simpleRoute
    ? withBoundProps(SwapExecutionFlowRouteSimple, {
        onClickEditDestinationWallet: () => {
          modal.show({
            theme,
          });
        },
      })
    : SwapExecutionFlowRouteDetailed;

  return (
    <Column gap={5}>
      <SwapFlowHeader
        leftButton={{
          label: 'Back',
          icon: ICONS.thinArrow,
          onClick: () => {},
        }}
        rightButton={{
          label: simpleRoute ? 'Details' : 'Hide details',
          icon: simpleRoute ? ICONS.hamburger : ICONS.horizontalLine,
          onClick: () => setSimpleRoute(!simpleRoute),
        }}
      />
      <SwapExecutionFlowRoute operations={operations} />
      {renderMainButton}
      <SwapFlowFooter />
    </Column>
  );
};
