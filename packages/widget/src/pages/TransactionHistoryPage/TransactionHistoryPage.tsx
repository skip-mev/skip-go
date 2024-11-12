import { Column } from "@/components/Layout";
import { styled, useTheme } from "styled-components";
import { SwapPageHeader } from "@/pages/SwapPage/SwapPageHeader";
import { SwapPageFooter } from "@/pages/SwapPage/SwapPageFooter";
import { ICONS } from "@/icons";
import { VirtualList } from "@/components/VirtualList";
import { useMemo, useState } from "react";
import { HistoryIcon } from "@/icons/HistoryIcon";
import { useAtomValue, useSetAtom } from "jotai";
import { transactionHistoryAtom } from "@/state/history";
import { TransactionHistoryPageHistoryItem } from "./TransactionHistoryPageHistoryItem";
import { currentPageAtom, Routes } from "@/state/router";
import { useIsMobileScreenSize } from "@/hooks/useIsMobileScreenSize";

export const TransactionHistoryPage = () => {
  const theme = useTheme();
  const setCurrentPage = useSetAtom(currentPageAtom);
  const isMobileScreenSize = useIsMobileScreenSize();
  const [itemIndexToShowDetail, setItemIndexToShowDetail] = useState<
    number | undefined
  >(undefined);

  const txHistory = useAtomValue(transactionHistoryAtom);
  const historyList = useMemo(
    () => txHistory.sort((a, b) => b.timestamp - a.timestamp),
    [txHistory]
  );

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
        <VirtualList
          key={txHistory.length}
          listItems={historyList}
          height={isMobileScreenSize ? 0 : 262}
          empty={{
            details: "No transactions yet",
            icon: (
              <HistoryIcon
                width={30}
                height={30}
                color={theme?.primary?.text.lowContrast}
              />
            ),
          }}
          itemHeight={1}
          renderItem={(item, index) => (
            <TransactionHistoryPageHistoryItem
              index={index}
              txHistoryItem={item}
              showDetails={index === itemIndexToShowDetail}
              onClickRow={() =>
                setItemIndexToShowDetail((prev) =>
                  prev === index ? undefined : index
                )
              }
            />
          )}
          itemKey={(item) => item.transactionDetails[0].txHash}
        />
      </StyledContainer>
      <SwapPageFooter />
    </Column>
  );
};

const StyledContainer = styled(Column)`
  position: relative;
  padding: 20px;
  width: 100%;
  min-height: 302px;
  border-radius: 25px;
  background-color: ${({ theme }) => theme.primary.background.normal};
`;
