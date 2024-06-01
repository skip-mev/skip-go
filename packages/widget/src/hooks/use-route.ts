import { ExperimentalFeature, SwapVenue } from '@skip-router/core';
import { useQuery } from '@tanstack/react-query';
import { useState, useMemo, useEffect } from 'react';
import { useSkipClient } from './use-skip-client';

interface UseRouteArgs {
  direction: 'swap-in' | 'swap-out';
  amount: string;
  sourceAsset?: string;
  sourceAssetChainID?: string;
  destinationAsset?: string;
  destinationAssetChainID?: string;
  enabled?: boolean;
  swapVenue?: SwapVenue;
  experimentalFeatures?: ExperimentalFeature[];
}

export function useRoute({
  direction,
  amount,
  sourceAsset,
  sourceAssetChainID,
  destinationAsset,
  destinationAssetChainID,
  enabled,
  swapVenue,
  experimentalFeatures,
}: UseRouteArgs) {
  const skipClient = useSkipClient();

  const [refetchCount, setRefetchCount] = useState(0);
  const [isError, setIsError] = useState(false);

  const queryKey = useMemo(
    () =>
      [
        'solve-route',
        direction,
        amount,
        sourceAsset,
        destinationAsset,
        sourceAssetChainID,
        destinationAssetChainID,
        swapVenue,
        experimentalFeatures,
      ] as const,
    [
      amount,
      destinationAsset,
      destinationAssetChainID,
      direction,
      sourceAsset,
      sourceAssetChainID,
      swapVenue,
      experimentalFeatures,
    ]
  );

  const query = useQuery({
    queryKey,
    queryFn: async ({
      queryKey: [
        ,
        direction,
        amount,
        sourceAsset,
        destinationAsset,
        sourceAssetChainID,
        destinationAssetChainID,
        swapVenue,
        experimentalFeatures,
      ],
    }) => {
      if (
        !sourceAsset ||
        !sourceAssetChainID ||
        !destinationAsset ||
        !destinationAssetChainID
      ) {
        return;
      }
      try {
        const route = await skipClient.route(
          direction === 'swap-in'
            ? {
                amountIn: amount,
                sourceAssetDenom: sourceAsset,
                sourceAssetChainID: sourceAssetChainID,
                destAssetDenom: destinationAsset,
                destAssetChainID: destinationAssetChainID,
                swapVenue,
                allowMultiTx: true,
                allowUnsafe: true,
                experimentalFeatures,
                smartRelay: true,
                smartSwapOptions: {
                  splitRoutes: true,
                },
              }
            : {
                amountOut: amount,
                sourceAssetDenom: sourceAsset,
                sourceAssetChainID: sourceAssetChainID,
                destAssetDenom: destinationAsset,
                destAssetChainID: destinationAssetChainID,
                swapVenue,
                allowMultiTx: true,
                allowUnsafe: true,
                experimentalFeatures,
                smartRelay: true,
                smartSwapOptions: {
                  splitRoutes: true,
                },
              }
        );

        if (!route.operations) {
          throw new Error('no routes found');
        }

        return route;
      } catch (error) {
        if (
          // @ts-expect-error - error
          String(error?.message).toLowerCase().includes('no routes found') ||
          // @ts-expect-error - error
          String(error?.message).toLowerCase().includes('relay')
        ) {
          setIsError(true);
        }
        throw error;
      }
    },
    refetchInterval: isError ? false : refetchCount < 10 ? 1000 * 10 : false,
    retry: false,
    enabled:
      enabled &&
      !!sourceAsset &&
      !!destinationAsset &&
      !!sourceAssetChainID &&
      !!destinationAssetChainID &&
      amount !== '0',
  });

  useEffect(() => {
    if (query.isRefetching) {
      setRefetchCount((count) => count + 1);
    }
  }, [query.isRefetching]);

  useEffect(() => {
    setIsError(false);
    setRefetchCount(0);
  }, [queryKey]);

  return query;
}
