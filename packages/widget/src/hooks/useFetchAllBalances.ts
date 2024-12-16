import { useAtomValue, useSetAtom } from 'jotai';
import { useGetAccount } from './useGetAccount';
import { skipAllBalancesRequestAtom } from '@/state/balances';
import { skipAssetsAtom, skipChainsAtom } from '@/state/skipClient';
import { useAccount } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { connectedAddressesAtom } from '@/state/wallets';
import { ChainType } from '@skip-go/client';

export const useFetchAllBalances = () => {
  const getAccount = useGetAccount();
  const { data: assets } = useAtomValue(skipAssetsAtom);
  const setSkipAllBalancesRequest = useSetAtom(
    skipAllBalancesRequestAtom.debouncedValueAtom
  );
  const { data: chains } = useAtomValue(skipChainsAtom);
  const connectedAddresses = useAtomValue(connectedAddressesAtom);
  const evmConnectedAddress = useMemo(() => {
    if (!connectedAddresses) return;
    const chainIds = Object.keys(connectedAddresses);
    const evmChainId = chainIds.find((chainId) => {
      const chain = chains?.find((chain) => chain.chainID === chainId);
      return chain?.chainType === ChainType.EVM;
    });
    return evmChainId && connectedAddresses?.[evmChainId];
  }, [
    connectedAddresses,
    chains,
  ]);


  const { chainId: evmChainId } = useAccount();

  const allBalancesRequest = useMemo(() => {
    return assets?.reduce((acc, asset) => {
      const chain = chains?.find((chain) => chain.chainID === asset.chainID);
      const isEVM = chain?.chainType === ChainType.EVM;
      const evmAddress = evmConnectedAddress ?? (evmChainId && getAccount(String(evmChainId))?.address)

      const address = isEVM
        ? evmAddress
        : getAccount(asset.chainID)?.address;

      if (address && !acc[asset.chainID]) {
        acc[asset.chainID] = { address };
      }

      return acc;
    }, {} as Record<string, { address: string }>);
  }, [assets, getAccount, chains, evmChainId, evmConnectedAddress]);

  // using useQuery to trigger the debouncedValueAtom
  useQuery({
    queryKey: ['all-balances-request', allBalancesRequest],
    queryFn: () => {
      if (allBalancesRequest) {
        setSkipAllBalancesRequest({
          chains: allBalancesRequest || {},
        });
      }
      return null;
    },
  });
};
