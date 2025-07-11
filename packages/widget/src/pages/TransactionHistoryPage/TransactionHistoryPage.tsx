import { Column } from "@/components/Layout";
import { styled, useTheme } from "styled-components";
import { PageHeader } from "@/components/PageHeader";
import { ICONS } from "@/icons";
import { VirtualList } from "@/components/VirtualList";
import { useState } from "react";
import { HistoryIcon } from "@/icons/HistoryIcon";
import { useAtomValue, useSetAtom } from "jotai";
import { sortedHistoryItemsAtom } from "@/state/history";
import { TransactionHistoryPageHistoryItem } from "./TransactionHistoryPageHistoryItem";
import { currentPageAtom, Routes } from "@/state/router";
import { track } from "@amplitude/analytics-browser";
import { convertToPxValue } from "@/utils/style";

export const TransactionHistoryPage = () => {
  const theme = useTheme();
  const setCurrentPage = useSetAtom(currentPageAtom);
  const [itemIndexToShowDetail, setItemIndexToShowDetail] = useState<number | undefined>(undefined);

  const sortedHistoryItems = useAtomValue(sortedHistoryItemsAtom);

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
          key={sortedHistoryItems.length}
          listItems={sortedHistoryItems}
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
              onClickDelete={() => setItemIndexToShowDetail(undefined)}
            />
          )}
          itemKey={(item) => item.id}
          expandedItemKey={
            itemIndexToShowDetail ? sortedHistoryItems[itemIndexToShowDetail]?.id : undefined
          }
        />
      </StyledContainer>
    </Column>
  );
};

const StyledContainer = styled(Column)`
  position: relative;
  padding: 20px;
  width: 100%;
  min-height: 300px;
  border-radius: ${({ theme }) => convertToPxValue(theme.borderRadius?.main)};
  background: ${({ theme }) => theme.primary.background.normal};
`;
