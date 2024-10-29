import { setTransactionHistoryAtom } from "@/state/history";
import {
  setOverallStatusAtom,
  swapExecutionStateAtom,
  skipSubmitSwapExecutionAtom,
} from "@/state/swapExecutionPage";
import {
  getClientOperations,
  ClientOperation,
} from "@/utils/clientType";
import { useSetAtom, useAtomValue } from "jotai";
import { useMemo, useEffect } from "react";
import { TxsStatus } from "./useBroadcastedTxs";

export const useSyncTxStatus = ({
  statusData,
  historyIndex
}: {
  statusData?: TxsStatus,
  historyIndex?: number;
}) => {
  const transferEvents = statusData?.transferEvents;
  const setOverallStatus = useSetAtom(setOverallStatusAtom);
  const {
    route,
    transactionDetailsArray,
    overallStatus,
    transactionHistoryIndex,
  } = useAtomValue(swapExecutionStateAtom);
  const setTransactionHistory = useSetAtom(setTransactionHistoryAtom);

  const { isPending } = useAtomValue(skipSubmitSwapExecutionAtom);

  const clientOperations = useMemo(() => {
    if (!route?.operations) return [] as ClientOperation[];
    return getClientOperations(route.operations);
  }, [route?.operations]);

  const computedSwapStatus = useMemo(() => {
    if (!route?.operations || !route?.txsRequired) return;

    if (transferEvents?.length === 0 && !statusData?.isSettled) {
      if (isPending) {
        setOverallStatus("signing");
      }
      return;
    }
    if (statusData?.lastTxStatus === "pending") {
      return "pending";
    }

    if (!transferEvents) return;

    if (statusData.isSuccess) {
      return "completed";
    }

    if (
      !statusData.isSuccess && statusData.isSettled
    ) {
      return "failed";
    }
    if (
      transferEvents?.find(({ status }) => status === "pending")
    ) {
      return "pending";
    }
    if (
      transferEvents?.every(
        ({ status }) => status === "unconfirmed"
      )
    ) {
      return "unconfirmed";
    }
  }, [isPending, route?.operations, route?.txsRequired, setOverallStatus, statusData?.isSettled, statusData?.isSuccess, statusData?.lastTxStatus, transferEvents]);
  useEffect(() => {
    if (computedSwapStatus) {
      setTransactionHistory(historyIndex ?? transactionHistoryIndex, {
        status: computedSwapStatus,
      });
      if (!historyIndex) {
        setOverallStatus(computedSwapStatus);
      }
    }
  }, [clientOperations, overallStatus, computedSwapStatus, setOverallStatus, transactionDetailsArray.length, setTransactionHistory, transactionHistoryIndex, historyIndex]);

};
