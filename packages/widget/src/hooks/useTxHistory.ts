import { useBroadcastedTxsStatus } from "@/pages/SwapExecutionPage/useBroadcastedTxs";
import { useSyncTxStatus } from "@/pages/SwapExecutionPage/useSyncTxStatus";
import { TransactionHistoryItem } from "@/state/history";
import { skipChainsAtom } from "@/state/skipClient";
import { ClientTransferEvent, OverallStatus, SimpleStatus } from "@/utils/clientType";
import { TransferAssetRelease } from "@skip-go/client/v2";
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
  const { data: chains } = useAtomValue(skipChainsAtom);

  const txs = txHistoryItem.transactionDetails?.map((tx) => ({
    chainId: tx.chainId,
    txHash: tx.txHash,
  }));

  const chainIdFound = chains?.some((chain) =>
    txs.map((tx) => tx.chainId).includes(chain.chainId ?? ""),
  );

  const txsRequired = txHistoryItem?.route?.txsRequired;

  let statusData: {
    transferEvents: ClientTransferEvent[]
    lastTxStatus?: OverallStatus;
    isSuccess: boolean;
    isSettled: boolean;
    transferAssetRelease?: TransferAssetRelease;
  } = txHistoryItem;

  const { data, isFetching, isPending } = useBroadcastedTxsStatus({
    txsRequired,
    txs,
    enabled: !txHistoryItem.isSettled && chainIdFound,
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
      if (isFetching && isPending) return "unconfirmed";
      if (statusData?.isSettled && statusData?.isSuccess) return "completed";
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
