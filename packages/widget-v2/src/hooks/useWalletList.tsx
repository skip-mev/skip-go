import { useMemo } from "react";
import { useCreateCosmosWallets } from "./useCreateCosmosWallets";
import { useCreateEvmWallets } from "./useCreateEvmWallets";
import { useCreateSolanaWallets } from "./useCreateSolanaWallets";
import { useAtomValue } from "jotai";
import { skipChainsAtom } from "@/state/skipClient";

export const useWalletList = ({ chainID, destinationWalletList, chainType: _chainType }: { chainID?: string, destinationWalletList?: boolean, chainType?: "cosmos" | "evm" | "svm" }) => {
  const { createCosmosWallets } = useCreateCosmosWallets();
  const { createEvmWallets } = useCreateEvmWallets();
  const { createSolanaWallets } = useCreateSolanaWallets();

  const { data: chains } = useAtomValue(skipChainsAtom);
  const chainType = chainID ? chains?.find(c => c.chainID === chainID)?.chainType : _chainType;


  let walletType = chainType;
  const isSei = chainID === "pacific-1";
  if (destinationWalletList) {
    if (isSei) {
      walletType = "sei";
    }
  }

  const walletList = useMemo(() => {
    switch (walletType) {
      case "sei":
        {
          const cosmos = createCosmosWallets(chainID);
          const evm = createEvmWallets(chainID);
          return [...cosmos, ...evm];
        }
      case "cosmos":
        return createCosmosWallets(chainID);
      case "evm":
        return createEvmWallets(chainID);
      case "svm":
        return createSolanaWallets();
      default:
        return [];
    }
  }, [chainID, createCosmosWallets, createEvmWallets, createSolanaWallets, walletType]);

  return walletList;
};
