import { setTransactionHistoryAtom, skipFetchPendingTransactionHistoryStatus, transactionHistoryAtom } from "@/state/history";
import { getSimpleOverallStatus } from "@/utils/clientType";
import { TxStatusResponse } from "@skip-go/client";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";

export const useSyncPendingTransactionHistoryItems = () => {
  const [{ data: transactionStatusArray }] = useAtom(skipFetchPendingTransactionHistoryStatus);
  const transactionHistory = useAtomValue(transactionHistoryAtom);
  const setTransactionHistory = useSetAtom(setTransactionHistoryAtom);

  useEffect(() => {
    if (!transactionStatusArray || transactionStatusArray?.length === 0) return;
    transactionStatusArray.forEach(async (transactionStatusPromise, index) => {
      const transactionStatusByTransactionOrNull = await transactionStatusPromise;
      const route = transactionHistory?.[index]?.route;
      const transactionStatusFoundForEachOperation = transactionStatusByTransactionOrNull?.flatMap(operation => operation).length === route?.txsRequired;
      if (transactionStatusByTransactionOrNull.find(transactionStatus => transactionStatus === null)) return;
      const transactionStatusByTransaction = transactionStatusByTransactionOrNull as TxStatusResponse[];

      const getOverallStatus = () => {
        if (transactionStatusByTransaction.every(({ state }) => getSimpleOverallStatus(state) === "completed")) {
          if (transactionStatusFoundForEachOperation) {
            return "completed";
          }
          return "pending";
        }

        if (
          transactionStatusByTransaction.find(({ state }) => getSimpleOverallStatus(state) === "failed")
        ) {
          return "failed";
        }
        if (
          transactionStatusByTransaction.find(({ state }) => getSimpleOverallStatus(state) === "pending")
        ) {
          return "pending";
        }

      };

      setTransactionHistory(index, {
        status: getOverallStatus(),
        timestamp: Date.now(),
      });
    });
  }, [setTransactionHistory, transactionHistory, transactionStatusArray]);
};