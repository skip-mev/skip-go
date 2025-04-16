import { RouteResponse } from "@skip-go/client";
import { atomFamily, atomWithStorage } from "jotai/utils";
import { TransactionDetails } from "./swapExecutionPage";
import { SimpleStatus } from "@/utils/clientType";
import { atom } from "jotai";
import { TxsStatus } from "@/pages/SwapExecutionPage/useBroadcastedTxs";

export type TransactionHistoryItem = {
  route?: RouteResponse;
  transactionDetails?: TransactionDetails[];
  timestamp: number;
  status: SimpleStatus;
} & TxsStatus;

export const transactionHistoryAtom = atomWithStorage<TransactionHistoryItem[]>(
  "transactionHistory",
  [],
  undefined,
);

export const transactionHistoryItemAtom = atomFamily((index: number) =>
  atom(
    (get) => get(transactionHistoryAtom)[index],
    (get, set, historyItem: TransactionHistoryItem) => {
      const currentHistory = get(transactionHistoryAtom);
      const newHistory = [...currentHistory];
      const oldHistoryItem = newHistory[index] ?? {};

      newHistory[index] = { ...oldHistoryItem, ...historyItem };
      set(transactionHistoryAtom, newHistory);
    },
  ),
);

export const lastTransactionAtom = atom((get) => {
  const history = get(transactionHistoryAtom);
  const lastIndex = history.length - 1;
  if (lastIndex < 0) return undefined;

  return {
    transactionHistoryItem: get(transactionHistoryItemAtom(lastIndex)),
    index: lastIndex,
  };
});

export const lastTransactionIsSettledAtom = atom((get) => {
  const txHistory = get(transactionHistoryAtom);
  return txHistory?.[txHistory.length - 1]?.isSettled;
});

export const removeTransactionHistoryItemAtom = atom(null, (get, set, index: number) => {
  const history = get(transactionHistoryAtom);
  if (!history) return;
  if (index < 0) return;
  if (index >= history.length) return;

  // Create a new array without mutating the original
  const newHistory = history.filter((_, i) => i !== index);

  set(transactionHistoryAtom, newHistory);
});
