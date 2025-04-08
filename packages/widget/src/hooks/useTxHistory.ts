import { useBroadcastedTxsStatus } from "@/pages/SwapExecutionPage/useBroadcastedTxs";
import { useSyncTxStatus } from "@/pages/SwapExecutionPage/useSyncTxStatus";
import { TransactionHistoryItem } from "@/state/history";
import { skipChainsAtom } from "@/state/skipClient";
import { ClientTransferEvent, OverallStatus, SimpleStatus } from "@/utils/clientType";
import { TransferAssetRelease } from "@skip-go/client";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useMemo } from "react";

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
  const { data: chains } = useAtomValue(skipChainsAtom);

  const txs = txHistoryItem.transactionDetails?.map((tx) => ({
    chainID: tx.chainID,
    txHash: tx.txHash,
  }));

  const chainIdFound = chains?.some((chain) => txs.map((tx) => tx.chainID).includes(chain.chainID));

  const txsRequired = txHistoryItem?.route?.txsRequired;

  const txStatusFromTxHistoryItem = useMemo(() => {
    // Incomplete is when multiple transactions are required but not all txs are signed/tracked
    if (txs.length !== txsRequired) return "incomplete";
    if (txHistoryItem?.lastTxStatus === "success") return "completed";
    if (txHistoryItem?.isSuccess) return "completed";
    if (txHistoryItem?.isSettled && !txHistoryItem?.isSuccess) return "failed";
    return "pending";
  }, [
    txHistoryItem?.isSettled,
    txHistoryItem?.isSuccess,
    txHistoryItem?.lastTxStatus,
    txs.length,
    txsRequired,
  ]);

  let statusData: {
    transferEvents: ClientTransferEvent[];
    lastTxStatus?: OverallStatus;
    isSuccess: boolean;
    isSettled: boolean;
    transferAssetRelease?: TransferAssetRelease;
  } = txHistoryItem;

  const { data, isFetching, isPending } = useBroadcastedTxsStatus({
    txsRequired,
    txs,
    enabled: txStatusFromTxHistoryItem === "pending" && chainIdFound,
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
      if (txs.length !== txsRequired) return "incomplete";
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
    transferAssetRelease: statusData?.transferAssetRelease ?? txHistoryItem.transferAssetRelease,
  };
};
