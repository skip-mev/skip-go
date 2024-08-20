import { Column, Row } from '../../components/Layout';
import { MainButton } from '../../components/MainButton';
import { SwapFlowFooter } from '../SwapFlow/SwapFlowFooter';
import { SwapFlowHeader } from '../SwapFlow/SwapFlowHeader';
import { useEffect, useMemo, useState } from 'react';
import { ICONS } from '../../icons';
import { useModal } from '@ebay/nice-modal-react';
import { ManualAddressFlow } from '../ManualAddressFlow/ManualAddressFlow';
import styled, { useTheme } from 'styled-components';
import { useAtom } from 'jotai';
import { destinationWalletAtom } from '../../state/swap';
import { SwapExecutionFlowRouteSimple } from './SwapExecutionFlowRouteSimple';
import { SwapExecutionFlowRouteDetailed } from './SwapExecutionFlowRouteDetailed';

import { withBoundProps } from '../../utils/misc';
import { Operation, txState } from './SwapExecutionFlowRouteDetailedRow';
import { SmallText } from '../../components/Typography';
import { SignatureIcon } from '../../icons/SignatureIcon';
import pluralize from 'pluralize';

enum SwapExecutionState {
  destinationAddressUnset,
  unconfirmed,
  broadcasted,
  confirmed,
}

export type SwapExecutionFlowProps = {
  operations: Operation[];
};

const SIGNATURES_REQUIRED = 2;
const TX_DELAY_MS = 5_000; // 5 seconds

export const SwapExecutionFlow = ({ operations }: SwapExecutionFlowProps) => {
  const theme = useTheme();

  const [destinationWallet] = useAtom(destinationWalletAtom);
  const [swapExecutionState, setSwapExecutionState] = useState(
    destinationWallet
      ? SwapExecutionState.unconfirmed
      : SwapExecutionState.destinationAddressUnset
  );

  useEffect(() => {
    if (destinationWallet) {
      setSwapExecutionState(SwapExecutionState.unconfirmed);
    }
  }, [destinationWallet]);
  const [simpleRoute, setSimpleRoute] = useState(true);
  const modal = useModal(ManualAddressFlow);

  const [txStateMap, setTxStateMap] = useState<{ [index: number]: txState }>({
    0: 'pending',
    1: 'pending',
    2: 'pending',
  });

  const tempBeginSwap = () => {
    // for testing/demo
    setSwapExecutionState(SwapExecutionState.broadcasted);
    setTxStateMap({
      0: 'broadcasted',
      1: 'pending',
      2: 'pending',
    });
    setTimeout(() => {
      setTxStateMap({
        0: 'confirmed',
        1: 'broadcasted',
        2: 'pending',
      });
      setTimeout(() => {
        setTxStateMap({
          0: 'confirmed',
          1: 'confirmed',
          2: 'broadcasted',
        });
        setTimeout(() => {
          setTxStateMap({
            0: 'confirmed',
            1: 'confirmed',
            2: 'confirmed',
          });
          setSwapExecutionState(SwapExecutionState.confirmed);
        }, TX_DELAY_MS);
      }, TX_DELAY_MS);
    }, TX_DELAY_MS);
  };

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
              tempBeginSwap();
            }}
          />
        );
      case SwapExecutionState.broadcasted:
        return (
          <MainButton
            label="Swap in progress"
            loading
            loadingTimeString={`${
              (operations.length * TX_DELAY_MS) / 1000
            } secs.`}
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
      <SwapExecutionFlowRoute txStateMap={txStateMap} operations={operations} />
      {renderMainButton}
      <SwapFlowFooter
        rightContent={
          SIGNATURES_REQUIRED && (
            <Row align="center">
              <SignatureIcon
                backgroundColor={theme.warning.text}
                width={20}
                height={20}
              />
              <StyledSignatureRequired>
                {SIGNATURES_REQUIRED}{' '}
                {pluralize('signature', SIGNATURES_REQUIRED)} still required
              </StyledSignatureRequired>
            </Row>
          )
        }
      />
    </Column>
  );
};

const StyledSignatureRequired = styled(SmallText)`
  color: ${({ theme }) => theme.warning.text};
`;
