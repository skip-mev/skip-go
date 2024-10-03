import { setTransactionHistoryAtom } from "@/state/history";
import { setOverallStatusAtom, swapExecutionStateAtom, skipTransactionStatusAtom, skipSubmitSwapExecutionAtom } from "@/state/swapExecutionPage";
import { ClientTransferEvent, getTransferEventsFromTxStatusResponse, getOperationToTransferEventsMap, getClientOperations, ClientOperation } from "@/utils/clientType";
import { useSetAtom, useAtomValue, useAtom } from "jotai";
import { useState, useMemo, useEffect } from "react";

export const useFetchTransactionStatus = () => {
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
  const [operationToTransferEventsMap, setOperationToTransferEventsMap] =
    useState<Record<number, ClientTransferEvent>>({});

  const clientOperations = useMemo(() => {
    if (!route?.operations) return [] as ClientOperation[];
    return getClientOperations(route.operations);
  }, [route?.operations]);

  const computedSwapStatus = useMemo(() => {
    if (!route?.operations) return;
    const operationTransferEventsArray = Object.values(
      operationToTransferEventsMap
    );

    const lastOperationIndex = route?.operations?.length - 1;

    if (operationTransferEventsArray.length === 0) {
      if (isPending) {
        setOverallStatus("signing");
      }
      return;
    }

    if (
      operationToTransferEventsMap[lastOperationIndex]?.status === "completed"
    ) {
      return "completed";
    }

    if (
      operationTransferEventsArray.find(({ status }) => status === "failed")
    ) {
      return "failed";
    }
    if (
      operationTransferEventsArray.find(({ status }) => status === "pending")
    ) {
      return "pending";
    }
    if (
      operationTransferEventsArray.every(
        (state) => state.status === "broadcasted"
      )
    ) {
      return "broadcasted";
    }
  }, [isPending, operationToTransferEventsMap, route?.operations, setOverallStatus]);

  useEffect(() => {
    if (overallStatus === "completed" || overallStatus === "failed") return;

    const transferEvents =
      getTransferEventsFromTxStatusResponse(transactionStatus);
    console.log(transferEvents);
    const operationToTransferEventsMap = getOperationToTransferEventsMap(
      transactionStatus ?? [],
      clientOperations
    );
    console.log(operationToTransferEventsMap);
    const operationTransferEventsArray = Object.values(
      operationToTransferEventsMap
    );

    if (transactionDetailsArray.length === 1 && transferEvents.length === 0) {
      setOperationToTransferEventsMap({
        0: {
          status: "pending",
        } as ClientTransferEvent,
      });
    }
    if (operationTransferEventsArray.length > 0) {
      setOperationToTransferEventsMap(operationToTransferEventsMap);
    }

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

  return operationToTransferEventsMap;
};