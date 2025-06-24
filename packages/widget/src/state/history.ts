import { TransactionDetails } from "./swapExecutionPage";
import { ClientTransferEvent, SimpleStatus } from "@/utils/clientType";
import { atom } from "jotai";
import { LOCAL_STORAGE_KEYS } from "./localStorageKeys";
import { atomWithStorage } from "jotai/utils";
import { RouteResponse, TransferAssetRelease } from "@skip-go/client";

export enum HISTORY_VERSION {
  "camelCase",
}

export type TransactionHistoryItem = {
  route?: RouteResponse; // deprecated
  status: SimpleStatus;
  txsRequired?: number;
  transactionDetails: TransactionDetails[];
  timestamp: number;
  signatures: number;
  transferEvents: ClientTransferEvent[];
  transferAssetRelease?: TransferAssetRelease;
};

export const transactionHistoryVersionAtom = atomWithStorage<number | undefined>(
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
