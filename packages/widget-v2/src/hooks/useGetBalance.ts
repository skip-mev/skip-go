
import { useCallback } from "react";
import { skipBalancesAtom } from "@/state/balances";
import { useAtomValue } from "jotai";
import { BalanceResponseDenomEntry, BalanceResponse } from "@skip-go/client";
import { RefetchOptions, QueryObserverResult } from "@tanstack/query-core";

export const useGetBalance = (): (chainId: string, denom: string) => {
  data: BalanceResponseDenomEntry | undefined;
  isLoading: boolean;
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<BalanceResponse, Error>>

} => {
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
