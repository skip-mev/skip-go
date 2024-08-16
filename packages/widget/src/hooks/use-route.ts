import {
  BridgeType,
  ExperimentalFeature,
  RouteResponse,
  SmartSwapOptions,
  SwapVenueRequest,
} from '@skip-go/client';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useState, useMemo, useEffect } from 'react';
import { useSkipClient } from './use-skip-client';

export interface RouteConfig {
  experimentalFeatures?: ExperimentalFeature[];
  allowMultiTx?: boolean;
  allowUnsafe?: boolean;
  bridges?: BridgeType[];
  swapVenues?: SwapVenueRequest[];
  smartSwapOptions?: SmartSwapOptions;
}

interface UseRouteArgs extends RouteConfig {
  direction: 'swap-in' | 'swap-out';
  amount: string;
  sourceAsset?: string;
  sourceAssetChainID?: string;
  destinationAsset?: string;
  destinationAssetChainID?: string;
  enabled?: boolean;
}

export function useRoute({
  direction,
  amount,
  sourceAsset,
  sourceAssetChainID,
  destinationAsset,
  destinationAssetChainID,
  enabled,
  swapVenues,
  bridges,
  experimentalFeatures = ['hyperlane'],
  allowMultiTx = true,
  allowUnsafe = true,
  smartSwapOptions = {
    splitRoutes: true,
    evmSwaps: true,
  },
}: UseRouteArgs): UseQueryResult<RouteResponse | undefined> {
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
        swapVenues,
        experimentalFeatures,
        bridges,
        smartSwapOptions,
      ] as const,
    [
      amount,
      destinationAsset,
      destinationAssetChainID,
      direction,
      sourceAsset,
      sourceAssetChainID,
      swapVenues,
      experimentalFeatures,
      bridges,
      smartSwapOptions,
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
        swapVenues,
        experimentalFeatures,
        bridges,
        smartSwapOptions,
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
                swapVenues,
                bridges,
                allowMultiTx,
                allowUnsafe,
                experimentalFeatures,
                smartRelay: true,
                smartSwapOptions,
              }
            : {
                amountOut: amount,
                sourceAssetDenom: sourceAsset,
                sourceAssetChainID: sourceAssetChainID,
                destAssetDenom: destinationAsset,
                destAssetChainID: destinationAssetChainID,
                swapVenues,
                bridges,
                allowMultiTx,
                allowUnsafe,
                experimentalFeatures,
                smartRelay: true,
                smartSwapOptions,
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
