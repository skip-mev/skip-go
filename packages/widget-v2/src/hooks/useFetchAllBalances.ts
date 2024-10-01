import { sourceAssetAtom } from "@/state/swapPage";
import { useAtomValue, useSetAtom } from "jotai";
import { useGetAccount } from "./useGetAccount";
import { skipAllBalancesRequestAtom, skipBalancesAtom } from "@/state/balances";
import { useEffect } from "react";
import { skipAssetsAtom } from "@/state/skipClient";

export const useFetchAllBalances = () => {
  const sourceAsset = useAtomValue(sourceAssetAtom);
  const getAccount = useGetAccount();
  const { data: assets } = useAtomValue(skipAssetsAtom);
  const setSkipAllBalancesRequest = useSetAtom(skipAllBalancesRequestAtom);
  const skipBalances = useAtomValue(skipBalancesAtom);

  useEffect(() => {
    const allBalancesRequest = assets?.reduce((acc, asset) => {
      const address = getAccount(asset.chainID)?.address;
      if (address) {
        if (asset.denom === sourceAsset?.denom) return acc;
        if (acc[asset.chainID]?.denoms) {
          acc[asset.chainID].denoms.push(asset.denom);
        } else {
          acc[asset.chainID] = {
            address: address,
            denoms: [asset.denom],
          };
        }
      }
      return acc;
    }, {} as Record<string, { address: string, denoms: string[] }>);

    if (allBalancesRequest) {
      setSkipAllBalancesRequest({
        chains: allBalancesRequest || {}
      });
    }
  }, [assets, getAccount, setSkipAllBalancesRequest, sourceAsset]);

  return skipBalances;
};
