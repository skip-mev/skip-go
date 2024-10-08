import { setTransactionHistoryAtom } from "@/state/history";
import {
  setOverallStatusAtom,
  swapExecutionStateAtom,
  skipTransactionStatusAtom,
  skipSubmitSwapExecutionAtom,
} from "@/state/swapExecutionPage";
import {
  ClientTransferEvent,
  getTransferEventsFromTxStatusResponse,
  getOperationToTransferEventsMap,
  getClientOperations,
  ClientOperation,
  getSimpleOverallStatus,
} from "@/utils/clientType";
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
    if (!route?.operations || !route?.txsRequired) return;
    const operationTransferEventsArray = Object.values(
      operationToTransferEventsMap
    );

    if (operationTransferEventsArray.length === 0) {
      if (isPending) {
        setOverallStatus("signing");
      }
      return;
    }

    if (!transactionStatus) return;
    const lastTransactionIndex = route?.txsRequired - 1;

    const lastTransactionStatus = getSimpleOverallStatus(
      transactionStatus[lastTransactionIndex].state
    );

    if (lastTransactionStatus === "completed") {
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
        ({ status }) => status === "unconfirmed"
      )
    ) {
      return "unconfirmed";
    }
  }, [
    isPending,
    operationToTransferEventsMap,
    route?.operations,
    route?.txsRequired,
    setOverallStatus,
    transactionStatus,
  ]);

  useEffect(() => {
    if (overallStatus === "completed" || overallStatus === "failed") return;

    const transferEvents =
      getTransferEventsFromTxStatusResponse(transactionStatus);
    const operationToTransferEventsMap = getOperationToTransferEventsMap(
      transactionStatus ?? [],
      clientOperations
    );
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
      if (
        ["completed", "failed"].includes(computedSwapStatus) &&
        operationTransferEventsArray.length === 0
      ) {
        // manually creating and setting operationToTransferEventsMap for
        // the case that we have an overallStatus completed or failed
        // but no transfer events (ie. swaps that remain on chain)
        const derivedOperationToTransferEventsMap = clientOperations.reduce(
          (accumulator, _operation, index) => {
            accumulator[index] = {
              status: computedSwapStatus,
            } as ClientTransferEvent;

            return accumulator;
          },
          {} as Record<number, ClientTransferEvent>
        );
        setOperationToTransferEventsMap(derivedOperationToTransferEventsMap);
      }
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