import { useMemo } from "react";
import { useCreateCosmosWallets } from "./useCreateCosmosWallets";
import { useCreateEvmWallets } from "./useCreateEvmWallets";
import { useCreateSolanaWallets } from "./useCreateSolanaWallets";
import { useAtomValue } from "jotai";
import { skipChainsAtom } from "@/state/skipClient";
import { ChainType } from "@skip-go/client";

export const useWalletList = ({
  chainId,
  destinationWalletList,
  chainType: _chainType,
}: {
  chainId?: string;
  destinationWalletList?: boolean;
  chainType?: ChainType;
}) => {
  const { createCosmosWallets } = useCreateCosmosWallets();
  const { createEvmWallets } = useCreateEvmWallets();
  const { createSolanaWallets } = useCreateSolanaWallets();

  const { data: chains } = useAtomValue(skipChainsAtom);
  const chainType = chainId ? chains?.find((c) => c.chainId === chainId)?.chainType : _chainType;

  const walletType = destinationWalletList && chainId === "pacific-1" ? "sei" : chainType;

  const walletList = useMemo(() => {
    switch (walletType) {
      case "sei": {
        const cosmos = createCosmosWallets(chainId);
        const evm = createEvmWallets(chainId);
        return [...cosmos, ...evm];
      }
      case "cosmos":
        return createCosmosWallets(chainId);
      case "evm":
        return createEvmWallets(chainId);
      case "svm":
        return createSolanaWallets();
      default:
        return [];
    }
  }, [chainId, createCosmosWallets, createEvmWallets, createSolanaWallets, walletType]);

  return walletList;
};
