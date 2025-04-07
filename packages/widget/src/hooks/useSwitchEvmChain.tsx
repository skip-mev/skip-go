import { useAccount } from "wagmi";
import { useAtomValue } from "jotai";
import { skipChainsAtom } from "@/state/skipClient";
import { useCallback } from "react";

export const useSwitchEvmChain = () => {
  const { connector } = useAccount();
  const { data: chains } = useAtomValue(skipChainsAtom);

  const switchEvmChainId = useCallback(
    (targetChainId?: string) => {
      const isEvm = chains?.find((c) => c.chainID === targetChainId)?.chainType === "evm";

      if (isEvm) {
        connector?.switchChain?.({
          chainId: Number(targetChainId),
        });
      }
    },
    [chains, connector],
  );

  return switchEvmChainId;
};
