import { Asset, AssetList, Chain } from "@graz-sh/types";

import { assetsRecord } from "./assets";
import { chainRecord } from "./chains";
import { ChainId, chainIds, chainIdToName } from "./types";

function raise(message?: string): never {
  throw new Error(message);
}

export function getChain(chainId: ChainId): Chain {
  return chainRecord[chainId] || raise(`chain '${chainId}' does not exist in chainRecord`);
}

export function getAssets(chainId: ChainId): Asset[] {
  return assetsRecord[chainId] || raise(`chain '${chainId}' does not exist in assetsRecord`);
}

export function getChains(): Chain[] {
  return Object.values(chainRecord);
}

export function getAssetLists(): AssetList[] {
  return chainIds.map((chainId) => ({
    chain_name: chainIdToName[chainId],
    assets: assetsRecord[chainId],
  }));
}

export * from "./types";
