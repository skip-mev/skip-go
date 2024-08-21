import { Column, Row } from '@/components/Layout';
import { MainButton } from '@/components/MainButton';
import { SwapPageFooter } from '@/pages/SwapPage/SwapPageFooter';
import { SwapPageHeader } from '@/pages/SwapPage/SwapPageHeader';
import { useEffect, useMemo, useState } from 'react';
import { ICONS } from '@/icons';
import { ManualAddressModal } from '@/modals/ManualAddressModal/ManualAddressModal';
import styled, { useTheme } from 'styled-components';
import { useAtom } from 'jotai';
import { destinationWalletAtom } from '@/state/swapPage';
import { SwapExecutionPageRouteSimple } from './SwapExecutionPageRouteSimple';
import { SwapExecutionPageRouteDetailed } from './SwapExecutionPageRouteDetailed';

import { withBoundProps } from '@/utils/misc';
import { Operation, txState } from './SwapExecutionPageRouteDetailedRow';
import { SmallText } from '@/components/Typography';
import { SignatureIcon } from '@/icons/SignatureIcon';
import pluralize from 'pluralize';
import operations from './operations.json';
import { useThemedModal } from '@/components/Modal';

enum SwapExecutionState {
  destinationAddressUnset,
  unconfirmed,
  broadcasted,
  confirmed,
}

const SIGNATURES_REQUIRED = 2;
const TX_DELAY_MS = 5_000; // 5 seconds

export const SwapExecutionPage = () => {
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
  const modal = useThemedModal(ManualAddressModal);

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
            onClick={() => modal.show()}
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

  const SwapExecutionPageRoute = simpleRoute
    ? withBoundProps(SwapExecutionPageRouteSimple, {
        onClickEditDestinationWallet: () => {
          modal.show();
        },
      })
    : SwapExecutionPageRouteDetailed;

  return (
    <Column gap={5}>
      <SwapPageHeader
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
      <SwapExecutionPageRoute
        txStateMap={txStateMap}
        operations={operations as Operation[]}
      />
      {renderMainButton}
      <SwapPageFooter
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
