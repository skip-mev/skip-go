import { BalanceRequest, BalanceResponse } from "@skip-go/client";
import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import { skipClient } from "./skipClient";

export const skipBalancesRequestAtom = atom<BalanceRequest | undefined>();

export const skipBalancesResponse = atom<BalanceResponse | undefined>();

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

export const skipSourceBalanceRequestAtom = atom<BalanceRequest | undefined>();

export const skipSourceBalanceAtom = atomWithQuery((get) => {
  const skip = get(skipClient);
  const params = get(skipSourceBalanceRequestAtom);

  return {
    queryKey: ["skipSourceBalance", params],
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