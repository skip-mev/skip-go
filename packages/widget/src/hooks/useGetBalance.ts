import { useCallback } from "react";
import { skipAllBalancesAtom } from "@/state/balances";
import { useAtomValue } from "jotai";

export const useGetBalance = () => {
  const { data: skipBalances } = useAtomValue(skipAllBalancesAtom);

  const getBalance = useCallback(
    (chainId?: string, denom?: string) => {
      if (!chainId || !denom) return;
      return skipBalances?.chains?.[chainId]?.denoms?.[denom];
    },
    [skipBalances],
  );

  return getBalance;
};
