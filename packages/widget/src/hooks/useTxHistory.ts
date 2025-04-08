import { TxsStatus, useBroadcastedTxsStatus } from "@/pages/SwapExecutionPage/useBroadcastedTxs";
import { useSyncTxStatus } from "@/pages/SwapExecutionPage/useSyncTxStatus";
import { transactionHistoryAtom, TransactionHistoryItem } from "@/state/history";
import { SimpleStatus } from "@/utils/clientType";
import { TransferAssetRelease } from "@skip-go/client";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";

type useTxHistoryProps = {
  index: number;
  txHistoryItem: TransactionHistoryItem;
};

export const useTxHistory = ({
  txHistoryItem,
  index,
}: useTxHistoryProps): {
  status?: SimpleStatus;
  transferAssetRelease?: TransferAssetRelease;
  explorerLinks: string[];
} => {
  const txHistory = useAtomValue(transactionHistoryAtom);

  const txs = txHistoryItem.transactionDetails?.map((tx) => ({
    chainID: tx.chainID,
    txHash: tx.txHash,
  }));

  const txsRequired = txHistoryItem?.route?.txsRequired;

  const {
    data: statusData,
    isFetching,
    isPending,
  } = useBroadcastedTxsStatus({
    txsRequired,
    txs,
    enabled: txHistory[index].isSettled !== true,
  });

  useSyncTxStatus({
    statusData,
    historyIndex: index,
  });

  const explorerLinks = new Set();
  statusData?.transferEvents.forEach((transferEvent) => {
    explorerLinks.add(transferEvent.fromExplorerLink);
    explorerLinks.add(transferEvent.toExplorerLink);
  });
  txHistoryItem.transferEvents?.forEach((transferEvent) => {
    explorerLinks.add(transferEvent.fromExplorerLink);
    explorerLinks.add(transferEvent.toExplorerLink);
  });
  txHistoryItem.transactionDetails?.forEach((transactionDetail) => {
    explorerLinks.add(transactionDetail.explorerLink);
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
    transferAssetRelease: statusData?.transferAssetRelease ?? txHistoryItem.transferAssetRelease,
  };
};
