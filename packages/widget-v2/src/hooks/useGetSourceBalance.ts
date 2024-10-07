import { useFetchSourceBalance } from "@/hooks/useFetchSourceBalance";
import { skipSourceBalanceAtom } from "@/state/balances";
import { sourceAssetAtom } from "@/state/swapPage";
import { useAtom, useAtomValue } from "jotai";
import { useMemo } from "react";

export const useGetSourceBalance = () => {
  const [sourceAsset] = useAtom(sourceAssetAtom);
  const sourceAccount = useFetchSourceBalance();
  const { data: skipBalances, isLoading, refetch } = useAtomValue(skipSourceBalanceAtom);

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
