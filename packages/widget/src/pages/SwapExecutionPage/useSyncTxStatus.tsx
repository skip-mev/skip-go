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
  timestamp,
}: {
  statusData?: TxsStatus;
  timestamp?: number;
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

  const transactionHistoryItems = useAtomValue(transactionHistoryAtom);

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
    statusData?.lastTxStatus,
    statusData?.isSettled,
    statusData?.isSuccess,
    transferEvents,
    isPending,
    setOverallStatus,
  ]);

  useEffect(() => {
    if (computedSwapStatus && timestamp !== undefined) {
      const index = transactionHistoryItems.findIndex(
        (txHistoryItem) => txHistoryItem.timestamp === timestamp,
      );

      const newTxHistoryItem = {
        ...transactionHistoryItems[index],
        ...statusData,
        status: computedSwapStatus as SimpleStatus,
      };
      const oldTxHistoryItem = transactionHistoryItems[index];

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
    transactionHistoryItems,
    statusData,
    setTransactionHistory,
    currentTransactionHistoryIndex,
    timestamp,
  ]);
};
