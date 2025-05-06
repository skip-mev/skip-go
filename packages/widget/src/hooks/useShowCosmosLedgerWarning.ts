import { skipChainsAtom } from "@/state/skipClient";
import { sourceAssetAtom } from "@/state/swapPage";
import { knownEthermintLikeChains } from "@/state/wallets";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { useGetAccount } from "./useGetAccount";
import { ChainType } from "@skip-go/client";

export const useShowCosmosLedgerWarning = () => {
  const { data: chains } = useAtomValue(skipChainsAtom);
  const sourceAsset = useAtomValue(sourceAssetAtom);
  const chainType = chains?.find((c) => c.chainId === sourceAsset?.chainId)?.chainType;
  const getAccount = useGetAccount();

  return useMemo(() => {
    if (chainType !== ChainType.Cosmos) return false;
    const account = getAccount(sourceAsset?.chainId);
    if (!account?.address) return false;
    if (!sourceAsset?.chainId) return false;
    if (!knownEthermintLikeChains.includes(sourceAsset?.chainId)) return false;
    return !!account?.wallet.isLedger;
  }, [sourceAsset?.chainId, chainType, getAccount]);
};
