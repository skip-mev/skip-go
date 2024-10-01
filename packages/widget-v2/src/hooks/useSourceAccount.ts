import { sourceAssetAtom } from "@/state/swapPage";
import { useAtomValue, useSetAtom } from "jotai";
import { useGetAccount } from "./useGetAccount";
import { skipBalancesRequestAtom } from "@/state/balances";
import { useEffect } from "react";
import { skipAssetsAtom } from "@/state/skipClient";

export const useSourceAccount = () => {
  const sourceAsset = useAtomValue(sourceAssetAtom);
  const getAccount = useGetAccount();
  const { data: assets } = useAtomValue(skipAssetsAtom);
  const setSkipBalancesRequest = useSetAtom(skipBalancesRequestAtom);

  useEffect(() => {
    const chainId = sourceAsset?.chainID;
    const denom = sourceAsset?.denom;
    const address = getAccount(chainId)?.address;
    if (!sourceAsset || !denom || !address) return;
    const sourceAssetBalanceRequest = {
      chains: {
        [chainId]: {
          address: address,
          denoms: [denom],
        },
      },
    };

    setSkipBalancesRequest(sourceAssetBalanceRequest);

    const allBalancesRequest = assets?.reduce((acc, asset) => {
      const address = getAccount(asset.chainID)?.address;
      if (address) {
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
      setSkipBalancesRequest({
        chains: allBalancesRequest || {}
      });
    }
  }, [assets, getAccount, setSkipBalancesRequest, sourceAsset]);

  return getAccount(sourceAsset?.chainID);
};
