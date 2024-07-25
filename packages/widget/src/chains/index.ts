import { Chain, Asset, AssetList } from '@chain-registry/types';
import {
  chains as chainsChainRegistry,
  assets as assetsChainRegistry,
} from 'chain-registry';
import {
  chains as chainsInitiaRegistry,
  assets as assetsInitiaRegistry,
} from '@initia/initia-registry';

export const chains = [
  ...chainsChainRegistry,
  ...chainsInitiaRegistry,
] as Chain[];
export const assets = [
  ...assetsChainRegistry,
  ...assetsInitiaRegistry,
] as AssetList[];

function raise(message?: string): never {
  throw new Error(message);
}

function getChain(chainId: string): Chain {
  return (
    chains.find((c) => c.chain_id === chainId) ||
    raise(`chain '${chainId}' does not exist in chainRecord`)
  );
}

export function chainIdToName(chainId: string): string {
  return getChain(chainId).chain_name;
}

export function getAssets(chainId: string): Asset[] {
  const chainName = chainIdToName(chainId);
  return (
    assets.find((a) => a.chain_name === chainName)?.assets ||
    raise(`chain '${chainId}' does not exist in assetsRecord`)
  );
}
