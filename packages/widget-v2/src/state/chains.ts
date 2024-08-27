
import { Chain, AssetList } from "@chain-registry/types";
import {
  chains as chainsChainRegistry,
  assets as assetsChainRegistry,
} from "chain-registry";
import {
  chains as chainsInitiaRegistry,
  assets as assetsInitiaRegistry,
} from "@initia/initia-registry";

export const chains = [
  ...chainsChainRegistry,
  ...chainsInitiaRegistry,
] as Chain[];
export const assets = [
  ...assetsChainRegistry,
  ...assetsInitiaRegistry,
] as AssetList[];

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
