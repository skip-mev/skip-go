import { RouteResponse } from "@skip-go/client";
import { atomWithStorage } from "jotai/utils";
import { TransactionDetails } from "./swapExecutionPage";
import { SimpleStatus } from "@/utils/clientType";
import { atom } from "jotai";

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
  (get, set, index: number, item: TransactionHistoryItem) => {
    const history = get(transactionHistoryAtom);
    history[index] = item;
    set(transactionHistoryAtom, history);
  }
);
