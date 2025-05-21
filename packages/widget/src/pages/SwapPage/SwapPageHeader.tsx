import { memo, useMemo } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { ICONS } from "@/icons";
import { sourceAssetAtom } from "@/state/swapPage";
import { PageHeader } from "../../components/PageHeader";
import { currentPageAtom, Routes } from "@/state/router";
import { ConnectedWalletContent } from "./ConnectedWalletContent";
import { transactionHistoryAtom } from "@/state/history";
import { track } from "@amplitude/analytics-browser";
import { SpinnerIcon } from "@/icons/SpinnerIcon";
import { useGetAccount } from "@/hooks/useGetAccount";
import { useTxHistory } from "@/hooks/useTxHistory";

export const SwapPageHeader = memo(() => {
  const setCurrentPage = useSetAtom(currentPageAtom);
  const sourceAsset = useAtomValue(sourceAssetAtom);

  const getAccount = useGetAccount();
  const sourceAccount = getAccount(sourceAsset?.chainId);
  const transactionHistory = useAtomValue(transactionHistoryAtom);

  const historyPageIcon = useMemo(() => {
    if (transactionHistory.at(-1)?.status === "pending") {
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
  }, [transactionHistory]);

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
      <TxStatusSync />
      <PageHeader
        leftButton={historyPageButton}
        rightContent={sourceAccount ? <ConnectedWalletContent /> : null}
      />
    </>
  );
});

export const TxStatusSync = memo(() => {
  const transactionhistoryItem = useAtomValue(transactionHistoryAtom);

  useTxHistory({
    txHistoryItem: transactionhistoryItem.at(-1),
    index: transactionhistoryItem.length - 1,
  });

  return null;
});
