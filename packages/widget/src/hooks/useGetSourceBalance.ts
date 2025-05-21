import { skipAllBalancesAtom } from "@/state/balances";
import { sourceAssetAtom } from "@/state/swapPage";
import { useAtom, useAtomValue } from "jotai";
import { useMemo } from "react";
import { useGetAccount } from "./useGetAccount";
import { useCW20Balance } from "./useCW20Balance";
import { ClientAsset } from "@/state/skipClient";

export const useGetSourceBalance = () => {
  const [sourceAsset] = useAtom(sourceAssetAtom);
  const getAccount = useGetAccount();
  const sourceAccount = getAccount(sourceAsset?.chainId);
  const {
    data: skipBalances,
    isFetched,
    isPending: allBalancesIsPending,
    isFetching: allBalancesIsFetching,
    refetch,
  } = useAtomValue(skipAllBalancesAtom);

  const cw20Balance = useCW20Balance({
    asset: sourceAsset as ClientAsset,
    address: sourceAccount?.address,
  });

  // this is to support both tanstack query v4/v5
  const cw20BalanceIsLoading = cw20Balance.isPending && cw20Balance.isFetching;
  const allBalancesIsLoading = allBalancesIsPending && allBalancesIsFetching;

  const data = useMemo(() => {
    if (!sourceAsset || !sourceAccount || !skipBalances) return;
    const { chainId, denom } = sourceAsset;
    if (!denom || !chainId) return;

    const denomsExists = !!skipBalances?.chains?.[chainId]?.denoms;
    const sourceBalance = skipBalances?.chains?.[chainId]?.denoms?.[denom];

    if (sourceAsset.isCw20) {
      return {
        ...cw20Balance.data,
        error: cw20Balance.error || undefined,
      };
    }

    if (denomsExists && sourceBalance === undefined) {
      return {
        amount: 0,
        formattedAmount: "0",
        error: undefined,
        decimals: undefined,
      };
    }
    return skipBalances?.chains?.[chainId]?.denoms?.[denom];
  }, [sourceAsset, sourceAccount, skipBalances, cw20Balance.data, cw20Balance.error]);

  return {
    data,
    isLoading: !isFetched || allBalancesIsLoading || cw20BalanceIsLoading,
    refetch: () => {
      refetch();
      cw20Balance.refetch();
    },
  };
};
