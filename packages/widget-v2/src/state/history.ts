import { RouteResponse, TxStatusResponse } from "@skip-go/client";
import { atomWithStorage } from "jotai/utils";
import { TransactionDetails } from "./swapExecutionPage";
import {
  getSimpleStatus,
  getTransferEventsFromTxStatusResponse,
  SimpleStatus,
} from "@/utils/clientType";
import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import { skipClient } from "./skipClient";

export type TransactionHistoryItem = {
  route: RouteResponse;
  transactionDetails: TransactionDetails[];
  timestamp: number;
  status: SimpleStatus;
};

export const transactionHistoryAtom = atomWithStorage<TransactionHistoryItem[]>(
  "transactionHistory",
  []
);

export const setTransactionHistoryAtom = atom(
  null,
  (get, set, index: number, historyItem: Partial<TransactionHistoryItem>) => {
    const history = get(transactionHistoryAtom);
    const oldHistoryItem = history?.[index] ?? {};
    const newHistory = history;
    console.log(oldHistoryItem, historyItem);

    newHistory[index] = { ...oldHistoryItem, ...historyItem };
    set(transactionHistoryAtom, newHistory);
  }
);

export const removeTransactionHistoryItemAtom = atom(
  null,
  (get, set, index: number) => {
    const history = get(transactionHistoryAtom);
    if (!history) return;
    if (index < 0) return;
    if (index >= history.length) return;

    const newHistory = history;
    newHistory.splice(index, 1);

    set(transactionHistoryAtom, newHistory);
  }
);

export const skipFetchPendingTransactionHistoryStatus = atomWithQuery((get) => {
  const skip = get(skipClient);
  const transactionHistory = get(transactionHistoryAtom);

  const pendingTransactionHistoryItemsFound = transactionHistory.find(
    (transactionHistoryItem) =>
      transactionHistoryItem.status !== "completed" &&
      transactionHistoryItem.status !== "failed"
  );

  return {
    queryKey: ["skipPendingTxHistoryStatus", transactionHistory],
    queryFn: async () => {
      const nestedTransactionHistoryPromises = transactionHistory.map(
        async (transactionHistoryItem) => {
          const transactionDetailsPromises = await Promise.all(
            transactionHistoryItem.transactionDetails.map(
              async (transactionDetail) => {
                if (
                  transactionHistoryItem.status !== "completed" &&
                  transactionHistoryItem.status !== "failed"
                ) {
                  return await skip.transactionStatus({
                    chainID: transactionDetail.chainID,
                    txHash: transactionDetail.txHash,
                  });
                }
                return new Promise((resolve) => resolve(null));
              }
            ) as Promise<TxStatusResponse | null>[]
          );
          return transactionDetailsPromises;
        }
      );
      return nestedTransactionHistoryPromises;
    },
    enabled: !!pendingTransactionHistoryItemsFound,
    refetchInterval: 1000 * 2,
    keepPreviousData: true,
  };
});
