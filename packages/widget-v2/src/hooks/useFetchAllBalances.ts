import { useAtomValue, useSetAtom } from "jotai";
import { useGetAccount } from "./useGetAccount";
import { skipAllBalancesRequestAtom } from "@/state/balances";
import { skipAssetsAtom, skipChainsAtom } from "@/state/skipClient";
import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useFetchAllBalances = () => {
  const getAccount = useGetAccount();
  const { data: assets } = useAtomValue(skipAssetsAtom);
  const setSkipAllBalancesRequest = useSetAtom(skipAllBalancesRequestAtom.debouncedValueAtom);
  const { data: chains } = useAtomValue(skipChainsAtom);

  const { chainId: evmChainId } = useAccount();

  const allBalancesRequest = useMemo(() => {
    return assets?.reduce((acc, asset) => {
      const address = getAccount(asset.chainID)?.address;
      const chain = chains?.find((chain) => chain.chainID === asset.chainID);
      const isEVM = chain?.chainType === "evm";
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

  // using useQuery to trigger the debouncedValueAtom
  useQuery({
    queryKey: ["all-balances-request", allBalancesRequest],
    queryFn: () => {
      if (allBalancesRequest) {
        setSkipAllBalancesRequest({
          chains: allBalancesRequest || {}
        });
      }
      return null;
    }
  });
};
