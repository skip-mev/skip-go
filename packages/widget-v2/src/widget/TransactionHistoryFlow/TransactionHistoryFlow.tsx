import NiceModal from '@ebay/nice-modal-react';
import { Modal, ModalProps } from '../../components/Modal';
import { Column } from '../../components/Layout';
import { styled } from 'styled-components';
import { SwapFlowHeader } from '../SwapFlow/SwapFlowHeader';
import { SwapFlowFooter } from '../SwapFlow/SwapFlowFooter';
import { ICONS } from '../../icons';
import { VirtualList } from '../../components/VirtualList';
import {
  TransactionHistoryFlowRow,
  TxHistoryItem,
} from './TransactionHistoryFlowRow';
import { RouteResponse } from '@skip-go/client';
import { useMemo } from 'react';

const TX_HISTORY: TxHistoryItem[] = [
  {
    route: {
      sourceAssetDenom: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      sourceAssetChainID: '1',
      destAssetDenom: 'uatom',
      destAssetChainID: 'cosmoshub-4',
      amountIn: '4775458',
      amountOut: '1000000',
    } as RouteResponse,
    status: 'success',
    timestamp: '00000',
    txStatus: [
      {
        chainId: '',
        txHash: '',
        explorerLink: '',
        axelarscanLink: '',
      },
    ],
  },
  {
    route: {
      sourceAssetDenom: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      sourceAssetChainID: '1',
      destAssetDenom: 'uatom',
      destAssetChainID: 'cosmoshub-4',
      amountIn: '4775458',
      amountOut: '1000000',
    } as RouteResponse,
    status: 'failed',
    timestamp: '00000',
    txStatus: [
      {
        chainId: '',
        txHash: '',
        explorerLink: '',
        axelarscanLink: '',
      },
    ],
  },
  {
    route: {
      sourceAssetDenom: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      sourceAssetChainID: '1',
      destAssetDenom: 'uatom',
      destAssetChainID: 'cosmoshub-4',
      amountIn: '4775458',
      amountOut: '1000000',
    } as RouteResponse,
    status: 'pending',
    timestamp: '00000',
    txStatus: [
      {
        chainId: '',
        txHash: '',
        explorerLink: '',
        axelarscanLink: '',
      },
    ],
  },
];

const ITEM_HEIGHT = 40;
const ITEM_GAP = 5;

export const TransactionHistoryFlow = NiceModal.create(
  (modalProps: ModalProps) => {
    const height = useMemo(() => {
      return Math.min(530, TX_HISTORY.length * (ITEM_HEIGHT + ITEM_GAP));
    }, [TX_HISTORY]);

    return (
      <Modal {...modalProps}>
        <SwapFlowHeader
          leftButton={{
            label: 'Back',
            icon: ICONS.thinArrow,
            onClick: () => {},
          }}
        />
        <StyledContainer>
          <VirtualList
            listItems={TX_HISTORY}
            height={height}
            itemHeight={ITEM_HEIGHT + ITEM_GAP}
            renderItem={(item) => (
              <TransactionHistoryFlowRow txHistoryItem={item} />
            )}
            itemKey={(item) => item.timestamp}
          />
        </StyledContainer>
        <SwapFlowFooter />
      </Modal>
    );
  }
);

const StyledContainer = styled(Column)`
  position: relative;
  padding: 20px;
  min-height: 300px;
  width: 480px;
  border-radius: 25px;
  background-color: ${({ theme }) => theme.primary.background.normal};
`;
