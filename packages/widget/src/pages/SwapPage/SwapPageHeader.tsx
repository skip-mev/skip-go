import { memo, useMemo } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { ICONS } from "@/icons";
import { sourceAssetAtom } from "@/state/swapPage";
import { PageHeader } from "../../components/PageHeader";
import { currentPageAtom, Routes } from "@/state/router";
import { ConnectedWalletContent } from "./ConnectedWalletContent";
import { lastTransactionIsSettledAtom } from "@/state/history";
import { track } from "@amplitude/analytics-browser";
import { SpinnerIcon } from "@/icons/SpinnerIcon";
import { TxStatusSync } from "@/hooks/useTxHistory";
import { useGetAccount } from "@/hooks/useGetAccount";

export const SwapPageHeader = memo(() => {
  const setCurrentPage = useSetAtom(currentPageAtom);
  const sourceAsset = useAtomValue(sourceAssetAtom);

  const lastTransactionIsSettled = useAtomValue(lastTransactionIsSettledAtom);

  const getAccount = useGetAccount();
  const sourceAccount = getAccount(sourceAsset?.chainID);

  const historyPageIcon = useMemo(() => {
    if (!lastTransactionIsSettled) {
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
  }, [lastTransactionIsSettled]);

  const historyPageButton = useMemo(() => {
    if (lastTransactionIsSettled === undefined) return;

    return {
      label: "History",
      icon: historyPageIcon,
      onClick: () => {
        track("swap page: history button - clicked");
        setCurrentPage(Routes.TransactionHistoryPage);
      },
    };
  }, [lastTransactionIsSettled, historyPageIcon, setCurrentPage]);

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
