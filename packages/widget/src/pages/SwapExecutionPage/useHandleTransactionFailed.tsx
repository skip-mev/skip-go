import { useCallback, useEffect } from "react";
import { setCurrentTransactionIdAtom, swapExecutionStateAtom } from "@/state/swapExecutionPage";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { errorWarningAtom, ErrorWarningType } from "@/state/errorWarning";
import { track } from "@amplitude/analytics-browser";
import { Routes, currentPageAtom } from "@/state/router";
import { sourceAssetAtom } from "@/state/swapPage";
import { skipAssetsAtom } from "@/state/skipClient";
import { createSkipExplorerLink } from "@/utils/explorerLink";
import { RouteDetails } from "@skip-go/client";
import { currentTransactionAtom } from "@/state/history";
import { convertTokenAmountToHumanReadableAmount } from "@/utils/crypto";

const DELAY_EXPECTING_TRANSFER_ASSET_RELEASE = 15_000;

export const useHandleTransactionFailed = (error: Error, statusData?: RouteDetails) => {
  const setErrorWarning = useSetAtom(errorWarningAtom);
  const setCurrentPage = useSetAtom(currentPageAtom);
  const setSourceAsset = useSetAtom(sourceAssetAtom);
  const setCurrentTransactionId = useSetAtom(setCurrentTransactionIdAtom);
  const currentTransaction = useAtomValue(currentTransactionAtom);
  const [{ data: assets }] = useAtom(skipAssetsAtom);

  const { route } = useAtomValue(swapExecutionStateAtom);

  const lastTransaction = currentTransaction?.transactionDetails.at(-1);
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

  const explorerLink = createSkipExplorerLink(currentTransaction?.transactionDetails);

  const handleTransactionFailed = useCallback(() => {
    // Track a high level error event for overall monitoring
    track("unexpected error page: error occurred", { error, route });

    const sourceClientAsset = getClientAsset(
      statusData?.transferAssetRelease?.denom,
      statusData?.transferAssetRelease?.chainId,
    );

    if (sourceClientAsset) {
      track("unexpected error page: transaction reverted", {
        transferAssetRelease: statusData?.transferAssetRelease,
        lastTransaction,
        error,
        route,
      });
      setErrorWarning({
        errorWarningType: ErrorWarningType.TransactionReverted,
        onClickContinueTransaction: () => {
          setSourceAsset({
            ...sourceClientAsset,
            amount: convertTokenAmountToHumanReadableAmount(
              statusData?.transferAssetRelease?.amount ?? "",
              sourceClientAsset.decimals,
            ),
          });

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
        onClickContactSupport: () => window.open("https://discord.com/invite/interchain", "_blank"),
        explorerLink,
        txHash: lastTxHash ?? "",
      });
    } else {
      track("unexpected error page: unexpected error", { error, route });
      setErrorWarning({
        errorWarningType: ErrorWarningType.Unexpected,
        error,
        onClickBack: () => {
          setCurrentTransactionId();
        },
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
    setCurrentTransactionId,
    setErrorWarning,
    setSourceAsset,
    statusData?.transferAssetRelease,
  ]);

  useEffect(() => {
    if (error) {
      handleTransactionFailed();
    } else if (statusData?.status === "failed" || statusData?.status === "incomplete") {
      const timeout = setTimeout(() => {
        handleTransactionFailed();
      }, DELAY_EXPECTING_TRANSFER_ASSET_RELEASE);

      if (statusData?.transferAssetRelease) {
        clearTimeout(timeout);
        handleTransactionFailed();
      }
      return () => clearTimeout(timeout);
    }
  }, [
    statusData?.transferAssetRelease,
    handleTransactionFailed,
    statusData?.status,
    statusData,
    error,
  ]);
};
