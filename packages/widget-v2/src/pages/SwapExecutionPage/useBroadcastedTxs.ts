import { skipClient as skipClientAtom } from "@/state/skipClient";
import { ClientTransferEvent, getTransferEventsFromTxStatusResponse } from "@/utils/clientType";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useState, useMemo } from "react";


export type TxsStatus = {
  isSuccess: boolean;
  isSettled: boolean;
  transferEvents: ClientTransferEvent[];
};

export const useBroadcastedTxsStatus = ({
  txs,
  txsRequired,
  enabled,
}: {
  txsRequired?: number;
  txs: { chainID: string; txHash: string }[] | undefined;
  enabled?: boolean;
}): UseQueryResult<TxsStatus> => {
  const skipClient = useAtomValue(skipClientAtom);
  const [isSettled, setIsSettled] = useState(false);
  const [prevData, setPrevData] = useState<TxsStatus | undefined>(undefined);
  const queryKey = useMemo(
    () => ["txs-status", txsRequired, txs] as const,
    [txs, txsRequired]
  );
  return useQuery({
    queryKey,
    queryFn: async ({ queryKey: [, txsRequired, txs] }) => {
      if (!txs) return;

      const results = await Promise.all(
        txs.map(async (tx) => {
          const _res = await skipClient.transactionStatus({
            chainID: tx.chainID,
            txHash: tx.txHash,
          });
          return _res;
        }));
      const transferEvents = getTransferEventsFromTxStatusResponse(results);
      const _isSettled = results.every((tx) => {
        return (
          tx.state === "STATE_COMPLETED_SUCCESS" ||
          tx.state === "STATE_COMPLETED_ERROR" ||
          tx.state === "STATE_ABANDONED"
        );
      });

      const _isSuccess = transferEvents.every((tx) => {
        return tx.status === "completed";
      });

      if (transferEvents.length > 0 && txsRequired === results.length && _isSettled) {
        setIsSettled(true);
      }

      const resData: TxsStatus = {
        isSuccess: _isSuccess,
        isSettled: _isSettled,
        transferEvents,
      };
      setPrevData(resData);
      return resData;
    },
    enabled:
      !isSettled &&
      (!!txs && txs.length > 0 && enabled !== undefined ? enabled : true),
    refetchInterval: 500,
    // to make the data persist when query key changed
    initialData: prevData,
  });
};
