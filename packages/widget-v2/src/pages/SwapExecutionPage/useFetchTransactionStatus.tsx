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
import { useState, useMemo, useEffect, useCallback } from "react";

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

  const operationTransferEventsArray = useMemo(() => {
    return Object.values(
      getOperationToTransferEventsMap(transactionStatus ?? [], clientOperations)
    );
  }, [clientOperations, transactionStatus]);

  const simpleOverallStatus = useMemo(() => {
    const overallState = transactionStatus?.[0]?.state;

    if (operationTransferEventsArray.length === 0 && isPending) {
      return "signing";
    }
    if (!overallState) return "unconfirmed";

    return getSimpleOverallStatus(overallState);
  }, [isPending, operationTransferEventsArray.length, transactionStatus]);

  const updateOperationToTransferEventsMap = useCallback(() => {
    const transferEvents =
      getTransferEventsFromTxStatusResponse(transactionStatus);

    if (transactionDetailsArray.length === 1 && transferEvents.length === 0) {
      // temporarily setting operationToTransferEventsMap to have the first
      // operation pending before the API returns any transfer events
      // so that the UX is nicer
      setOperationToTransferEventsMap({
        0: {
          status: "pending",
        } as ClientTransferEvent,
      });
    } else if (operationTransferEventsArray.length > 0) {
      // setting operationToTransferEventsMap if operationToTransferEventsMap
      // is retrieved properly from getOperationToTransferEventsMap
      setOperationToTransferEventsMap(operationToTransferEventsMap);
    } else if (simpleOverallStatus) {
      // manually creating and setting operationToTransferEventsMap for
      // the case that we have an overallStatus completed or failed
      // but no transfer events (ie. swaps that remain on chain)
      if (["completed", "failed"].includes(simpleOverallStatus)) {
        const derivedOperationToTransferEventsMap = clientOperations.reduce(
          (accumulator, _operation, index) => {
            accumulator[index] = {
              status: simpleOverallStatus,
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
    operationToTransferEventsMap,
    operationTransferEventsArray.length,
    simpleOverallStatus,
    transactionDetailsArray.length,
    transactionStatus,
  ]);

  useEffect(() => {
    if (["completed", "failed"].includes(overallStatus)) return;

    updateOperationToTransferEventsMap();

    if (simpleOverallStatus !== overallStatus) {
      setTransactionHistory(transactionHistoryIndex, {
        status: simpleOverallStatus,
      });
      setOverallStatus(simpleOverallStatus);
    }
  }, [
    clientOperations,
    overallStatus,
    setOverallStatus,
    transactionDetailsArray.length,
    transactionStatus,
    setTransactionHistory,
    transactionHistoryIndex,
    isPending,
    operationTransferEventsArray.length,
    updateOperationToTransferEventsMap,
    simpleOverallStatus,
  ]);

  return operationToTransferEventsMap;
};
