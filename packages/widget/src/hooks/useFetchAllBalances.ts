import { useAtomValue, useSetAtom } from "jotai";
import { useGetAccount } from "./useGetAccount";
import { skipAllBalancesRequestAtom } from "@/state/balances";
import { skipAssetsAtom, skipChainsAtom } from "@/state/skipClient";
import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { connectedAddressesAtom } from "@/state/wallets";
import { ChainType } from "@skip-go/client";

export const useFetchAllBalances = () => {
  const getAccount = useGetAccount();
  const { data: assets } = useAtomValue(skipAssetsAtom);
  const setSkipAllBalancesRequest = useSetAtom(skipAllBalancesRequestAtom);
  const { data: chains } = useAtomValue(skipChainsAtom);
  const connectedAddresses = useAtomValue(connectedAddressesAtom);
  const evmConnectedAddress = useMemo(() => {
    if (!connectedAddresses) return;
    const chainIds = Object.keys(connectedAddresses);
    const _evmChainId = chainIds.find((chainId) => {
      const chain = chains?.find((chain) => chain.chainId === chainId);
      return chain?.chainType === ChainType.Evm;
    });
    return _evmChainId && connectedAddresses?.[_evmChainId];
  }, [connectedAddresses, chains]);

  const { chainId: evmChainId } = useAccount();

  const allBalancesRequest = useMemo(() => {
    if (!assets || !chains) return {};

    return assets.reduce(
      (acc, asset) => {
        const chain = chains.find((chain) => chain.chainId === asset.chainId);
        if (!chain) return acc;

        const evmAddress = evmConnectedAddress ?? getAccount(String(evmChainId))?.address;
        const addressToUse =
          chain.chainType === ChainType.Evm ? evmAddress : getAccount(asset.chainId)?.address;

        if (addressToUse && !acc[asset.chainId]) {
          acc[asset.chainId] = { address: addressToUse };
        }

        return acc;
      },
      {} as Record<string, { address: string }>,
    );
  }, [assets, getAccount, chains, evmConnectedAddress, evmChainId]);

  useQuery({
    queryKey: ["all-balances-request", allBalancesRequest],
    queryFn: () => {
      setSkipAllBalancesRequest({ chains: allBalancesRequest });
      return { chains: allBalancesRequest };
    },
  });
};
