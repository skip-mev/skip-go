import { transactionHistoryAtom, transactionHistoryItemAtom } from "@/state/history";
import {
  setOverallStatusAtom,
  swapExecutionStateAtom,
  skipSubmitSwapExecutionAtom,
} from "@/state/swapExecutionPage";
import { getClientOperations, ClientOperation, SimpleStatus } from "@/utils/clientType";
import { useSetAtom, useAtomValue } from "jotai";
import { useMemo, useEffect } from "react";
import { TxsStatus } from "./useBroadcastedTxs";

export const useSyncTxStatus = ({
  statusData,
  historyIndex,
}: {
  statusData?: TxsStatus;
  historyIndex?: number;
}) => {
  const transferEvents = statusData?.transferEvents;
  const setOverallStatus = useSetAtom(setOverallStatusAtom);
  const { route, transactionDetailsArray, overallStatus, transactionHistoryIndex } =
    useAtomValue(swapExecutionStateAtom);
  const setTransactionHistoryItem = useSetAtom(
    transactionHistoryItemAtom(historyIndex ?? transactionHistoryIndex),
  );
  const txHistory = useAtomValue(transactionHistoryAtom);

  const { isPending } = useAtomValue(skipSubmitSwapExecutionAtom);

  const clientOperations = useMemo(() => {
    if (!route?.operations) return [] as ClientOperation[];
    return getClientOperations(route.operations);
  }, [route?.operations]);

  const computedSwapStatus = useMemo(() => {
    if (statusData?.lastTxStatus === "pending") {
      if (isPending) {
        setOverallStatus("pending");
      }
      return "pending";
    }

    if (transferEvents?.length === 0 && !statusData?.isSettled) {
      if (isPending && overallStatus !== "pending") {
        setOverallStatus("signing");
      }
      return;
    }

    if (!transferEvents) return;

    if (statusData.isSuccess) {
      return "completed";
    }

    if (!statusData.isSuccess && statusData.isSettled) {
      return "failed";
    }
    if (transferEvents?.find(({ status }) => status === "pending")) {
      return "pending";
    }
    if (transferEvents?.every(({ status }) => status === "unconfirmed")) {
      return "unconfirmed";
    }
  }, [
    isPending,
    setOverallStatus,
    statusData?.isSettled,
    statusData?.isSuccess,
    statusData?.lastTxStatus,
    transferEvents,
    overallStatus,
  ]);

  useEffect(() => {
    const index = historyIndex ?? transactionHistoryIndex;

    if (!computedSwapStatus) return;

    const newTxHistoryItem = {
      ...txHistory[index],
      ...statusData,
      status: computedSwapStatus as SimpleStatus,
    };

    const txHistoryItemChanged =
      JSON.stringify(txHistory[index]) !== JSON.stringify(newTxHistoryItem);

    if (computedSwapStatus && !txHistory[index].isSettled && txHistoryItemChanged) {
      setTransactionHistoryItem(newTxHistoryItem);
      if (!historyIndex) {
        setOverallStatus(computedSwapStatus);
      }
    }
  }, [
    clientOperations,
    overallStatus,
    computedSwapStatus,
    setOverallStatus,
    transactionDetailsArray.length,
    transactionHistoryIndex,
    historyIndex,
    txHistory,
    statusData,
    setTransactionHistoryItem,
  ]);
};
