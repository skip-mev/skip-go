import { TxsStatus, useBroadcastedTxsStatus } from "@/pages/SwapExecutionPage/useBroadcastedTxs";
import { useSyncTxStatus } from "@/pages/SwapExecutionPage/useSyncTxStatus";
import { transactionHistoryAtom, TransactionHistoryItem } from "@/state/history";
import { skipChainsAtom } from "@/state/skipClient";
import { SimpleStatus } from "@/utils/clientType";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { memo } from "react";

type useTxHistoryProps = {
  index: number;
  txHistoryItem?: TransactionHistoryItem;
};

export const useTxHistory = ({ txHistoryItem, index }: useTxHistoryProps) => {
  const { data: chains } = useAtomValue(skipChainsAtom);

  const txs = txHistoryItem?.transactionDetails?.map((tx) => ({
    chainID: tx.chainID,
    txHash: tx.txHash,
  }));

  const chainIdFound = chains?.some((chain) =>
    txs?.map((tx) => tx.chainID).includes(chain.chainID),
  );

  const txsRequired = txHistoryItem?.route?.txsRequired;

  let statusData: TransactionHistoryItem | TxsStatus | undefined = txHistoryItem;

  const { data, isFetching, isPending } = useBroadcastedTxsStatus({
    txsRequired,
    txs,
    enabled: !txHistoryItem?.isSettled && chainIdFound,
  });

  if (data !== undefined) {
    statusData = data;
  }

  useSyncTxStatus({
    statusData,
    historyIndex: index,
  });

  const explorerLinks = new Set();
  statusData?.transferEvents?.forEach((transferEvent) => {
    explorerLinks.add(transferEvent.fromExplorerLink);
    explorerLinks.add(transferEvent.toExplorerLink);
  });

  const query = useQuery({
    queryKey: ["tx-history-status", { txs, txsRequired, statusData }],
    queryFn: () => {
      // Incomplete is when multiple transactions are required but not all txs are signed/tracked
      if (txs?.length !== txsRequired) return "incomplete";
      if (statusData?.lastTxStatus === "success") return "completed";
      if (isFetching && isPending) return "unconfirmed";
      if (statusData?.isSuccess) return "completed";
      if ((statusData?.isSettled && !statusData?.isSuccess) || !chainIdFound) return "failed";
      return "pending";
    },
  });

  return {
    status: query.data as SimpleStatus,
    explorerLinks: Array.from(explorerLinks).filter((link) => link) as string[],
    transferAssetRelease: statusData?.transferAssetRelease ?? txHistoryItem?.transferAssetRelease,
  };
};

export const TxStatusSync = memo(() => {
  const lastTransaction = useAtomValue(transactionHistoryAtom);

  useTxHistory({
    txHistoryItem: lastTransaction.at(-1),
    index: lastTransaction.length - 1,
  });

  return null;
});
