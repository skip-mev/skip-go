import { TxsStatus, useBroadcastedTxsStatus } from "@/pages/SwapExecutionPage/useBroadcastedTxs";
import { useQuery } from "@tanstack/react-query";

export const useTxHistoryStatus = ({
  txs,
  txsRequired,
}: {
  statusData?: TxsStatus;
  txs: {
    chainID: string;
    txHash: string;
  }[];
  txsRequired: number;
}) => {
  const {
    data: statusData,
    isFetching,
    isPending,
  } = useBroadcastedTxsStatus({
    txsRequired: txsRequired,
    txs,
    enabled: txs.length === txsRequired,
  });

  const query = useQuery({
    queryKey: ["tx-history-status", { txs, txsRequired, statusData }],
    queryFn: () => {
      // Incomplete is when multiple transactions are required but not all txs are signed/tracked
      if (txs.length !== txsRequired) return "incomplete";
      if (isFetching && isPending) return "unconfirmed";
      if (statusData?.isSuccess) return "completed";
      if (statusData?.isSettled && !statusData?.isSuccess) return "failed";
      return "pending";
    },
  });
  return query.data;
};
