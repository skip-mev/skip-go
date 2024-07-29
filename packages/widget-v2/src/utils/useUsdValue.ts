import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { z } from 'zod';
import { getAssets } from '../state/skip';

interface Args {
  coingeckoID: string;
}

const cache = new Map<string, number>();

async function getUsdPrice({ coingeckoID }: Args) {
  const cached = cache.get(coingeckoID);
  if (cached) return cached;

  const endpoint = `https://coins.llama.fi/prices/current/coingecko:${coingeckoID}`;

  const response = await fetch(endpoint);
  const data = await response.json();

  const { coins } = await priceResponseSchema.parseAsync(data);
  const { price } = coins[`coingecko:${coingeckoID}`];

  cache.set(coingeckoID, price);
  return price;
}

const priceResponseSchema = z.object({
  coins: z.record(
    z.object({
      price: z.number(),
      symbol: z.string(),
      timestamp: z.number(),
      confidence: z.number(),
    })
  ),
});

export type Asset = {
  chainID: string;
  denom: string;
  coingeckoID?: string;
  value: string;
};

const getCoinGeckoId = (asset: Asset) => {
  if (asset.coingeckoID) {
    return asset.coingeckoID;
  } else {
    const assets = getAssets(asset.chainID);
    const assetFound = assets.find((a) => a.base === asset.denom);
    if (!assetFound?.coingecko_id) {
      throw new Error(
        `getUsdValue error: ${asset.denom} does not have a 'coingecko_id' in ${asset.chainID}`
      );
    }
    return assetFound.coingecko_id;
  }
};

async function getUsdValue(asset: Asset) {
  const usd = await getUsdPrice({ coingeckoID: getCoinGeckoId(asset) });
  return parseFloat(asset.value) * usd;
}

export function useUsdValue(asset?: Partial<Asset>) {
  const queryKey = useMemo(() => ['USE_USD_VALUE', asset] as const, [asset]);

  const enabled = useMemo(() => {
    if (!asset?.value) return false;
    const parsed = parseFloat(asset?.value);
    return !isNaN(parsed) && parsed > 0;
  }, [asset?.value]);

  return useQuery({
    queryKey,
    queryKeyHashFn: ([key, asset]) =>
      asset ? [key, ...Object.values(asset)].join('-') : key,
    queryFn: async ({ queryKey: [, asset] }) => {
      if (asset?.value) {
        return getUsdValue(asset as Asset);
      }
    },
    staleTime: 1000 * 60, // 1 minute
    enabled,
  });
}
