import { atom } from "jotai";
import { Asset, assets, bridges, Chain, chains, SkipClientOptions, venues } from "@skip-go/client";

import { atomWithQuery } from "jotai-tanstack-query";
import { endpointOptions, prodApiUrl } from "@/constants/skipClientDefault";
import { defaultTheme, Theme } from "@/widget/theme";
import { createIndexedDBStorage } from "@/utils/storage";

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

const { getItem, setItem } = createIndexedDBStorage({
  dbName: "skip-go-widget",
  storeName: "skip-data",
});

const getCachedDataWhileQuerying = <T>({
  queryKey,
  cacheKey,
  queryFn,
  options = {},
}: {
  queryKey: (string | object | boolean | undefined)[];
  cacheKey: string;
  queryFn: () => Promise<T>;
  options?: { enabled?: boolean; staleTime?: number; gcTime?: number };
}) => {
  return {
    queryKey: queryKey,
    queryFn: async () => {
      const cachedData = await getItem<T>(cacheKey);

      if (cachedData !== null) {
        queryFn().then(async (newData) => {
          await setItem(cacheKey, newData);
        });

        return cachedData;
      }

      const newData = await queryFn();
      await setItem(cacheKey, newData);
      return newData;
    },
    enabled: options?.enabled ?? true,
  };
};

export const skipChainsAtom = atomWithQuery((get) => {
  const { apiUrl, apiKey, cacheDurationMs } = get(skipClientConfigAtom);
  const onlyTestnets = get(onlyTestnetsAtom);

  const cacheKey = `skip-chains-${onlyTestnets ? "testnet" : "mainnet"}`;

  return getCachedDataWhileQuerying<Chain[]>({
    queryKey: ["skipChains", { onlyTestnets, apiUrl, apiKey, cacheDurationMs }],
    cacheKey: cacheKey,
    queryFn: async () => {
      const response = await chains({
        includeEvm: true,
        includeSvm: true,
        onlyTestnets,
        abortDuplicateRequests: true,
      });
      return response || [];
    },
    options: { enabled: onlyTestnets !== undefined && apiUrl !== undefined },
  });
});

export const skipAssetsAtom = atomWithQuery((get) => {
  const { apiUrl, apiKey, cacheDurationMs } = get(skipClientConfigAtom);
  const chains = get(skipChainsAtom);
  const onlyTestnets = get(onlyTestnetsAtom);

  const cacheKey = `skip-assets-${onlyTestnets ? "testnet" : "mainnet"}`;

  return getCachedDataWhileQuerying<ClientAsset[]>({
    queryKey: ["skipAssets", onlyTestnets, { onlyTestnets, apiUrl, apiKey, cacheDurationMs }],
    cacheKey: cacheKey,
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
    options: { enabled: onlyTestnets !== undefined && apiUrl !== undefined },
  });
});

export const skipBridgesAtom = atomWithQuery((get) => {
  const { apiUrl, apiKey, cacheDurationMs } = get(skipClientConfigAtom);

  return getCachedDataWhileQuerying({
    queryKey: ["skipBridges", { apiUrl, apiKey, cacheDurationMs }],
    cacheKey: "skip-bridges",
    queryFn: async () => {
      return await bridges();
    },
  });
});

export const skipSwapVenuesAtom = atomWithQuery((get) => {
  const { apiUrl, apiKey, cacheDurationMs } = get(skipClientConfigAtom);
  const onlyTestnets = get(onlyTestnetsAtom);

  const cacheKey = `skip-swap-venues-${onlyTestnets ? "testnet" : "mainnet"}`;

  return getCachedDataWhileQuerying({
    queryKey: ["skipSwapVenues", onlyTestnets, { onlyTestnets, apiUrl, apiKey, cacheDurationMs }],
    cacheKey: cacheKey,
    queryFn: async () => {
      return await venues();
    },
    options: { enabled: onlyTestnets !== undefined && apiUrl !== undefined },
  });
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
