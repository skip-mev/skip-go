import { RouteResponse } from "@skip-go/client";
import { atomFamily, atomWithStorage } from "jotai/utils";
import { skipSubmitSwapExecutionAtom, TransactionDetails } from "./swapExecutionPage";
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

export const removeTransactionHistoryItemAtom = atom(null, (get, set, index: number) => {
  const history = get(transactionHistoryAtom);
  if (!history) return;
  if (index < 0) return;
  if (index >= history.length) return;

  // Create a new array without mutating the original
  const newHistory = history.filter((_, i) => i !== index);

  set(transactionHistoryAtom, newHistory);
  transactionHistoryItemAtom.remove(index);
});

export const isFetchingLastTransactionStatusAtom = atom((get) => {
  const lastTxHistoryItem = get(transactionHistoryAtom).at(-1);

  const { isPending: executeRouteIsPending } = get(skipSubmitSwapExecutionAtom);

  const isFetchingLastTxStatus =
    (!lastTxHistoryItem?.isSettled && lastTxHistoryItem?.transactionDetails !== undefined) ||
    executeRouteIsPending;

  return isFetchingLastTxStatus;
});
