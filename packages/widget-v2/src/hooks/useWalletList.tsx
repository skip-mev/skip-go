import { useMemo } from "react";
import { useCreateCosmosWallets } from "./useCreateCosmosWallets";
import { useCreateEvmWallets } from "./useCreateEvmWallets";
import { useCreateSolanaWallets } from "./useCreateSolanaWallets";
import { useAtomValue } from "jotai";
import { skipChainsAtom } from "@/state/skipClient";

export const useWalletList = (chainID?: string) => {
  const { createCosmosWallets } = useCreateCosmosWallets();
  const { createEvmWallets } = useCreateEvmWallets();
  const { createSolanaWallets } = useCreateSolanaWallets();

  const { data: chains } = useAtomValue(skipChainsAtom);
  const chainType = chains?.find(c => c.chainID === chainID)?.chainType;

  const walletList = useMemo(() => {
    if (!chainID) return [];
    switch (chainType) {
      case "cosmos":
        return createCosmosWallets(chainID);
      case "evm":
        return createEvmWallets(chainID);
      case "solana":
        return createSolanaWallets();
      default:
        return [];
    }
  }, [chainID, chainType, createCosmosWallets, createEvmWallets, createSolanaWallets]);

  return walletList;
};

export const useDestinationWalletList = (chainID?: string) => {

  const { createCosmosWallets } = useCreateCosmosWallets();
  const { createEvmWallets } = useCreateEvmWallets();
  const { createSolanaWallets } = useCreateSolanaWallets();

  const { data: chains } = useAtomValue(skipChainsAtom);
  const chainType = chains?.find(c => c.chainID === chainID)?.chainType;
  const isSei = chainID === "pacific-1";

  const walletList = useMemo(() => {
    if (!chainID) return [];
    switch (true) {
      case isSei:
        {
          const cosmos = createCosmosWallets(chainID);
          const evm = createEvmWallets(chainID);
          return [...cosmos, ...evm];
        }
      case chainType === "cosmos":
        return createCosmosWallets(chainID);
      case chainType === "evm":
        return createEvmWallets(chainID);
      case chainType === "solana":
        return createSolanaWallets();
      default:
        return [];
    }
  }, [chainID, chainType, createCosmosWallets, createEvmWallets, createSolanaWallets, isSei]);

  return walletList;
};
