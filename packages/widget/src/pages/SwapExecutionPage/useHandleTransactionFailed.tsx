import { useCallback, useEffect } from "react";
import { swapExecutionStateAtom } from "@/state/swapExecutionPage";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { errorAtom, ErrorType } from "@/state/errorPage";
import { track } from "@amplitude/analytics-browser";
import { TxsStatus } from "./useBroadcastedTxs";
import { Routes, currentPageAtom } from "@/state/router";
import { debouncedSourceAssetAmountAtom, sourceAssetAtom } from "@/state/swapPage";
import { skipAssetsAtom } from "@/state/skipClient";

export const useHandleTransactionFailed = (statusData?: TxsStatus) => {
  const setError = useSetAtom(errorAtom);
  const setCurrentPage = useSetAtom(currentPageAtom);
  const setSourceAssetAtom = useSetAtom(sourceAssetAtom);
  const setDebouncedSourceAssetAmountAtom = useSetAtom(debouncedSourceAssetAmountAtom);
  const [{ data: assets }] = useAtom(skipAssetsAtom);

  const { transactionDetailsArray } = useAtomValue(swapExecutionStateAtom);

  const lastTransaction = transactionDetailsArray[transactionDetailsArray.length - 1];

  const getClientAsset = useCallback(
    (denom?: string, chainId?: string) => {
      if (!denom || !chainId) return;
      if (!assets) return;
      return assets.find(
        (a) => a.denom.toLowerCase() === denom.toLowerCase() && a.chainId === chainId,
      );
    },
    [assets],
  );

  const sourceClientAsset = getClientAsset(
    statusData?.transferAssetRelease?.denom,
    statusData?.transferAssetRelease?.chainId,
  );

  useEffect(() => {
    if (statusData?.isSettled && !statusData?.isSuccess) {
      if (sourceClientAsset) {
        track("error page: transaction reverted", {
          transferAssetRelease: statusData.transferAssetRelease,
          lastTransaction,
        });
        setError({
          errorType: ErrorType.TransactionReverted,
          onClickContinueTransaction: () => {
            setSourceAssetAtom(sourceClientAsset);
            setDebouncedSourceAssetAmountAtom(
              statusData.transferAssetRelease?.amount,
              undefined,
              true,
            );
            setCurrentPage(Routes.SwapPage);
            setError(undefined);
          },
          explorerUrl: lastTransaction?.explorerLink ?? "",
          transferAssetRelease: statusData.transferAssetRelease,
        });
        return;
      }

      track("error page: transaction failed", { lastTransaction });
      setError({
        errorType: ErrorType.TransactionFailed,
        onClickContactSupport: () => window.open("https://skip.build/discord", "_blank"),
        explorerLink: lastTransaction?.explorerLink ?? "",
        txHash: lastTransaction?.txHash,
      });
    }
  }, [
    lastTransaction,
    lastTransaction?.explorerLink,
    lastTransaction?.txHash,
    setCurrentPage,
    setDebouncedSourceAssetAmountAtom,
    setError,
    setSourceAssetAtom,
    sourceClientAsset,
    statusData?.isSettled,
    statusData?.isSuccess,
    statusData?.transferAssetRelease,
  ]);
};
