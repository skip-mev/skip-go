import { TransactionDetails } from "@/state/swapExecutionPage";
import {
  ClientTransferEvent,
  getSimpleOverallStatus,
  getTransferEventsFromTxStatusResponse,
  OverallStatus,
} from "@/utils/clientType";
import { transactionStatus, TransferAssetRelease, TxStatusResponse } from "@skip-go/client";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useState, useMemo } from "react";

export type TxsStatus = {
  isSuccess: boolean;
  isSettled: boolean;
  transactionDetails: TransactionDetails[];
  transferEvents: ClientTransferEvent[];
  lastTxStatus?: OverallStatus;
  transferAssetRelease?: TransferAssetRelease;
};

export type useBroadcastedTxsStatusProps = {
  txsRequired?: number;
  transactionDetails: TransactionDetails[] | undefined;
  enabled?: boolean;
};
export const useBroadcastedTxsStatus = ({
  transactionDetails,
  txsRequired,
  enabled,
}: useBroadcastedTxsStatusProps): UseQueryResult<TxsStatus> => {
  const [prevData, setPrevData] = useState<TxsStatus | undefined>(undefined);

  const queryKey = useMemo(
    () => ["txs-status", txsRequired, transactionDetails] as const,
    [transactionDetails, txsRequired],
  );

  const incompleteTxs = useMemo(() => {
    return transactionDetails?.filter(
      (tx) =>
        tx.status?.state !== "STATE_COMPLETED_SUCCESS" &&
        tx.status?.state !== "STATE_COMPLETED_ERROR" &&
        tx.status?.state !== "STATE_ABANDONED",
    );
  }, [transactionDetails]);

  const queryEnabled = useMemo(() => {
    return incompleteTxs?.length !== 0 && enabled;
  }, [enabled, incompleteTxs?.length]);

  return useQuery({
    queryKey,
    queryFn: async ({ queryKey: [, txsRequired, txs] }) => {
      if (!txs || !incompleteTxs) return;

      try {
        const statusResponseMap = new Map<string, TxStatusResponse>();

        txs.forEach((tx) => {
          if (tx.status) statusResponseMap.set(tx.txHash, tx.status);
        });

        await Promise.all(
          incompleteTxs.map(async (tx) => {
            const status = await transactionStatus(tx);
            statusResponseMap.set(tx.txHash, status);
          }),
        );

        const updatedTransactionDetails: TransactionDetails[] = txs.map((tx) => ({
          ...tx,
          status: statusResponseMap.get(tx.txHash) ?? tx.status,
        }));

        const validStatuses: TxStatusResponse[] = updatedTransactionDetails
          .map((tx) => tx.status)
          .filter((status): status is TxStatusResponse => status !== undefined);

        const transferEvents = getTransferEventsFromTxStatusResponse(validStatuses);

        const isFinalState = (state?: string) => {
          return (
            state === "STATE_COMPLETED_SUCCESS" ||
            state === "STATE_COMPLETED_ERROR" ||
            state === "STATE_ABANDONED"
          );
        };

        const isAllSettled =
          txsRequired === validStatuses.length &&
          validStatuses.every((status) => isFinalState(status.state));

        const someTxFailed = validStatuses.some(
          (status) =>
            status.state === "STATE_COMPLETED_ERROR" || status.state === "STATE_ABANDONED",
        );

        const lastTx = validStatuses.at(-1);
        const lastTxStatus = lastTx?.state ? getSimpleOverallStatus(lastTx.state) : undefined;

        const transferAssetRelease = validStatuses
          .reverse()
          .find((tx) => tx.transferAssetRelease)?.transferAssetRelease;

        const resData: TxsStatus = {
          isSuccess: isAllSettled && !someTxFailed && lastTxStatus === "success",
          lastTxStatus,
          transactionDetails: updatedTransactionDetails,
          isSettled: isAllSettled,
          transferEvents,
          transferAssetRelease,
        };

        setPrevData(resData);
        return resData;
      } catch (_error) {
        const validStatuses: TxStatusResponse[] = (transactionDetails ?? [])
          .map((tx) => tx.status)
          .filter((status): status is TxStatusResponse => status !== undefined);

        const transferEvents = getTransferEventsFromTxStatusResponse(validStatuses);

        const transferAssetRelease = validStatuses
          .reverse()
          .find((tx) => tx.transferAssetRelease)?.transferAssetRelease;

        const fallbackData: TxsStatus = {
          isSuccess: false,
          isSettled: true,
          transactionDetails: transactionDetails ?? [],
          lastTxStatus: "failed",
          transferEvents: transferEvents,
          transferAssetRelease: transferAssetRelease,
        };
        setPrevData(fallbackData);
        return fallbackData;
      }
    },
    enabled: queryEnabled,
    refetchInterval: 500,
    initialData: prevData,
  });
};
