import { skipChainsAtom } from "@/state/skipClient";
import { sourceAssetAtom } from "@/state/swapPage";
import { knownEthermintLikeChains } from "@/state/wallets"
import { useAccount } from "graz";
import { useAtomValue } from "jotai"
import { useMemo } from "react";

export const useShowCosmosLedgerWarning = () => {
  const { data: chains } = useAtomValue(skipChainsAtom);
  const sourceAsset = useAtomValue(sourceAssetAtom);
  const chainType = chains?.find((c) => c.chainID === sourceAsset?.chainID)?.chainType;
  const { data: cosmosAccount } = useAccount({
    chainId: sourceAsset?.chainID,
  })

  return useMemo(() => {
    if (!sourceAsset?.chainID) return false;
    if (chainType !== "cosmos") return false;
    if (!knownEthermintLikeChains.includes(sourceAsset?.chainID)) return false;
    return !!cosmosAccount?.isNanoLedger
  }, [
    sourceAsset?.chainID,
    chainType,
    cosmosAccount?.bech32Address,
  ])
}
