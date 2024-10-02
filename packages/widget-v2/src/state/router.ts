import { atom } from "jotai";

export enum Routes {
  SwapPage,
  SwapExecutionPage,
  TransactionHistoryPage,
}

export const currentPageAtom = atom<Routes>(Routes.SwapPage);
