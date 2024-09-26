import { BalanceRequest } from "@skip-go/client";
import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import { skipClient } from "./skipClient";

export const skipBalancesRequestAtom = atom<BalanceRequest | undefined>();

export const skipBalancesAtom = atomWithQuery((get) => {
  const skip = get(skipClient);
  const params = get(skipBalancesRequestAtom);

  return {
    queryKey: ["skipBalances", params],
    queryFn: async () => {
      if (!params) {
        throw new Error("No balance request provided");
      }

      return skip.balances(params);
    },
    refetchInterval: 1000 * 60,
    retry: 1,
  };
});