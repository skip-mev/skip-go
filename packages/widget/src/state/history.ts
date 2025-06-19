import { TransactionDetails } from "./swapExecutionPage";
import { ClientTransferEvent, SimpleStatus } from "@/utils/clientType";
import { atom } from "jotai";
import { LOCAL_STORAGE_KEYS } from "./localStorageKeys";
import { atomWithIndexedDBStorage } from "@/utils/storage";
import { RouteResponse, TransferAssetRelease } from "@skip-go/client";

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

export const transactionHistoryAtom = atomWithIndexedDBStorage<TransactionHistoryItem[]>(
  LOCAL_STORAGE_KEYS.transactionHistory,
  [],
);

export const setTransactionHistoryAtom = atom(
  null,
  async (
    get,
    set,
    historyItem: Partial<TransactionHistoryItem> & Pick<TransactionHistoryItem, "timestamp">,
  ) => {
    const history = await get(transactionHistoryAtom);

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

export const lastTransactionInTimeAtom = atom(async (get) => {
  const history = await get(transactionHistoryAtom);
  if (history.length === 0) return;

  const sorted = [...history].sort((a, b) => b.timestamp - a.timestamp);
  const lastTx = sorted[0];

  const originalIndex = history.findIndex((tx) => tx.timestamp === lastTx.timestamp);

  return {
    transactionHistoryItem: lastTx,
    index: originalIndex,
  };
});

export const removeTransactionHistoryItemAtom = atom(null, async (get, set, timestamp: number) => {
  const history = await get(transactionHistoryAtom);
  if (!history || isNaN(timestamp)) return;

  const newHistory = history.filter((item) => item.timestamp !== timestamp);

  set(transactionHistoryAtom, newHistory);
});
