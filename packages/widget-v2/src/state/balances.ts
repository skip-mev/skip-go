import { BalanceRequest } from "@skip-go/client";
import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import { skipClient } from "./skipClient";
import { isInvertingSwapAtom } from "./swapPage";

export const skipAllBalancesRequestAtom = atom<BalanceRequest | undefined>();

export const skipAllBalancesAtom = atomWithQuery((get) => {
  const skip = get(skipClient);
  const params = get(skipAllBalancesRequestAtom);
  const isInvertingSwap = get(isInvertingSwapAtom);

  const enabled = Object.values(params ?? {}).length > 0 && !isInvertingSwap;

  return {
    queryKey: ["skipBalances", params],
    queryFn: async () => {
      if (!params) {
        throw new Error("No balance request provided");
      }

      return skip.balances(params);
    },
    enabled,
    refetchInterval: 1000 * 60,
    retry: 1,
  };
});

export const skipSourceBalanceRequestAtom = atom<BalanceRequest | undefined>();

export const skipSourceBalanceAtom = atomWithQuery((get) => {
  const skip = get(skipClient);
  const params = get(skipSourceBalanceRequestAtom);
  const isInvertingSwap = get(isInvertingSwapAtom);

  const enabled = Object.values(params ?? {}).length > 0 && !isInvertingSwap;

  return {
    queryKey: ["skipSourceBalance", params],
    queryFn: async () => {
      if (!params) {
        throw new Error("No balance request provided");
      }

      return skip.balances(params);
    },
    refetchInterval: 1000 * 30,
    enabled,
    retry: 1,
  };
});

export const skipBalancesAtom = atom((get) => {
  const { data: sourceBalance } = get(skipSourceBalanceAtom);
  const { data: balances } = get(skipAllBalancesAtom);

  const sourceBalanceChain = Object.keys(sourceBalance?.chains ?? {})?.[0];
  return {
    ...(balances?.chains ?? {}),
    ...(sourceBalance?.chains ?? {}),
    ...(sourceBalanceChain ? {
      [sourceBalanceChain]: {
        ...(balances?.chains?.[sourceBalanceChain] ?? {}),
        ...(sourceBalance?.chains?.[sourceBalanceChain]),
      }
    } : {}),
  };
});