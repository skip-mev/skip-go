import { memo, useMemo } from "react";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { ICONS } from "@/icons";
import { sourceAssetAtom } from "@/state/swapPage";
import { currentPageAtom, Routes } from "@/state/router";
import { ConnectedWalletContent } from "./ConnectedWalletContent";
import { lastTransactionInTimeAtom, transactionHistoryAtom } from "@/state/history";
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
  const noHistoryItems = useAtomValue(noHistoryItemsAtom);
  const isFetchingLastTransactionStatus = useAtomValue(isFetchingLastTransactionStatusAtom);

  const historyPageButton = useMemo(() => {
    if (noHistoryItems) return;
    const getHistoryPageIcon = () => {
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
    };

    return {
      label: "History",
      icon: getHistoryPageIcon(),
      onClick: () => {
        track("swap page: history button - clicked");
        setCurrentPage(Routes.TransactionHistoryPage);
      },
    };
  }, [isFetchingLastTransactionStatus, noHistoryItems, setCurrentPage]);

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
  const lastTxHistoryItemInTime = useAtomValue(lastTransactionInTimeAtom);

  useTxHistory({
    txHistoryItem: lastTxHistoryItemInTime,
  });

  return null;
});

const noHistoryItemsAtom = atom((get) => {
  const txHistoryItems = get(transactionHistoryAtom);
  return txHistoryItems?.length === 0;
});

const isFetchingLastTransactionStatusAtom = atom((get) => {
  const lastTxHistoryItemInTime = get(lastTransactionInTimeAtom);

  return lastTxHistoryItemInTime?.status === "pending";
});
