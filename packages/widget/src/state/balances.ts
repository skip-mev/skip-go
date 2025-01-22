import { BalanceRequest, BalanceResponse } from "@skip-go/client";
import { atomWithQuery } from "jotai-tanstack-query";
import { skipClient } from "./skipClient";
import { isInvertingSwapAtom } from "./swapPage";
import { atom } from "jotai";

export const skipAllBalancesRequestAtom = atom<BalanceRequest | undefined>(undefined);

export const skipAllBalancesAtom = atomWithQuery((get) => {
  const skip = get(skipClient);
  const params = get(skipAllBalancesRequestAtom);
  const isInvertingSwap = get(isInvertingSwapAtom);

  const enabled = params && Object.keys(params).length > 0 && !isInvertingSwap;

  return {
    queryKey: ["skipBalances", params],
    queryFn: async () => {
      if (!params) {
        return {
          chains: {},
        };
      }
      return skip.balances(params);
    },
    enabled,
    refetchInterval: 1000 * 60,
    retry: 1,
    gcTime: 0,
    placeholderData: (prevData: BalanceResponse | undefined) => prevData,
  };
});
