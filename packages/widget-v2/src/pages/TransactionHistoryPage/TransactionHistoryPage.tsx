import { Column } from "@/components/Layout";
import { styled, useTheme } from "styled-components";
import { SwapPageHeader } from "@/pages/SwapPage/SwapPageHeader";
import { SwapPageFooter } from "@/pages/SwapPage/SwapPageFooter";
import { ICONS } from "@/icons";
import { VirtualList } from "@/components/VirtualList";
import { useState } from "react";
import { HistoryIcon } from "@/icons/HistoryIcon";
import { SmallText } from "@/components/Typography";
import { useAtomValue, useSetAtom } from "jotai";
import { transactionHistoryAtom } from "@/state/history";
import { TransactionHistoryPageHistoryItem } from "./TransactionHistoryPageHistoryItem";
import { currentPageAtom, Routes } from "@/state/router";

const ITEM_HEIGHT = 40;
const ITEM_GAP = 5;

export const TransactionHistoryPage = () => {
  const theme = useTheme();
  const setCurrentPage = useSetAtom(currentPageAtom);
  const [itemIndexToShowDetail, setItemIndexToShowDetail] = useState<
    number | undefined
  >();
  const txHistory = useAtomValue(transactionHistoryAtom);
  return (
    <Column gap={5}>
      <SwapPageHeader
        leftButton={{
          label: "Back",
          icon: ICONS.thinArrow,
          onClick: () => setCurrentPage(Routes.SwapPage),
        }}
      />
      <StyledContainer gap={5} justify="center">
        {txHistory.length === 0 ? (
          <StyledNoTransactionHistoryContainer
            align="center"
            justify="center"
            gap={15}
          >
            <HistoryIcon
              width={30}
              height={30}
              color={theme?.primary?.text.lowContrast}
            />
            <SmallText>No transactions yet</SmallText>
          </StyledNoTransactionHistoryContainer>
        ) : (
          <VirtualList
            key={txHistory.length}
            listItems={txHistory}
            height={262}
            itemHeight={1}
            renderItem={(item, index) => (
              <TransactionHistoryPageHistoryItem
                index={index}
                txHistoryItem={item}
                showDetails={index === itemIndexToShowDetail}
                onClickRow={() => {
                  if (index !== itemIndexToShowDetail) {
                    setItemIndexToShowDetail(index);
                  } else {
                    setItemIndexToShowDetail(undefined);
                  }
                }}
              />
            )}
            itemKey={(item) => item.transactionDetails[0].txHash}
          />
        )}
      </StyledContainer>
      <SwapPageFooter />
    </Column>
  );
};

const StyledNoTransactionHistoryContainer = styled(Column)`
  height: 100%;
  width: 100%;
`;

const StyledContainer = styled(Column)`
  position: relative;
  padding: 20px;
  width: 480px;
  min-height: 302px;
  border-radius: 25px;
  background-color: ${({ theme }) => theme.primary.background.normal};
`;
