import { TransactionDetails } from "./swapExecutionPage";
import { SimpleStatus } from "@/utils/clientType";
import { atom } from "jotai";
import { TxsStatus } from "@/pages/SwapExecutionPage/useBroadcastedTxs";
import { RouteResponse } from "@skip-go/client";
import { LOCAL_STORAGE_KEYS } from "./localStorageKeys";
import { atomWithStorage } from "jotai/utils";

export type TransactionHistoryItem = {
  route: RouteResponse;
  transactionDetails: TransactionDetails[];
  timestamp: number;
  status: SimpleStatus;
  signatures: number;
} & Partial<TxsStatus>;

export const transactionHistoryVersionAtom = atomWithStorage<string | undefined>(
  LOCAL_STORAGE_KEYS.transactionHistoryVersion,
  undefined,
);

export const transactionHistoryAtom = atomWithStorage<TransactionHistoryItem[]>(
  LOCAL_STORAGE_KEYS.transactionHistory,
  [],
);

export const setTransactionHistoryAtom = atom(
  null,
  (
    get,
    set,
    historyItem: Partial<TransactionHistoryItem> & Pick<TransactionHistoryItem, "timestamp">,
  ) => {
    const history = get(transactionHistoryAtom);

    const index = history.findIndex((item) => item.timestamp === historyItem.timestamp);

    const newHistory = [...history];

    if (index !== -1) {
      const oldItem = newHistory[index];
      newHistory[index] = { ...oldItem, ...historyItem };
    } else {
      newHistory.push(historyItem as TransactionHistoryItem);
    }

    set(transactionHistoryAtom, newHistory);
  },
);

export const lastTransactionInTimeAtom = atom((get) => {
  const history = get(transactionHistoryAtom);
  if (history.length === 0) return;

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
  if (!history || isNaN(timestamp)) return;

  const newHistory = history.filter((item) => item.timestamp !== timestamp);

  set(transactionHistoryAtom, newHistory);
});
