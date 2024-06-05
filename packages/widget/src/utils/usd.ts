import { z } from 'zod';

interface Args {
  coingeckoID: string;
}

const cache = new Map<string, number>();

export async function getUsdPrice({ coingeckoID }: Args) {
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
