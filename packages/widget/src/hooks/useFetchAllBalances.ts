import { useAtomValue, useSetAtom } from "jotai";
import { useGetAccount } from "./useGetAccount";
import { skipAllBalancesRequestAtom } from "@/state/balances";
import { skipAssetsAtom, skipChainsAtom } from "@/state/skipClient";
import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { ChainType } from "@skip-go/client";

export const useFetchAllBalances = () => {
  const getAccount = useGetAccount();
  const { data: assets, isFetched: assetsFetched } = useAtomValue(skipAssetsAtom);
  const setSkipAllBalancesRequest = useSetAtom(skipAllBalancesRequestAtom);
  const { data: chains } = useAtomValue(skipChainsAtom);

  const { chainId: evmChainId } = useAccount();
  console.log('assets', assets)

  const allBalancesRequest = useMemo(() => {
    return assets?.reduce((acc, asset) => {
      const address = getAccount(asset.chainID)?.address;
      const chain = chains?.find((chain) => chain.chainID === asset.chainID);
      const isEVM = chain?.chainType === ChainType.EVM;
      const evmAddress = (isEVM && evmChainId) ? getAccount(String(evmChainId))?.address : undefined;
      if (isEVM && evmAddress) {
        if (!acc[asset.chainID]) {
          acc[asset.chainID] = {
            address: evmAddress,
          };
        }
      } else if (address) {
        if (!acc[asset.chainID]) {
          acc[asset.chainID] = {
            address: address,
          };
        }
      }
      return acc;
    }, {} as Record<string, { address: string }>);
  }, [assets, getAccount, chains, evmChainId]);

  useQuery({
    queryKey: ["all-balances-request", allBalancesRequest],
    queryFn: () => {
      if (!allBalancesRequest || Object.keys(allBalancesRequest).length === 0) {
        throw new Error("No balance request provided");
      }
      setSkipAllBalancesRequest({ chains: allBalancesRequest });
      return { chains: allBalancesRequest };

    },
    enabled: assetsFetched,
  })
}
