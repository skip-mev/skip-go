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
  const sourceAccount = getAccount(sourceAsset?.chainID);
  const { data: skipBalances, isLoading, refetch } = useAtomValue(skipAllBalancesAtom);

  const cw20Balance = useCW20Balance({
    asset: sourceAsset as ClientAsset,
    address: sourceAccount?.address
  });

  const data = useMemo(() => {
    if (!sourceAsset || !sourceAccount || !skipBalances) return;
    const { chainID, denom } = sourceAsset;
    if (!denom || !chainID) return;

    const denomsExists = !!skipBalances?.chains?.[chainID]?.denoms;
    const sourceBalance = skipBalances?.chains?.[chainID]?.denoms?.[denom];

    if (sourceAsset.isCW20) {
      return {
        ...cw20Balance.data,
        error: cw20Balance.error || undefined
      }
    }

    if (denomsExists && sourceBalance === undefined) {
      return {
        amount: 0,
        formattedAmount: "0",
        error: undefined,
        decimals: undefined
      };
    }
    return skipBalances?.chains?.[chainID]?.denoms?.[denom];
  }, [sourceAsset, sourceAccount, skipBalances]);

  return {
    data,
    isLoading: isLoading || cw20Balance.isLoading,
    refetch: () => {
      refetch();
      cw20Balance.refetch();
    }
  };
};
