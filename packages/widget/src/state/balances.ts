import { atomWithQuery } from "jotai-tanstack-query";
import { isInvertingSwapAtom } from "./swapPage";
import { atom } from "jotai";
import { BalanceRequest, BalanceResponse, balances } from "@skip-go/client";

export const skipAllBalancesRequestAtom = atom<BalanceRequest | undefined>(undefined);

export const skipAllBalancesAtom = atomWithQuery((get) => {
  const params = get(skipAllBalancesRequestAtom);
  const isInvertingSwap = get(isInvertingSwapAtom);

  const enabled = params && !isInvertingSwap;

  return {
    queryKey: ["skipBalances", params],
    queryFn: async () => {
      if (!params) {
        return { chains: {} };
      }
      if (Object.keys(params?.chains ?? {}).length === 0) {
        return { chains: {} };
      }
      return balances({ ...params, abortDuplicateRequests: true });
    },
    enabled,
    refetchInterval: 1000 * 60,
    retry: 1,
    gcTime: 0,
    placeholderData: (prevData: BalanceResponse | undefined) => prevData,
  };
});
