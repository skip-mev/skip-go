import { skipChainsAtom } from "@/state/skipClient";
import { sourceAssetAtom } from "@/state/swapPage";
import { knownEthermintLikeChains } from "@/state/wallets";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { ChainType } from "@skip-go/client";
import { useGetAccount } from "./useGetAccount";

export const useShowCosmosLedgerWarning = () => {
  const { data: chains } = useAtomValue(skipChainsAtom);
  const sourceAsset = useAtomValue(sourceAssetAtom);
  const chainType = chains?.find((c) => c.chainID === sourceAsset?.chainID)?.chainType;
  const getAccount = useGetAccount();

  return useMemo(() => {
    if (chainType !== ChainType.Cosmos) return false;
    const account = getAccount(sourceAsset?.chainID);
    if (!account?.address) return false;
    if (!sourceAsset?.chainID) return false;
    if (!knownEthermintLikeChains.includes(sourceAsset?.chainID)) return false;
    return !!account?.wallet.isLedger;
  }, [sourceAsset?.chainID, chainType, getAccount]);
};
