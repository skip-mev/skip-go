import { sourceAssetAtom } from "@/state/swapPage";
import { useAtomValue, useSetAtom } from "jotai";
import { useGetAccount } from "./useGetAccount";
import { skipAllBalancesRequestAtom } from "@/state/balances";
import { useEffect } from "react";
import { skipAssetsAtom, skipChainsAtom } from "@/state/skipClient";
import { useAccount } from "wagmi";

export const useSetAllBalances = () => {
  const sourceAsset = useAtomValue(sourceAssetAtom);
  const getAccount = useGetAccount();
  const { data: assets } = useAtomValue(skipAssetsAtom);
  const setSkipAllBalancesRequest = useSetAtom(skipAllBalancesRequestAtom);
  const { data: chains } = useAtomValue(skipChainsAtom);

  const { chainId: evmChainId } = useAccount();

  useEffect(() => {
    const allBalancesRequest = assets?.reduce((acc, asset) => {
      const address = getAccount(asset.chainID)?.address;
      const chain = chains?.find((chain) => chain.chainID === asset.chainID);
      const isEVM = chain?.chainType === "evm";
      const evmAddress = (isEVM && evmChainId) ? getAccount(String(evmChainId))?.address : undefined;
      if (isEVM && evmAddress) {
        if (asset.denom === sourceAsset?.denom) return acc;
        if (!acc[asset.chainID]) {
          acc[asset.chainID] = {
            address: evmAddress,
          };
        }
      } else if (address) {
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
  }, [assets, evmChainId, chains, getAccount, setSkipAllBalancesRequest, sourceAsset]);

};
