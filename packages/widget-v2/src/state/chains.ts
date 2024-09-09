import { Chain, AssetList } from "@chain-registry/types";
import {
  chains as chainsInitiaRegistry,
  assets as assetsInitiaRegistry,
} from "@initia/initia-registry";
import { chainRegistryChainToKeplr } from "@chain-registry/keplr";
import { ChainInfo } from "@keplr-wallet/types";
import { chains as _mainnetChains, assets as _mainnetAssets } from "chain-registry/mainnet"
import { chains as _testnetChains, assets as _testnetAssets } from "chain-registry/testnet"

export const chains = [
  ..._mainnetChains,
  ..._testnetChains,
  ...chainsInitiaRegistry,
] as Chain[];

export const assets = [
  ..._mainnetAssets,
  ..._testnetAssets,
  ...assetsInitiaRegistry,
] as AssetList[];

export const chainInfos = chains.map((chain) => {
  try {
    return chainRegistryChainToKeplr(chain, assets)
  } catch (_error) {
    return undefined
  }
}).filter(chainInfo => chainInfo) as ChainInfo[]

export const getChainInfo = (chainID: string) => {
  const chain = chains.find((chain) => chain.chain_id === chainID)
  if (!chain) return undefined
  try {
    return chainRegistryChainToKeplr(chain, assets)
  } catch (_error) {
    return undefined
  }
}

export function getChain(chainId: string): Chain {
  const chain = chains.find((c) => c.chain_id === chainId);
  if (!chain) {
    throw new Error(`chain '${chainId}' does not exist in chainRecord`);
  }
  return chain;
}

export function chainIdToName(chainId: string): string {
  return getChain(chainId).chain_name;
}

export function getAssets(chainId: string) {
  const chainName = chainIdToName(chainId);
  const assetsFoundForChain = assets.find(
    (a) => a.chain_name === chainName
  )?.assets;

  if (!assetsFoundForChain) {
    throw new Error(`chain '${chainId}' does not exist in assetsRecord`);
  }
  return assetsFoundForChain;
}
