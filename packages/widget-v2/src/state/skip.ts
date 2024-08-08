import { atom } from 'jotai';
import { Asset, SkipRouter } from '@skip-go/client';
import { Chain, AssetList } from '@chain-registry/types';
import {
  chains as chainsChainRegistry,
  assets as assetsChainRegistry,
} from 'chain-registry';
import {
  chains as chainsInitiaRegistry,
  assets as assetsInitiaRegistry,
} from '@initia/initia-registry';
import { atomWithQuery } from 'jotai-tanstack-query';

export const chains = [
  ...chainsChainRegistry,
  ...chainsInitiaRegistry,
] as Chain[];
export const assets = [
  ...assetsChainRegistry,
  ...assetsInitiaRegistry,
] as AssetList[];

export const skipClient = atom(new SkipRouter());

export type ClientAsset = Asset & {
  chain_key: string;
  chainName: string;
};

const flattenData = (data: Record<string, Asset[]>) => {
  const flattenedData: ClientAsset[] = [];

  for (const chainKey in data) {
    data[chainKey].forEach((asset: Asset) => {
      const chain = chains.find((c) => c.chain_id === asset.chainID);
      flattenedData.push({
        ...asset,
        chain_key: chainKey,
        chainName: chain?.pretty_name ?? chain?.chain_name ?? '',
      });
    });
  }

  return flattenedData;
};

export const skipAssets = atomWithQuery((get) => {
  const skip = get(skipClient);
  return {
    queryKey: ['skipAssets'],
    queryFn: async () => {
      return skip
        .assets({
          includeEvmAssets: true,
          includeCW20Assets: true,
          includeSvmAssets: true,
        })
        .then(flattenData);
    },
  };
});

export type ChainWithAsset = Chain & {
  asset?: ClientAsset;
};

export const getChainsContainingAsset = (
  assetSymbol: string,
  assets: ClientAsset[]
): ChainWithAsset[] => {
  if (!assets) return [];
  const chainIDs = assets
    .filter((asset) => asset.symbol === assetSymbol)
    .map((asset) => asset.chainID);
  const chainsContainingAsset = chains
    .filter((chain) => chainIDs?.includes(chain.chain_id))
    .map((chain) => {
      return {
        ...chain,
        asset: assets.find(
          (asset) =>
            asset.chainID === chain.chain_id && asset.symbol === assetSymbol
        ),
      };
    });
  return chainsContainingAsset;
};

function getChain(chainId: string): Chain {
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
