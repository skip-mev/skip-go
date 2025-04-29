import { onlyTestnetsAtom } from "@/state/skipClient";
import { ChainType } from "@skip-go/client";
import { useAtomValue } from "jotai";

export const usePrimaryChainIdForChainType = () => {
  const onlyTestnets = useAtomValue(onlyTestnetsAtom);

  return onlyTestnets ? chainIdForChainTypeTestnet : chainIdForChainType;
};

const chainIdForChainType = {
  [ChainType.Cosmos]: "cosmoshub-4",
  [ChainType.Evm]: "1",
  [ChainType.Svm]: "solana",
};

const chainIdForChainTypeTestnet = {
  [ChainType.Cosmos]: "provider",
  [ChainType.Evm]: "11155111",
  [ChainType.Svm]: "solana-devnet",
};
