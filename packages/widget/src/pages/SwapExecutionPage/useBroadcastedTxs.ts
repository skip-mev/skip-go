import {
  ClientTransferEvent,
  getSimpleOverallStatus,
  getTransferEventsFromTxStatusResponse,
  OverallStatus,
} from "@/utils/clientType";
import { transactionStatus, TransferAssetRelease } from "@skip-go/client";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useState, useMemo } from "react";

export type TxsStatus = {
  isSuccess: boolean;
  isSettled: boolean;
  transferEvents: ClientTransferEvent[];
  lastTxStatus?: OverallStatus;
  transferAssetRelease?: TransferAssetRelease;
};

export const useBroadcastedTxsStatus = ({
  txs,
  txsRequired,
  enabled,
}: {
  txsRequired?: number;
  txs: { chainId: string; txHash: string }[] | undefined;
  enabled?: boolean;
}): UseQueryResult<TxsStatus> => {
  const [isSettled, setIsSettled] = useState(false);
  const [prevData, setPrevData] = useState<TxsStatus | undefined>(undefined);

  const queryKey = useMemo(() => ["txs-status", txsRequired, txs] as const, [txs, txsRequired]);
  return useQuery({
    queryKey,
    queryFn: async ({ queryKey: [, txsRequired, txs] }) => {
      if (!txs) return;

      const results = await Promise.all(
        txs.map(async (tx) => {
          const _res = await transactionStatus(tx);
          return _res;
        }),
      );
      const transferEvents = getTransferEventsFromTxStatusResponse(results);
      const _isAllTxSettled = results.every((tx) => {
        return (
          tx.state === "STATE_COMPLETED_SUCCESS" ||
          tx.state === "STATE_COMPLETED_ERROR" ||
          tx.state === "STATE_ABANDONED"
        );
      });

      const isRouteSettled = txsRequired === results.length && _isAllTxSettled;
      if (isRouteSettled) {
        setIsSettled(true);
      }

      const someTxFailed = results.some((tx) => {
        return tx.state === "STATE_COMPLETED_ERROR" || tx.state === "STATE_ABANDONED";
      });

      const lastTxStatus =
        results.length > 0 ? getSimpleOverallStatus(results[results.length - 1].state) : undefined;

      const transferAssetRelease = results
        .reverse()
        .find((tx) => tx.transferAssetRelease)?.transferAssetRelease;

      const resData: TxsStatus = {
        isSuccess: isRouteSettled && !someTxFailed && lastTxStatus === "success",
        lastTxStatus,
        isSettled: isRouteSettled,
        transferEvents,
        transferAssetRelease: transferAssetRelease || undefined,
      };
      setPrevData(resData);
      return resData;
    },
    enabled: !isSettled && (!!txs && txs.length > 0 && enabled !== undefined ? enabled : true),
    refetchInterval: 500,
    // to make the data persist when query key changed
    initialData: prevData,
  });
};
