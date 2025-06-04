import { setTransactionHistoryAtom, transactionHistoryAtom } from "@/state/history";
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
  const {
    route,
    transactionDetailsArray,
    overallStatus,
    transactionHistoryIndex: currentTransactionHistoryIndex,
  } = useAtomValue(swapExecutionStateAtom);
  const setTransactionHistory = useSetAtom(setTransactionHistoryAtom);

  const txHistory = useAtomValue(transactionHistoryAtom);

  const { isPending } = useAtomValue(skipSubmitSwapExecutionAtom);

  const clientOperations = useMemo(() => {
    if (!route?.operations) return [] as ClientOperation[];
    return getClientOperations(route.operations);
  }, [route?.operations]);

  const computedSwapStatus = useMemo(() => {
    if (statusData?.lastTxStatus === "pending" || isPending) {
      return "pending";
    }

    if (transferEvents?.length === 0 && !statusData?.isSettled) {
      if (isPending && overallStatus !== "pending") {
        return "signing";
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
    statusData?.isSettled,
    statusData?.isSuccess,
    statusData?.lastTxStatus,
    transferEvents,
    overallStatus,
  ]);

  useEffect(() => {
    if (computedSwapStatus) {
      const index = historyIndex ?? currentTransactionHistoryIndex;

      const newTxHistoryItem = {
        ...txHistory[index],
        ...statusData,
        status: computedSwapStatus as SimpleStatus,
      };
      const oldTxHistoryItem = txHistory[index];

      if (JSON.stringify(newTxHistoryItem) !== JSON.stringify(oldTxHistoryItem)) {
        setTransactionHistory(newTxHistoryItem);
        setOverallStatus(computedSwapStatus);
      }
    }
  }, [
    clientOperations,
    overallStatus,
    computedSwapStatus,
    setOverallStatus,
    transactionDetailsArray.length,
    txHistory,
    statusData,
    setTransactionHistory,
    historyIndex,
    currentTransactionHistoryIndex,
  ]);
};
