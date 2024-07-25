import { Chain as SkipChain } from '@skip-go/core';
import { useQuery } from '@tanstack/react-query';
import { useSkipClient } from './use-skip-client';
import { useSwapWidgetUIStore } from '../store/swap-widget';

export type Chain = SkipChain & {
  prettyName: string;
};

export type UseChainsQueryArgs<T = Chain[]> = {
  enabled?: boolean;
  select?: (arr?: Chain[]) => T;
};

export function useChains<T = Chain[]>(args: UseChainsQueryArgs<T> = {}) {
  const { select = (t) => t as T } = args;
  const skipClient = useSkipClient();
  const onlyTestnet = useSwapWidgetUIStore((state) => state.onlyTestnet);

  return useQuery({
    queryKey: ['USE_CHAINS', onlyTestnet],
    queryFn: async () => {
      const chains = await skipClient.chains({
        includeEVM: true,
        includeSVM: true,
        onlyTestnets: onlyTestnet,
      });

      return chains
        .map((chain): Chain => {
          return {
            ...chain,
            chainName: chain.chainName,
            prettyName: chain.prettyName || chain.chainName,
            logoURI: chain.logoURI || 'https://api.dicebear.com/6.x/shapes/svg',
          };
        })
        .sort((chainA, chainB) => {
          return chainA.prettyName.localeCompare(chainB.prettyName);
        });
    },
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    select,
    enabled: args.enabled,
  });
}

export function useChainByID(chainID?: string) {
  return useChains({
    select: (chains) => (chains ?? []).find((c) => c.chainID === chainID),
    enabled: Boolean(chainID),
  });
}
