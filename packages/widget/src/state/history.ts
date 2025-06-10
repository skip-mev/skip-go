import { TxStatusResponse } from "@skip-go/client";
import { atomWithStorage } from "jotai/utils";
import { TransactionDetails } from "./swapExecutionPage";
import { SimpleStatus } from "@/utils/clientType";
import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import { TxsStatus } from "@/pages/SwapExecutionPage/useBroadcastedTxs";
import { RouteResponse, transactionStatus } from "@skip-go/client";
import { LOCAL_STORAGE_KEYS } from "./localStorageKeys";

export type TransactionHistoryItem = {
  route: RouteResponse;
  transactionDetails: TransactionDetails[];
  timestamp: number;
  status: SimpleStatus;
  signatures: number;
} & Partial<TxsStatus>;

export const transactionHistoryAtom = atomWithStorage<TransactionHistoryItem[]>(
  LOCAL_STORAGE_KEYS.transactionHistory,
  [],
  undefined,
);

export const setTransactionHistoryAtom = atom(
  null,
  (get, set, historyItem: TransactionHistoryItem) => {
    const history = get(transactionHistoryAtom);

    const index = history.findIndex((item) => item.timestamp === historyItem.timestamp);

    const newHistory = [...history];

    if (index !== -1) {
      const oldItem = newHistory[index];
      newHistory[index] = { ...oldItem, ...historyItem };
    } else {
      newHistory.push(historyItem);
    }

    set(transactionHistoryAtom, newHistory);
  },
);

export const lastTransactionInTimeAtom = atom((get) => {
  const history = get(transactionHistoryAtom);
  if (history.length === 0) return undefined;

  const sorted = [...history].sort((a, b) => b.timestamp - a.timestamp);
  const lastTx = sorted[0];

  const originalIndex = history.findIndex((tx) => tx.timestamp === lastTx.timestamp);

  return {
    transactionHistoryItem: lastTx,
    index: originalIndex,
  };
});

export const removeTransactionHistoryItemAtom = atom(null, (get, set, timestamp: number) => {
  const history = get(transactionHistoryAtom);
  if (!history || !Number.isFinite(timestamp)) return;

  const newHistory = history.filter((item) => item.timestamp !== timestamp);

  set(transactionHistoryAtom, newHistory);
});

export const skipFetchPendingTransactionHistoryStatus = atomWithQuery((get) => {
  const transactionHistory = get(transactionHistoryAtom);

  const pendingTransactionHistoryItemsFound = transactionHistory.find(
    (transactionHistoryItem) =>
      transactionHistoryItem.status !== "completed" && transactionHistoryItem.status !== "failed",
  );

  return {
    queryKey: ["skipPendingTxHistoryStatus", transactionHistory],
    queryFn: async () => {
      const nestedTransactionHistoryPromises = transactionHistory.map(
        async (transactionHistoryItem) => {
          const transactionDetailsPromises = await Promise.all(
            transactionHistoryItem.transactionDetails?.map(async (transactionDetail) => {
              if (
                transactionHistoryItem.status !== "completed" &&
                transactionHistoryItem.status !== "failed"
              ) {
                return await transactionStatus(transactionDetail);
              }
              return new Promise((resolve) => resolve(null));
            }) as Promise<TxStatusResponse | null>[],
          );
          return transactionDetailsPromises;
        },
      );
      return nestedTransactionHistoryPromises;
    },
    enabled: !!pendingTransactionHistoryItemsFound,
    refetchInterval: 1000 * 2,
    keepPreviousData: true,
  };
});
