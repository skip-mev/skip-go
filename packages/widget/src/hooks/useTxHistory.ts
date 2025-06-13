import { TxsStatus, useBroadcastedTxsStatus } from "@/pages/SwapExecutionPage/useBroadcastedTxs";
import { useSyncTxStatus } from "@/pages/SwapExecutionPage/useSyncTxStatus";
import { TransactionHistoryItem } from "@/state/history";
import { skipChainsAtom } from "@/state/skipClient";
import { SimpleStatus } from "@/utils/clientType";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";

type useTxHistoryProps = {
  txHistoryItem?: TransactionHistoryItem;
};

export const useTxHistory = ({ txHistoryItem }: useTxHistoryProps) => {
  const { data: chains } = useAtomValue(skipChainsAtom);

  const transactionDetails = txHistoryItem?.transactionDetails;

  const chainIdFound = chains?.some((chain) =>
    transactionDetails?.map((tx) => tx.chainId).includes(chain.chainId ?? ""),
  );

  const txsRequired = txHistoryItem?.route?.txsRequired;

  let statusData: TxsStatus = {
    isSuccess: false,
    isSettled: false,
    transferEvents: [],
    ...txHistoryItem,
    transactionDetails: transactionDetails ?? [],
  };

  const shouldFetchStatus =
    !txHistoryItem?.isSettled && transactionDetails !== undefined && chainIdFound;

  const { data, isFetching, isPending } = useBroadcastedTxsStatus({
    txsRequired,
    transactionDetails,
    enabled: shouldFetchStatus,
  });

  if (data !== undefined) {
    statusData = data;
  }

  useSyncTxStatus({
    statusData,
    timestamp: txHistoryItem?.timestamp,
  });

  const explorerLinks = new Set();
  statusData?.transferEvents?.forEach((transferEvent) => {
    explorerLinks.add(transferEvent.fromExplorerLink);
    explorerLinks.add(transferEvent.toExplorerLink);
  });

  const query = useQuery({
    queryKey: ["tx-history-status", { transactionDetails, txsRequired, statusData }],
    queryFn: () => {
      // Incomplete is when multiple transactions are required but not all txs are signed/tracked
      if (transactionDetails?.length !== txsRequired) return "incomplete";
      if (isFetching && isPending) return "unconfirmed";
      if (statusData?.isSettled && statusData?.isSuccess) return "completed";
      if ((statusData?.isSettled && !statusData?.isSuccess) || !chainIdFound) return "failed";
      return "pending";
    },
    enabled:
      transactionDetails !== undefined && txsRequired !== undefined && statusData !== undefined,
  });

  return {
    status: query.data as SimpleStatus,
    explorerLinks: Array.from(explorerLinks).filter((link) => link) as string[],
    transferAssetRelease: statusData?.transferAssetRelease ?? txHistoryItem?.transferAssetRelease,
  };
};
