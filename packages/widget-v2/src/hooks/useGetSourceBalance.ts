import { skipAllBalancesAtom } from "@/state/balances";
import { sourceAssetAtom } from "@/state/swapPage";
import { useAtom, useAtomValue } from "jotai";
import { useMemo } from "react";
import { useGetAccount } from "./useGetAccount";

export const useGetSourceBalance = () => {
  const [sourceAsset] = useAtom(sourceAssetAtom);
  const getAccount = useGetAccount();
  const sourceAccount = getAccount(sourceAsset?.chainID);
  const { data: skipBalances, isLoading, refetch } = useAtomValue(skipAllBalancesAtom);

  const data = useMemo(() => {
    if (!sourceAsset || !sourceAccount || !skipBalances) return;
    const { chainID, denom } = sourceAsset;
    if (!denom || !chainID) return;

    const denomsExists = !!skipBalances?.chains?.[chainID]?.denoms;
    const sourceBalance = skipBalances?.chains?.[chainID]?.denoms?.[denom];

    if (denomsExists && sourceBalance === undefined) {
      return {
        amount: 0,
        formattedAmount: "0",
        error: undefined,
      };
    }
    return skipBalances?.chains?.[chainID]?.denoms?.[denom];
  }, [sourceAsset, sourceAccount, skipBalances]);

  return {
    data,
    isLoading,
    refetch
  };
};
