import { onlyTestnetsAtom } from "@/state/skipClient";
import { ChainType } from "@skip-go/client";
import { useAtomValue } from "jotai";

export const usePrimaryChainIdForChainType = () => {
  const onlyTestnets = useAtomValue(onlyTestnetsAtom);

  return onlyTestnets ? chainIdForChainTypeTestnet : chainIdForChainType;
};

const chainIdForChainType = {
  [ChainType.Cosmos]: "cosmoshub-4",
  [ChainType.EVM]: "1",
  [ChainType.SVM]: "solana",
};

const chainIdForChainTypeTestnet = {
  [ChainType.Cosmos]: "provider",
  [ChainType.EVM]: "11155111",
  [ChainType.SVM]: "solana-devnet",
};
