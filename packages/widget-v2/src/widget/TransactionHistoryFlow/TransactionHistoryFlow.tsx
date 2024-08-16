import NiceModal from '@ebay/nice-modal-react';
import { Modal, ModalProps } from '../../components/Modal';
import { Column } from '../../components/Layout';
import { styled } from 'styled-components';
import { SwapFlowHeader } from '../SwapFlow/SwapFlowHeader';
import { SwapFlowFooter } from '../SwapFlow/SwapFlowFooter';
import { ICONS } from '../../icons';
import { VirtualList } from '../../components/VirtualList';
import {
  TransactionHistoryFlowHistoryItem,
  TxHistoryItem,
} from './TransactionHistoryFlowHistoryItem';
import { RouteResponse } from '@skip-go/client';
import { useState } from 'react';

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
        txHash: '19D4a2e9Eb0',
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
        txHash: 'e9Eb0cE3606',
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
        txHash: '8b36c1d',
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
    const [itemIndexToShowDetail, setItemIndexToShowDetail] = useState<
      number | undefined
    >();
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
            height={300}
            itemHeight={ITEM_HEIGHT + ITEM_GAP}
            renderItem={(item, index) => (
              <TransactionHistoryFlowHistoryItem
                txHistoryItem={item}
                showDetails={index === itemIndexToShowDetail}
                onClickRow={() => {
                  if (index !== itemIndexToShowDetail) {
                    setItemIndexToShowDetail(index);
                  } else {
                    setItemIndexToShowDetail(undefined);
                  }
                }}
                onClickTransactionID={() => {
                  window.open(item.txStatus[0].explorerLink, '_blank');
                }}
              />
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
  height: 300px;
  width: 480px;
  border-radius: 25px;
  background-color: ${({ theme }) => theme.primary.background.normal};
`;
