import { useCallback, useEffect } from "react";
import { swapExecutionStateAtom } from "@/state/swapExecutionPage";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { blockingPageAtom, BlockingType } from "@/state/blockingPage";
import { track } from "@amplitude/analytics-browser";
import { TxsStatus } from "./useBroadcastedTxs";
import { Routes, currentPageAtom } from "@/state/router";
import { debouncedSourceAssetAmountAtom, sourceAssetAtom } from "@/state/swapPage";
import { skipAssetsAtom } from "@/state/skipClient";

export const useHandleTransactionFailed = (statusData?: TxsStatus) => {
  const setBlockingPage = useSetAtom(blockingPageAtom);
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
        track("unexpected error page: transaction reverted", {
          transferAssetRelease: statusData.transferAssetRelease,
          lastTransaction,
        });
        setBlockingPage({
          blockingType: BlockingType.TransactionReverted,
          onClickContinueTransaction: () => {
            setSourceAssetAtom(sourceClientAsset);
            setDebouncedSourceAssetAmountAtom(
              statusData.transferAssetRelease?.amount,
              undefined,
              true,
            );
            setCurrentPage(Routes.SwapPage);
            setBlockingPage(undefined);
          },
          explorerUrl: lastTransaction?.explorerLink ?? "",
          transferAssetRelease: statusData.transferAssetRelease,
        });
        return;
      }

      track("unexpected error page: transaction failed", { lastTransaction });
      setBlockingPage({
        blockingType: BlockingType.TransactionFailed,
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
    setBlockingPage,
    setSourceAssetAtom,
    sourceClientAsset,
    statusData?.isSettled,
    statusData?.isSuccess,
    statusData?.transferAssetRelease,
  ]);
};
