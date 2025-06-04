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
  (get, set, index: number, historyItem: TransactionHistoryItem) => {
    const history = get(transactionHistoryAtom);

    const newHistory = [...history];

    const oldHistoryItem = newHistory[index] ?? {};

    newHistory[index] = { ...oldHistoryItem, ...historyItem };

    set(transactionHistoryAtom, newHistory);
  },
);

export const removeTransactionHistoryItemAtom = atom(null, (get, set, index: number) => {
  const history = get(transactionHistoryAtom);
  if (!history) return;
  if (index < 0) return;
  if (index >= history.length) return;

  // Create a new array without mutating the original
  const newHistory = history.filter((_, i) => i !== index);

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
