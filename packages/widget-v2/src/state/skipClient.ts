import { atom } from "jotai";
import { Asset, SkipClient, Chain } from "@skip-go/client";
import { atomWithQuery } from "jotai-tanstack-query";


export const skipClient = atom(new SkipClient());

export type ClientAsset = Asset & {
  chain_key: string;
  chainName: string;
};

const flattenData = (data: Record<string, Asset[] >, chains?: Chain[]) => {
  const flattenedData: ClientAsset[] = [];

  for (const chainKey in data) {
    data[chainKey].forEach((asset: Asset) => {
      const chain = chains?.find((c) => c.chainID === asset.chainID);
      flattenedData.push({
        ...asset,
        chain_key: chainKey,
        chainName: chain?.prettyName ?? chain?.chainName ?? asset.chainID ??  "--",
      });
    });
  }

  return flattenedData;
};

export const skipAssetsAtom = atomWithQuery((get) => {
  const skip = get(skipClient);
  const chains = get(skipChainsAtom);

  return {
    queryKey: ["skipAssets"],
    queryFn: async () => {
      return skip
        .assets({
          includeEvmAssets: true,
          includeCW20Assets: true,
          includeSvmAssets: true,
        })
        .then((v) => flattenData(v, chains.data));
    },
  };
});

export const skipChainsAtom = atomWithQuery((get) => {
  const skip = get(skipClient);
  return {
    queryKey: ["skipChains"],
    queryFn: async () => {
      return skip.chains({
        includeEVM: true,
        includeSVM: true,
      })
    }
  }
})

export type ChainWithAsset = Chain & {
  asset?: ClientAsset;
};

export const getChainsContainingAsset = (
  assetSymbol: string,
  assets: ClientAsset[],
  chains: Chain[]
): ChainWithAsset[] => {
  if (!assets) return [];
  const chainIDs = assets
    .filter((asset) => asset.symbol === assetSymbol)
    .map((asset) => asset.chainID);
  const chainsContainingAsset = chains
    .filter((chain) => chainIDs?.includes(chain.chainID))
    .map((chain) => {
      return {
        ...chain,
        asset: assets.find(
          (asset) =>
            asset.chainID === chain.chainID && asset.symbol === assetSymbol
        ),
      };
    });
  return chainsContainingAsset;
};
