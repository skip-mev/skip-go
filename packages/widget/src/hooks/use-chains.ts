import { Chain as SkipChain } from '@skip-router/core';
import { useQuery } from '@tanstack/react-query';
import { useSkipClient } from './use-skip-client';
import { chainIdToName } from '../chains';
import { chainIdToPrettyName } from '../chains/pretty';
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

  return useQuery({
    queryKey: ['USE_CHAINS'],
    queryFn: async () => {
      const chains = await skipClient.chains({
        includeEVM: true,
        includeSVM: true,
        onlyTestnets: useSwapWidgetUIStore.getState().onlyTestnet,
      });

      return chains
        .map((chain): Chain => {
          return {
            ...chain,
            chainName: chainIdToName[chain.chainID] || chain.chainName,
            prettyName: chainIdToPrettyName[chain.chainID] || chain.chainName,
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
