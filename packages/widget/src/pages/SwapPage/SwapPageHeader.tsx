import { memo, useMemo } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { ICONS } from "@/icons";
import { sourceAssetAtom } from "@/state/swapPage";
import { currentPageAtom, Routes } from "@/state/router";
import { ConnectedWalletContent } from "./ConnectedWalletContent";
import { isFetchingLastTransactionStatusAtom, transactionHistoryAtom } from "@/state/history";
import { track } from "@amplitude/analytics-browser";
import { SpinnerIcon } from "@/icons/SpinnerIcon";
import { useGetAccount } from "@/hooks/useGetAccount";
import { useTxHistory } from "@/hooks/useTxHistory";
import { PageHeader } from "@/components/PageHeader";

export const SwapPageHeader = memo(() => {
  const setCurrentPage = useSetAtom(currentPageAtom);
  const sourceAsset = useAtomValue(sourceAssetAtom);

  const getAccount = useGetAccount();
  const sourceAccount = getAccount(sourceAsset?.chainId);
  const isFetchingLastTransactionStatus = useAtomValue(isFetchingLastTransactionStatusAtom);

  const historyPageIcon = useMemo(() => {
    if (isFetchingLastTransactionStatus) {
      return (
        <div
          style={{
            marginLeft: "8px",
            marginRight: "8px",
            position: "relative",
          }}
        >
          <SpinnerIcon
            style={{
              animation: "spin 1s linear infinite",
              position: "absolute",
              height: 14,
              width: 14,
            }}
          />
        </div>
      );
    }

    return ICONS.history;
  }, [isFetchingLastTransactionStatus]);

  const historyPageButton = useMemo(() => {
    return {
      label: "History",
      icon: historyPageIcon,
      onClick: () => {
        track("swap page: history button - clicked");
        setCurrentPage(Routes.TransactionHistoryPage);
      },
    };
  }, [historyPageIcon, setCurrentPage]);

  return (
    <>
      {isFetchingLastTransactionStatus && <TrackLatestTxHistoryItemStatus />}
      <PageHeader
        leftButton={historyPageButton}
        rightContent={sourceAccount ? <ConnectedWalletContent /> : null}
      />
    </>
  );
});

export const TrackLatestTxHistoryItemStatus = memo(() => {
  const transactionhistory = useAtomValue(transactionHistoryAtom);
  const lastTxHistoryItem = transactionhistory.at(-1);

  useTxHistory({
    txHistoryItem: lastTxHistoryItem,
    index: transactionhistory.length - 1,
  });

  return null;
});
