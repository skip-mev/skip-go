import { sourceAssetAtom } from "@/state/swapPage";
import { useAtomValue, useSetAtom } from "jotai";
import { useGetAccount } from "./useGetAccount";
import { skipSourceBalanceRequestAtom } from "@/state/balances";
import { useEffect } from "react";
import { skipAssetsAtom } from "@/state/skipClient";

export const useFetchSourceBalance = () => {
  const sourceAsset = useAtomValue(sourceAssetAtom);
  const getAccount = useGetAccount();
  const { data: assets } = useAtomValue(skipAssetsAtom);
  const setSkipSourceBalanceRequest = useSetAtom(skipSourceBalanceRequestAtom);

  useEffect(() => {
    const chainId = sourceAsset?.chainID;
    const denom = sourceAsset?.denom;
    const address = getAccount(chainId)?.address;
    if (!chainId || !sourceAsset || !denom || !address) return;
    const sourceAssetBalanceRequest = {
      chains: {
        [chainId]: {
          address: address,
          denoms: [denom],
        },
      },
    };

    setSkipSourceBalanceRequest(sourceAssetBalanceRequest);
  }, [assets, getAccount, setSkipSourceBalanceRequest, sourceAsset]);

  return getAccount(sourceAsset?.chainID);
};
