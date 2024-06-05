import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getAssets } from '../chains';
import { raise } from '../utils/assert';
import { getUsdPrice } from '../utils/usd';

export type Args = {
  chainId: string;
  denom: string;
  coingeckoID?: string;
  value: string;
};

export function useUsdValue(args: Args) {
  const queryKey = useMemo(() => ['USE_USD_VALUE', args] as const, [args]);

  const enabled = useMemo(() => {
    const parsed = parseFloat(args.value);
    return !isNaN(parsed) && parsed > 0;
  }, [args.value]);

  return useQuery({
    queryKey,
    queryKeyHashFn: ([key, args]) => [key, ...Object.values(args)].join('-'),
    queryFn: async ({ queryKey: [, args] }) => {
      return getUsdValue(args);
    },
    staleTime: 1000 * 60, // 1 minute
    enabled,
  });
}

export function useUsdDiffValue([args1, args2]: [Args, Args]) {
  const queryKey = useMemo(() => {
    return ['USE_USD_DIFF_VALUES', args1, args2] as const;
  }, [args1, args2]);

  const enabled = useMemo(() => {
    const parsed1 = parseFloat(args1.value);
    const parsed2 = parseFloat(args2.value);
    return !isNaN(parsed1) && parsed1 > 0 && !isNaN(parsed2) && parsed2 > 0;
  }, [args1.value, args2.value]);

  return useQuery({
    queryKey,
    queryKeyHashFn: ([key, args1, args2]) => {
      return [key, ...Object.values(args1), ...Object.values(args2)].join('-');
    },
    queryFn: async ({ queryKey: [, args1, args2] }) => {
      const [v1, v2] = await Promise.all([
        getUsdValue(args1),
        getUsdValue(args2),
      ]);
      // return percentage difference
      return ((v2 - v1) / v1) * 100;
    },
    staleTime: 1000 * 60, // 1 minute
    enabled,
  });
}

async function getUsdValue(args: Args) {
  let coingeckoID: string;

  if (args.coingeckoID) {
    coingeckoID = args.coingeckoID;
  } else {
    const assets = getAssets(args.chainId);
    const asset =
      assets.find((asset) => asset.base === args.denom) ||
      raise(`getUsdValue error: ${args.denom} not found in ${args.chainId}`);
    coingeckoID =
      asset.coingecko_id ||
      raise(
        `getUsdValue error: ${args.denom} does not have a 'coingecko_id' in ${args.chainId}`
      );
  }

  const usd = await getUsdPrice({ coingeckoID });
  return parseFloat(args.value) * usd;
}
