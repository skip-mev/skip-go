import NiceModal from '@ebay/nice-modal-react';
import { Modal, ModalProps } from '@/components/Modal';
import { Column } from '@/components/Layout';
import { styled } from 'styled-components';
import { SwapPageHeader } from '@/pages/SwapPage/SwapPageHeader';
import { SwapPageFooter } from '@/pages/SwapPage/SwapPageFooter';
import { ICONS } from '@/icons';
import { VirtualList } from '@/components/VirtualList';
import {
  TransactionHistoryModalItem,
  TxHistoryItem,
} from './TransactionHistoryModalItem';
import { useState } from 'react';
import { HistoryIcon } from '@/icons/HistoryIcon';
import { SmallText } from '@/components/Typography';

const ITEM_HEIGHT = 40;
const ITEM_GAP = 5;

export type TransactionHistoryModalProps = ModalProps & {
  txHistory: TxHistoryItem[];
};

export const TransactionHistoryModal = NiceModal.create(
  ({ txHistory, ...modalProps }: TransactionHistoryModalProps) => {
    const [itemIndexToShowDetail, setItemIndexToShowDetail] = useState<
      number | undefined
    >();
    return (
      <Modal {...modalProps}>
        <SwapPageHeader
          leftButton={{
            label: 'Back',
            icon: ICONS.thinArrow,
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
                <TransactionHistoryModalItem
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
        <SwapPageFooter />
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
