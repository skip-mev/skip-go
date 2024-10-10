import { setTransactionHistoryAtom } from "@/state/history";
import {
  setOverallStatusAtom,
  swapExecutionStateAtom,
  skipTransactionStatusAtom,
  skipSubmitSwapExecutionAtom,
} from "@/state/swapExecutionPage";
import {
  ClientTransferEvent,
  getClientOperations,
  ClientOperation,
  getSimpleOverallStatus,
} from "@/utils/clientType";
import { useSetAtom, useAtomValue, useAtom } from "jotai";
import { useMemo, useEffect } from "react";

export const useFetchTransactionStatus = ({
  transferEvents
}: {
  transferEvents?: ClientTransferEvent[];
}) => {
  const setOverallStatus = useSetAtom(setOverallStatusAtom);
  const {
    route,
    transactionDetailsArray,
    overallStatus,
    transactionHistoryIndex,
  } = useAtomValue(swapExecutionStateAtom);
  const [{ data: transactionStatus }] = useAtom(skipTransactionStatusAtom);
  const setTransactionHistory = useSetAtom(setTransactionHistoryAtom);

  const { isPending } = useAtomValue(skipSubmitSwapExecutionAtom);

  const clientOperations = useMemo(() => {
    if (!route?.operations) return [] as ClientOperation[];
    return getClientOperations(route.operations);
  }, [route?.operations]);

  const computedSwapStatus = useMemo(() => {
    if (!route?.operations || !route?.txsRequired) return;

    if (transferEvents?.length === 0) {
      if (isPending) {
        setOverallStatus("signing");
      }
      return;
    }

    if (!transactionStatus) return;
    const lastTransactionIndex = route?.txsRequired - 1;

    const lastTransactionStatus = getSimpleOverallStatus(
      transactionStatus?.[lastTransactionIndex]?.state
    );

    if (lastTransactionStatus === "completed") {
      return "completed";
    }

    if (
      transferEvents?.find(({ status }) => status === "failed")
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
  }, [isPending, route?.operations, route?.txsRequired, setOverallStatus, transactionStatus, transferEvents]);

  useEffect(() => {
    if (overallStatus === "completed" || overallStatus === "failed") return;

    if (computedSwapStatus) {
      setTransactionHistory(transactionHistoryIndex, {
        status: computedSwapStatus,
      });
      setOverallStatus(computedSwapStatus);
    }
  }, [
    clientOperations,
    overallStatus,
    computedSwapStatus,
    setOverallStatus,
    transactionDetailsArray.length,
    transactionStatus,
    setTransactionHistory,
    transactionHistoryIndex,
  ]);

};
