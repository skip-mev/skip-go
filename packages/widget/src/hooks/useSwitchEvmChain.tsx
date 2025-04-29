import { useAccount } from "wagmi";
import { useAtomValue } from "jotai";
import { skipChainsAtom } from "@/state/skipClient";
import { useCallback } from "react";

export const useSwitchEvmChain = () => {
  const { connector } = useAccount();
  const { data: chains } = useAtomValue(skipChainsAtom);

  const switchEvmChainId = useCallback(
    (chainId?: string) => {
      const isEvmChainId = chains?.find((c) => c.chainId === chainId)?.chainType === "evm";

      if (isEvmChainId) {
        connector?.switchChain?.({
          chainId: Number(chainId),
        });
      }
    },
    [chains, connector],
  );

  return switchEvmChainId;
};
