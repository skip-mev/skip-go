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
    (get, set, newTxHistoryItem: TransactionHistoryItem) => {
      const current = get(transactionHistoryAtom);
      const previousTxHistoryItem = current[index];

      if (JSON.stringify(previousTxHistoryItem) === JSON.stringify(newTxHistoryItem)) return;

      const updated = [...current];
      updated[index] = { ...previousTxHistoryItem, ...newTxHistoryItem };
      set(transactionHistoryAtom, updated);
    },
  ),
);

export const transactionIsSettledAtom = atomFamily((index: number) =>
  atom((get) => {
    return get(transactionHistoryItemAtom(index))?.isSettled;
  }),
);

export const lastTransactionIsSettledAtom = atom((get) => {
  const history = get(transactionHistoryAtom);
  const lastIndex = history.length - 1;
  if (lastIndex < 0) return undefined;
  return get(transactionIsSettledAtom(lastIndex));
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
