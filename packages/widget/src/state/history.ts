import { atom } from "jotai";
import { LOCAL_STORAGE_KEYS } from "./localStorageKeys";
import { atomWithStorage } from "jotai/utils";
import { RouteDetails } from "@skip-go/client";
import { setCurrentTransactionIdAtom, swapExecutionStateAtom } from "./swapExecutionPage";

export enum HISTORY_VERSION {
  "camelCase",
}

export const transactionHistoryVersionAtom = atomWithStorage<number | undefined>(
  LOCAL_STORAGE_KEYS.transactionHistoryVersion,
  undefined,
);

export const transactionHistoryAtom = atomWithStorage<RouteDetails[]>(
  LOCAL_STORAGE_KEYS.transactionHistory,
  [],
);

export const sortedHistoryItemsAtom = atom((get): RouteDetails[] => {
  const history = get(transactionHistoryAtom);
  return history
    .filter((historyItem) => historyItem.txsSigned > 0)
    .sort((a, b) => b.timestamp - a.timestamp);
});

export const setTransactionHistoryAtom = atom(
  null,
  (get, set, historyItem: Partial<RouteDetails>) => {
    const history = get(transactionHistoryAtom);

    const index = history.findIndex((item) => item.id === historyItem.id);

    const newHistory = [...history];

    if (index !== -1) {
      const oldItem = newHistory[index];
      newHistory[index] = { ...oldItem, ...historyItem };
    } else {
      if (historyItem.id) {
        set(setCurrentTransactionIdAtom, historyItem.id);
        newHistory.push(historyItem as RouteDetails);
      }
    }

    set(transactionHistoryAtom, newHistory);
  },
);

export const currentTransactionAtom = atom((get): RouteDetails | undefined => {
  const { currentTransactionId } = get(swapExecutionStateAtom);
  const history = get(transactionHistoryAtom);
  return history.find((historyItem) => historyItem.id === currentTransactionId);
});

export const lastTransactionInTimeAtom = atom((get) => {
  const history = get(transactionHistoryAtom);
  if (history.length === 0) return;

  const sorted = [...history].sort((a, b) => b.timestamp - a.timestamp);

  return sorted.at(0);
});

export const removeTransactionHistoryItemAtom = atom(null, (get, set, timestamp: number) => {
  const history = get(transactionHistoryAtom);
  if (!history || isNaN(timestamp)) return;

  const newHistory = history.filter((item) => item.timestamp !== timestamp);

  set(transactionHistoryAtom, newHistory);
});
