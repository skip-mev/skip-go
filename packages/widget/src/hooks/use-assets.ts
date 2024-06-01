import { AssetsRequest } from '@skip-router/core';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useSkipClient } from './use-skip-client';

export function useAssets(options: AssetsRequest = {}) {
  const skipClient = useSkipClient();

  const queryKey = useMemo(() => ['solve-assets', options] as const, [options]);

  return useQuery({
    queryKey,
    queryFn: ({ queryKey: [, options] }) => {
      return skipClient.assets({
        includeEvmAssets: true,
        includeCW20Assets: true,
        includeSvmAssets: true,
        ...options,
      });
    },
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    select: (assets) => {
      return Object.fromEntries(
        Object.entries(assets).map(([chainID, chainAssets]) => {
          return [
            chainID,
            chainAssets.filter((asset) => {
              return !(
                asset.denom === 'solana-devnet-native' ||
                asset.denom === 'solana-native'
              );
            }),
          ];
        })
      );
    },
  });
}
