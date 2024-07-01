import { Bridge } from '@skip-go/core';
import { useQuery } from '@tanstack/react-query';
import { useSkipClient } from './use-skip-client';

export type UseBridgesQueryArgs<T = Bridge[]> = {
  enabled?: boolean;
  select?: (arr?: Bridge[]) => T;
};

export function useBridges<T = Bridge[]>(args: UseBridgesQueryArgs<T> = {}) {
  const { select = (t) => t as T } = args;

  const skipClient = useSkipClient();

  return useQuery({
    queryKey: ['USE_BRIDGES'],
    queryFn: async () => {
      const bridges = await skipClient.bridges();
      return bridges;
    },
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    select,
    enabled: args.enabled,
  });
}

export function useBridgeByID(bridgeID?: Bridge['id']) {
  return useBridges({
    select: (bridges) => (bridges ?? []).find(({ id }) => id === bridgeID),
    enabled: !!bridgeID,
  });
}
