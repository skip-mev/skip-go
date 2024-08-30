import { atom } from "jotai";

export enum Routes {
  SwapPage,
  SwapExecutionPage,
}

export const currentPageAtom = atom<Routes>(Routes.SwapPage);
