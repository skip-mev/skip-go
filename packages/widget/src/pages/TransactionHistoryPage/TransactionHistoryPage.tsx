import { Column } from "@/components/Layout";
import { styled, useTheme } from "styled-components";
import { PageHeader } from "@/components/PageHeader";
import { SwapPageFooter } from "@/pages/SwapPage/SwapPageFooter";
import { ICONS } from "@/icons";
import { VirtualList } from "@/components/VirtualList";
import { useMemo, useState } from "react";
import { HistoryIcon } from "@/icons/HistoryIcon";
import { useAtomValue, useSetAtom } from "jotai";
import { transactionHistoryAtom } from "@/state/history";
import { TransactionHistoryPageHistoryItem } from "./TransactionHistoryPageHistoryItem";
import { currentPageAtom, Routes } from "@/state/router";
import { track } from "@amplitude/analytics-browser";

export const TransactionHistoryPage = () => {
  const theme = useTheme();
  const setCurrentPage = useSetAtom(currentPageAtom);
  const [itemIndexToShowDetail, setItemIndexToShowDetail] = useState<number | undefined>(undefined);

  const txHistory = useAtomValue(transactionHistoryAtom);
  const historyList = useMemo(
    () => txHistory.sort((a, b) => b.timestamp - a.timestamp),
    [txHistory],
  );

  return (
    <Column gap={5}>
      <PageHeader
        leftButton={{
          label: "Back",
          icon: ICONS.thinArrow,
          onClick: () => {
            track("transaction history page: header back button - clicked");
            setCurrentPage(Routes.SwapPage);
          },
        }}
      />
      <StyledContainer gap={5}>
        <VirtualList
          key={txHistory.length}
          listItems={historyList}
          height={262}
          empty={{
            details: "No transactions yet",
            icon: <HistoryIcon width={30} height={30} color={theme?.primary?.text.lowContrast} />,
          }}
          itemHeight={55}
          renderItem={(item, index, refSetter) => (
            <TransactionHistoryPageHistoryItem
              ref={refSetter}
              index={index}
              txHistoryItem={item}
              showDetails={index === itemIndexToShowDetail}
              onClickRow={() => {
                track("transaction history page: transaction row - clicked", {
                  item,
                });
                setItemIndexToShowDetail((prev) => (prev === index ? undefined : index));
              }}
            />
          )}
          itemKey={(item) => item?.transactionDetails?.[0]?.txHash}
          expandedItemKey={
            itemIndexToShowDetail
              ? historyList[itemIndexToShowDetail]?.transactionDetails?.[0]?.txHash
              : undefined
          }
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
  min-height: 300px;
  border-radius: 25px;
  background: ${({ theme }) => theme.primary.background.normal};
`;
