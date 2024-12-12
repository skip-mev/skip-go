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

  const allBalancesRequest = useMemo(() => {
    if (!assets || !chains) return {};

    return assets.reduce((acc, asset) => {
      const chain = chains.find((c) => c.chainID === asset.chainID);
      const isEVM = chain?.chainType === ChainType.EVM;
      const evmAddress = isEVM && evmChainId ? getAccount(String(evmChainId))?.address : undefined;
      const addressToUse = evmAddress || getAccount(asset.chainID)?.address;

      if (addressToUse && !acc[asset.chainID]) {
        acc[asset.chainID] = { address: addressToUse };
      }

      return acc;
    }, {} as Record<string, { address: string }>);
  }, [assets, chains, evmChainId, getAccount]);

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
  });
};
