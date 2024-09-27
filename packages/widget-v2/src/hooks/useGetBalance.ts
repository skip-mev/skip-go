
import { useCallback } from "react";
import { skipBalancesAtom } from "@/state/balances";
import { useAtomValue } from "jotai";

export const useGetBalance = () => {
  const { data: skipBalances, isLoading, refetch } = useAtomValue(skipBalancesAtom);

  const getBalance = useCallback((chainId: string, denom: string) => {
    return {
      data: skipBalances?.chains?.[chainId]?.denoms?.[denom],
      isLoading,
      refetch,
    };
  }, [isLoading, refetch, skipBalances?.chains]);

  return getBalance;
};
