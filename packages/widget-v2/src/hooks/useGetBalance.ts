
import { useCallback } from "react";
import { skipBalancesAtom } from "@/state/balances";
import { useAtomValue } from "jotai";

export const useGetBalance = () => {
  const skipBalances = useAtomValue(skipBalancesAtom);

  const getBalance = useCallback((chainId: string, denom: string) => {
    return skipBalances?.[chainId]?.denoms?.[denom];
  }, [skipBalances]);

  return getBalance;
};
