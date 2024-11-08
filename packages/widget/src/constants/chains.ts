import { ChainInfo } from "@keplr-wallet/types";
import _mainnetChains from "@/constants/cosmosChains/mainnet.json";
import _testnetChains from "@/constants/cosmosChains/testnet.json";
import _explorers from "@/constants/cosmosChains/explorers.json";

export type Explorer = {
  kind?: string;
  url?: string;
  tx_page?: string;
  account_page?: string;
  validator_page?: string;
  proposal_page?: string;
  block_page?: string;
}

export const mainnetChains = _mainnetChains as unknown as ChainInfo[];
export const testnetChains = _testnetChains as unknown as ChainInfo[];
const allChains = [...mainnetChains, ...testnetChains];

export const explorers = _explorers as unknown as {
  chainId: string;
  explorers: Explorer[];
}[];

export const getChainInfo = (chainID: string) => {
  const chain = allChains.find((chain) => chain.chainId === chainID);
  if (!chain) return undefined;
  return chain;
};
