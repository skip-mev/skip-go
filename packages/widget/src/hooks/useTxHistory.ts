import { TxsStatus, useBroadcastedTxsStatus } from "@/pages/SwapExecutionPage/useBroadcastedTxs";
import { SimpleStatus } from "@/utils/clientType";
import { TransferAssetRelease } from "@skip-go/client";
import { useQuery } from "@tanstack/react-query";

export const useTxHistory = ({
  txs,
  txsRequired,
}: {
  statusData?: TxsStatus;
  txs: {
    chainID: string;
    txHash: string;
  }[];
  txsRequired: number;
}): {
  status?: SimpleStatus;
  transferAssetRelease?: TransferAssetRelease;
  explorerLinks: string[];
} => {
  const {
    data: statusData,
    isFetching,
    isPending,
  } = useBroadcastedTxsStatus({
    txsRequired: txsRequired,
    txs,
    enabled: txs.length === txsRequired,
  });

  const explorerLinks = new Set();
  statusData?.transferEvents.forEach((transferEvent) => {
    explorerLinks.add(transferEvent.fromExplorerLink);
    explorerLinks.add(transferEvent.toExplorerLink);
  });

  const query = useQuery({
    queryKey: ["tx-history-status", { txs, txsRequired, statusData }],
    queryFn: () => {
      // Incomplete is when multiple transactions are required but not all txs are signed/tracked
      if (txs.length !== txsRequired) return "incomplete";
      if (statusData?.lastTxStatus === "success") return "completed";
      if (isFetching && isPending) return "unconfirmed";
      if (statusData?.isSuccess) return "completed";
      if (statusData?.isSettled && !statusData?.isSuccess) return "failed";
      return "pending";
    },
  });
  return {
    status: query.data as SimpleStatus,
    explorerLinks: Array.from(explorerLinks).filter((link) => link) as string[],
    transferAssetRelease: statusData?.transferAssetRelease,
  };
};
