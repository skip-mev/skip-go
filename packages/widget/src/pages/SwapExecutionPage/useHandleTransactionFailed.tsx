import { useCallback, useEffect } from "react";
import { setOverallStatusAtom, swapExecutionStateAtom } from "@/state/swapExecutionPage";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { errorWarningAtom, ErrorWarningType } from "@/state/errorWarning";
import { track } from "@amplitude/analytics-browser";
import { TxsStatus } from "./useBroadcastedTxs";
import { Routes, currentPageAtom } from "@/state/router";
import { debouncedSourceAssetAmountAtom, sourceAssetAtom } from "@/state/swapPage";
import { skipAssetsAtom } from "@/state/skipClient";
import { createSkipExplorerLink } from "@/utils/explorerLink";

const DELAY_EXPECTING_TRANSFER_ASSET_RELEASE = 15_000;

export const useHandleTransactionFailed = (error: Error, statusData?: TxsStatus) => {
  const setErrorWarning = useSetAtom(errorWarningAtom);
  const setCurrentPage = useSetAtom(currentPageAtom);
  const setSourceAsset = useSetAtom(sourceAssetAtom);
  const setDebouncedSourceAssetAmount = useSetAtom(debouncedSourceAssetAmountAtom);
  const setOverallStatus = useSetAtom(setOverallStatusAtom);
  const [{ data: assets }] = useAtom(skipAssetsAtom);

  const { transactionDetailsArray, route } = useAtomValue(swapExecutionStateAtom);

  const lastTransaction = transactionDetailsArray.at(-1);
  const lastTxHash = lastTransaction?.txHash;

  const getClientAsset = useCallback(
    (denom?: string, chainId?: string) => {
      if (!denom || !chainId || !assets) return;
      return assets.find(
        (a) => a.denom.toLowerCase() === denom.toLowerCase() && a.chainId === chainId,
      );
    },
    [assets],
  );

  const explorerLink = createSkipExplorerLink(transactionDetailsArray);

  const handleTransactionFailed = useCallback(() => {
    const sourceClientAsset = getClientAsset(
      statusData?.transferAssetRelease?.denom,
      statusData?.transferAssetRelease?.chainId,
    );

    if (sourceClientAsset) {
      track("unexpected error page: transaction reverted", {
        transferAssetRelease: statusData?.transferAssetRelease,
        lastTransaction,
        error,
        route
      });
      setErrorWarning({
        errorWarningType: ErrorWarningType.TransactionReverted,
        onClickContinueTransaction: () => {
          setSourceAsset({
            ...sourceClientAsset,
          });
          setDebouncedSourceAssetAmount(statusData?.transferAssetRelease?.amount, undefined, true);
          setCurrentPage(Routes.SwapPage);
          setErrorWarning(undefined);
        },
        explorerUrl: explorerLink,
        transferAssetRelease: statusData?.transferAssetRelease,
      });
    } else if (explorerLink) {
      track("unexpected error page: transaction failed", { lastTransaction, error, route });
      setErrorWarning({
        errorWarningType: ErrorWarningType.TransactionFailed,
        onClickContactSupport: () => window.open("https://skip.build/discord", "_blank"),
        explorerLink,
        txHash: lastTxHash ?? "",
      });
    } else {
      track("unexpected error page: unexpected error", { error, route });
      setErrorWarning({
        errorWarningType: ErrorWarningType.Unexpected,
        error,
        onClickBack: () => setOverallStatus("unconfirmed"),
      });
    }
  }, [
    error,
    explorerLink,
    getClientAsset,
    lastTransaction,
    lastTxHash,
    route,
    setCurrentPage,
    setDebouncedSourceAssetAmount,
    setErrorWarning,
    setOverallStatus,
    setSourceAsset,
    statusData?.transferAssetRelease,
  ]);

  useEffect(() => {
    if (statusData?.isSuccess || !statusData?.isSettled) return;

    const timeout = setTimeout(() => {
      handleTransactionFailed();
    }, DELAY_EXPECTING_TRANSFER_ASSET_RELEASE);

    if (statusData.transferAssetRelease) {
      clearTimeout(timeout);
      handleTransactionFailed();
    }

    return () => clearTimeout(timeout);
  }, [
    statusData?.isSettled,
    statusData?.isSuccess,
    statusData?.transferAssetRelease,
    handleTransactionFailed,
  ]);
};
