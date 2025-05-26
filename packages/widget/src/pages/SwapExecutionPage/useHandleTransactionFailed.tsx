import { useCallback, useEffect } from "react";
import { swapExecutionStateAtom } from "@/state/swapExecutionPage";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { errorWarningAtom, ErrorWarningType } from "@/state/errorWarning";
import { track } from "@amplitude/analytics-browser";
import { TxsStatus } from "./useBroadcastedTxs";
import { Routes, currentPageAtom } from "@/state/router";
import { debouncedSourceAssetAmountAtom, sourceAssetAtom } from "@/state/swapPage";
import { skipAssetsAtom } from "@/state/skipClient";
import { createSkipExplorerLink } from "@/utils/explorerLink";

export const useHandleTransactionFailed = (statusData?: TxsStatus) => {
  const setErrorWarning = useSetAtom(errorWarningAtom);
  const setCurrentPage = useSetAtom(currentPageAtom);
  const setSourceAssetAtom = useSetAtom(sourceAssetAtom);
  const setDebouncedSourceAssetAmountAtom = useSetAtom(debouncedSourceAssetAmountAtom);
  const [{ data: assets }] = useAtom(skipAssetsAtom);

  const { transactionDetailsArray } = useAtomValue(swapExecutionStateAtom);

  const lastTransaction = transactionDetailsArray.at(-1);
  const lastTxHash = lastTransaction?.txHash;
  const lastTxChainId = lastTransaction?.chainId;

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
        track("unexpected error page: transaction reverted", {
          transferAssetRelease: statusData.transferAssetRelease,
          lastTransaction,
        });
        setErrorWarning({
          errorWarningType: ErrorWarningType.TransactionReverted,
          onClickContinueTransaction: () => {
            setSourceAssetAtom(sourceClientAsset);
            setDebouncedSourceAssetAmountAtom(
              statusData.transferAssetRelease?.amount,
              undefined,
              true,
            );
            setCurrentPage(Routes.SwapPage);
            setErrorWarning(undefined);
          },
          explorerUrl: createSkipExplorerLink(lastTxHash, lastTxChainId),
          transferAssetRelease: statusData.transferAssetRelease,
        });
        return;
      }

      track("unexpected error page: transaction failed", { lastTransaction });
      setErrorWarning({
        errorWarningType: ErrorWarningType.TransactionFailed,
        onClickContactSupport: () => window.open("https://skip.build/discord", "_blank"),
        explorerLink: createSkipExplorerLink(lastTxHash, lastTxChainId),
        txHash: lastTxHash,
      });
    }
  }, [
    lastTransaction,
    lastTxChainId,
    lastTxHash,
    setCurrentPage,
    setDebouncedSourceAssetAmountAtom,
    setErrorWarning,
    setSourceAssetAtom,
    sourceClientAsset,
    statusData?.isSettled,
    statusData?.isSuccess,
    statusData?.transferAssetRelease,
  ]);
};
