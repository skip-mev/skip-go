import { skipBalancesAtom } from "@/state/balances";
import { useSourceAccount } from "@/hooks/useSourceAccount";
import { sourceAssetAtom } from "@/state/swapPage";
import { useAtom, useAtomValue } from "jotai";
import { useMemo } from "react";
import { BalanceResponseDenomEntry, BalanceResponse } from "@skip-go/client";
import { RefetchOptions, QueryObserverResult } from "@tanstack/query-core";

export const useSourceBalance = (): {
  data: BalanceResponseDenomEntry | undefined;
  isLoading: boolean;
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<BalanceResponse, Error>>
} => {
  const [sourceAsset] = useAtom(sourceAssetAtom);
  const sourceAccount = useSourceAccount();
  const { data: skipBalances, isLoading, refetch } = useAtomValue(skipBalancesAtom);

  const data = useMemo(() => {
    if (!sourceAsset || !sourceAccount || !skipBalances) return;
    const { chainID, denom } = sourceAsset;
    if (!denom || !chainID) return;

    return skipBalances?.chains?.[chainID]?.denoms?.[denom];
  }, [sourceAsset, sourceAccount, skipBalances]);

  return {
    data,
    isLoading,
    refetch
  };
};
