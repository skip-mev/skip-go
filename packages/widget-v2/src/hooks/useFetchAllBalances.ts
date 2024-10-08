import { sourceAssetAtom } from "@/state/swapPage";
import { useAtomValue, useSetAtom } from "jotai";
import { useGetAccount } from "./useGetAccount";
import { skipAllBalancesRequestAtom, skipAllBalancesAtom } from "@/state/balances";
import { useEffect } from "react";
import { skipAssetsAtom } from "@/state/skipClient";

export const useFetchAllBalances = () => {
  const sourceAsset = useAtomValue(sourceAssetAtom);
  const getAccount = useGetAccount();
  const { data: assets } = useAtomValue(skipAssetsAtom);
  const setSkipAllBalancesRequest = useSetAtom(skipAllBalancesRequestAtom);
  const { data: skipBalances } = useAtomValue(skipAllBalancesAtom);

  useEffect(() => {
    const allBalancesRequest = assets?.reduce((acc, asset) => {
      const address = getAccount(asset.chainID)?.address;
      if (address) {
        if (asset.denom === sourceAsset?.denom) return acc;
        if (!acc[asset.chainID]) {
          acc[asset.chainID] = {
            address: address,
          };
        }
      }
      return acc;
    }, {} as Record<string, { address: string }>);

    if (allBalancesRequest) {
      setSkipAllBalancesRequest({
        chains: allBalancesRequest || {}
      });
    }
  }, [assets, getAccount, setSkipAllBalancesRequest, sourceAsset]);

  return skipBalances;
};
