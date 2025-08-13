import { atom } from "jotai";
import { Asset, assets, bridges, Chain, chains, SkipClientOptions, venues } from "@skip-go/client";

import { atomWithQuery } from "jotai-tanstack-query";
import { endpointOptions, prodApiUrl } from "@/constants/skipClientDefault";
import { defaultTheme, Theme } from "@/widget/theme";

export const defaultSkipClientConfig = {
  apiUrl: prodApiUrl,
  endpointOptions,
};

export const skipClientConfigAtom = atom<SkipClientOptions>({
  apiUrl: undefined,
  endpointOptions: undefined,
});

export const rootIdAtom = atom<string | undefined>(undefined);

export const themeAtom = atom<Theme>(defaultTheme);

export type ClientAsset = Asset & {
  chain_key: string;
  chainName: string;
};

const flattenData = (data: Record<string, Asset[]>, chains?: Chain[]) => {
  const flattenedData: ClientAsset[] = [];

  for (const chainKey in data) {
    data[chainKey].forEach((asset: Asset) => {
      const chain = chains?.find((c) => c.chainId === asset.chainId);
      flattenedData.push({
        ...asset,
        chain_key: chainKey,
        chainName: chain?.prettyName ?? chain?.chainName ?? asset.chainId ?? "--",
      });
    });
  }

  return flattenedData;
};

export const onlyTestnetsAtom = atom<boolean | undefined>(undefined);

export const skipAssetsAtom = atomWithQuery((get) => {
  const { apiUrl, apiKey, cacheDurationMs } = get(skipClientConfigAtom);
  const chains = get(skipChainsAtom);
  const onlyTestnets = get(onlyTestnetsAtom);

  return {
    queryKey: ["skipAssets", onlyTestnets, { onlyTestnets, apiUrl, apiKey, cacheDurationMs }],
    queryFn: async () => {
      const response = await assets({
        includeEvmAssets: true,
        includeCw20Assets: true,
        includeSvmAssets: true,
        onlyTestnets,
        abortDuplicateRequests: true,
      });

      return flattenData(response as Record<string, Asset[]>, chains.data);
    },
    enabled: onlyTestnets !== undefined && apiUrl !== undefined,
  };
});

export const skipChainsAtom = atomWithQuery((get) => {
  const { apiUrl, apiKey, cacheDurationMs } = get(skipClientConfigAtom);
  const onlyTestnets = get(onlyTestnetsAtom);

  console.log("skipChainsAtom", onlyTestnets, apiUrl, apiKey, cacheDurationMs);

  return {
    queryKey: ["skipChains", { onlyTestnets, apiUrl, apiKey, cacheDurationMs }],
    queryFn: async () => {
      const response = await chains({
        includeEvm: true,
        includeSvm: true,
        onlyTestnets,
        abortDuplicateRequests: true,
      });
      return response;
    },
    enabled: onlyTestnets !== undefined && apiUrl !== undefined,
  };
});

export const skipBridgesAtom = atomWithQuery((get) => {
  const { apiUrl, apiKey, cacheDurationMs } = get(skipClientConfigAtom);
  return {
    queryKey: ["skipBridges", { apiUrl, apiKey, cacheDurationMs }],
    queryFn: async () => bridges(),
  };
});

export const skipSwapVenuesAtom = atomWithQuery((get) => {
  const { apiUrl, apiKey, cacheDurationMs } = get(skipClientConfigAtom);
  const onlyTestnets = get(onlyTestnetsAtom);

  return {
    queryKey: ["skipSwapVenue", { onlyTestnets, apiUrl, apiKey, cacheDurationMs }],
    queryFn: async () => venues(),
    enabled: onlyTestnets !== undefined && apiUrl !== undefined,
  };
});

export type ChainWithAsset = Chain & {
  asset?: ClientAsset;
};

export const getChainsContainingAsset = (
  assetSymbol: string,
  assets: ClientAsset[],
  chains: Chain[],
): ChainWithAsset[] => {
  if (!assets) return [];
  const chainIds = assets
    .filter((asset) => asset.symbol === assetSymbol)
    .map((asset) => asset.chainId);
  const chainsContainingAsset = chains
    .filter((chain) => chainIds?.includes(chain.chainId))
    .map((chain) => {
      return {
        ...chain,
        asset: assets.find(
          (asset) => asset.chainId === chain.chainId && asset.symbol === assetSymbol,
        ),
      };
    });
  return chainsContainingAsset;
};
