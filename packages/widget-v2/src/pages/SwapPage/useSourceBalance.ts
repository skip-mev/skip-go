import { useAccount } from "@/hooks/useAccount";
import { skipBalancesAtom } from "@/state/skipClient";
import { sourceAssetAtom } from "@/state/swapPage";
import { useAtom, useAtomValue } from "jotai";
import { useMemo } from "react";

export const useSourceBalance = () => {
  const [sourceAsset] = useAtom(sourceAssetAtom);
  const sourceAccount = useAccount(sourceAsset?.chainID);
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
