import NiceModal from '@ebay/nice-modal-react';
import { Modal, ModalProps } from '../../components/Modal';
import { Column } from '../../components/Layout';
import { styled } from 'styled-components';
import { SwapFlowHeader } from '../SwapFlow/SwapFlowHeader';
import { SwapFlowFooter } from '../SwapFlow/SwapFlowFooter';
import { ICONS } from '../../icons';
import { VirtualList } from '../../components/VirtualList';
import {
  TransactionHistoryFlowItem,
  TxHistoryItem,
} from './TransactionHistoryFlowItem';
import { useState } from 'react';
import { HistoryIcon } from '../../icons/HistoryIcon';
import { SmallText } from '../../components/Typography';

const ITEM_HEIGHT = 40;
const ITEM_GAP = 5;

export type TransactionHistoryFlowProps = ModalProps & {
  txHistory: TxHistoryItem[];
};

export const TransactionHistoryFlow = NiceModal.create(
  ({ txHistory, ...modalProps }: TransactionHistoryFlowProps) => {
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
          {txHistory.length === 0 ? (
            <StyledNoTransactionHistoryContainer
              align="center"
              justify="center"
              gap={15}
            >
              <HistoryIcon
                width={30}
                height={30}
                color={modalProps.theme?.primary?.text.lowContrast}
              />
              <SmallText>No transactions yet</SmallText>
            </StyledNoTransactionHistoryContainer>
          ) : (
            <VirtualList
              listItems={txHistory}
              height={300}
              itemHeight={ITEM_HEIGHT + ITEM_GAP}
              renderItem={(item, index) => (
                <TransactionHistoryFlowItem
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
          )}
        </StyledContainer>
        <SwapFlowFooter />
      </Modal>
    );
  }
);

const StyledNoTransactionHistoryContainer = styled(Column)`
  height: 100%;
  width: 100%;
`;

const StyledContainer = styled(Column)`
  position: relative;
  padding: 20px;
  height: 300px;
  width: 480px;
  border-radius: 25px;
  background-color: ${({ theme }) => theme.primary.background.normal};
`;
