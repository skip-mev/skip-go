import { createModal, ModalProps, useModal } from "@/components/Modal";
import { Column } from "@/components/Layout";
import { styled } from "styled-components";
import { SwapPageHeader } from "@/pages/SwapPage/SwapPageHeader";
import { SwapPageFooter } from "@/pages/SwapPage/SwapPageFooter";
import { ICONS } from "@/icons";
import { VirtualList } from "@/components/VirtualList";
import {
  TransactionHistoryModalItem,
} from "./TransactionHistoryModalItem";
import { useState } from "react";
import { HistoryIcon } from "@/icons/HistoryIcon";
import { SmallText } from "@/components/Typography";
import { useAtomValue } from "jotai";
import { transactionHistoryAtom } from "@/state/history";

const ITEM_HEIGHT = 40;
const ITEM_GAP = 5;

export const TransactionHistoryModal = createModal(
  ({ ...modalProps }: ModalProps) => {
    const modal = useModal();
    const [itemIndexToShowDetail, setItemIndexToShowDetail] = useState<
      number | undefined
    >();
    const txHistory = useAtomValue(transactionHistoryAtom);
    return (
      <>
        <SwapPageHeader
          leftButton={{
            label: "Back",
            icon: ICONS.thinArrow,
            onClick: () => modal.remove(),
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
                    window.open("https://google.com", "_blank");
                  }}
                />
              )}
              itemKey={(item) => item.timestamp.toString()}
            />
          )}
        </StyledContainer>
        <SwapPageFooter />
      </>
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
