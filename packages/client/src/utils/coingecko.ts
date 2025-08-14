export const getUsdPrice = async (coingeckoId: string): Promise<number | undefined> => {
  try {
    // this is using public demo coingecko API, which has a rate limit of ~30 calls per minutes
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId}&vs_currencies=usd`);
    const data = await response.json();
    return data?.[coingeckoId]?.usd as number | undefined;
  } catch (error) {
    return undefined;
  }
}
