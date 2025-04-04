import { useCallback, useEffect } from "react";
import { useAccount } from "wagmi";
import { sourceAssetAtom } from "@/state/swapPage";
import { useAtomValue } from "jotai";
import { skipChainsAtom } from "@/state/skipClient";
import { evmWalletAtom } from "@/state/wallets";

export const useSwitchEvmChainIfNeeded = () => {
  const evmWallet = useAtomValue(evmWalletAtom);

  const { chainId: evmChainId, connector } = useAccount();
  const sourceAsset = useAtomValue(sourceAssetAtom);
  const { data: chains } = useAtomValue(skipChainsAtom);

  const switchToEvmChainIfNeeded = useCallback(
    (targetChainId?: string) => {
      if (targetChainId && chains && evmWallet?.id && connector) {
        const isEvm = chains.find((c) => c.chainID === targetChainId)?.chainType === "evm";

        if (isEvm && targetChainId !== String(evmChainId)) {
          connector.switchChain?.({
            chainId: Number(targetChainId),
          });
        }
      }
    },
    [chains, connector, evmChainId, evmWallet?.id],
  );

  // Effect to automatically switch chain when source asset changes (including direction reversal)
  useEffect(() => {
    switchToEvmChainIfNeeded(sourceAsset?.chainID);
  }, [sourceAsset?.chainID, switchToEvmChainIfNeeded]);
};
