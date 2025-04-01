import { useCallback, useEffect, useMemo } from "react";
import { useGetAccount } from "./useGetAccount";
import { useAccount } from "wagmi";
import { sourceAssetAtom } from "@/state/swapPage";
import { useAtomValue } from "jotai";
import { skipChainsAtom } from "@/state/skipClient";

export const useSwitchEvmChainIfNeeded = () => {
  const getAccount = useGetAccount();
  const { chainId: evmChainId, connector } = useAccount();
  const sourceAsset = useAtomValue(sourceAssetAtom);
  const { data: chains } = useAtomValue(skipChainsAtom);

  const evmAddress = useMemo(() => {
    return evmChainId ? getAccount(String(evmChainId))?.address : undefined;
  }, [evmChainId, getAccount]);
  // Utility function to handle chain switching for EVM chains
  const switchToEvmChainIfNeeded = useCallback(
    (targetChainId?: string) => {
      if (targetChainId && chains && evmAddress && connector) {
        const isEvm = chains.find((c) => c.chainID === targetChainId)?.chainType === "evm";
        if (isEvm && targetChainId !== String(evmChainId)) {
          connector.switchChain?.({
            chainId: Number(targetChainId),
          });
        }
      }
    },
    [chains, connector, evmAddress, evmChainId],
  );

  // Effect to automatically switch chain when source asset changes (including direction reversal)
  useEffect(() => {
    switchToEvmChainIfNeeded(sourceAsset?.chainID);
  }, [sourceAsset?.chainID, switchToEvmChainIfNeeded]);
};
