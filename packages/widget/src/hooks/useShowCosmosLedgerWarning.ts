import { skipChainsAtom } from "@/state/skipClient";
import { sourceAssetAtom } from "@/state/swapPage";
import { knownEthermintLikeChains } from "@/state/wallets"
import { useAccount } from "graz";
import { useAtomValue } from "jotai"
import { useMemo } from "react";
import { ChainType } from "@skip-go/client";

export const useShowCosmosLedgerWarning = () => {
  const { data: chains } = useAtomValue(skipChainsAtom);
  const sourceAsset = useAtomValue(sourceAssetAtom);
  const chainType = chains?.find((c) => c.chainID === sourceAsset?.chainID)?.chainType;
  if (chainType !== ChainType.Cosmos) return false;
  const { data: cosmosAccount } = useAccount({
    chainId: sourceAsset?.chainID,
  })

  return useMemo(() => {
    if (!cosmosAccount?.bech32Address) return false;
    if (!sourceAsset?.chainID) return false;
    if (chainType !== ChainType.Cosmos) return false;
    if (!knownEthermintLikeChains.includes(sourceAsset?.chainID)) return false;
    return !!cosmosAccount?.isNanoLedger
  }, [
    sourceAsset?.chainID,
    chainType,
    cosmosAccount?.isNanoLedger,
    cosmosAccount?.bech32Address,
  ])
}
