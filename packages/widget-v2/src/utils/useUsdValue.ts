import { skipAssetsAtom } from "@/state/skipClient";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { z } from "zod";

type Args = {
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
  denom: string;
  value: string;
};



async function getUsdValue(asset: Asset, coingeckoID?: string) {
  if (!coingeckoID) {
    throw new Error(`getUsdValue error: ${asset.denom} does not have a 'coingeckoID'`);
  }
  const usd = await getUsdPrice({ coingeckoID });
  return parseFloat(asset.value) * usd;
}


export function useUsdValue(asset?: Partial<Asset>): UseQueryResult<number | undefined, Error> {
  const { data: assets } = useAtomValue(skipAssetsAtom);
  const queryKey = useMemo(() => ["USE_USD_VALUE", asset] as const, [asset]);

  const enabled = useMemo(() => {
    if (!asset?.value) return false;
    const parsed = parseFloat(asset?.value);
    return !isNaN(parsed) && parsed > 0;
  }, [asset?.value]);

  return useQuery({
    queryKey,
    queryKeyHashFn: ([key, asset]) =>
      asset ? [key, ...Object.values(asset)].join("-") : key,
    queryFn: async ({ queryKey: [, asset] }) => {
      if (asset?.value) {
        const coingeckoID = assets?.find((a) => a.denom === asset.denom)?.coingeckoID;
        return getUsdValue(asset as Asset, coingeckoID);
      }
    },
    staleTime: 1000 * 60, // 1 minute
    enabled,
  });
}
