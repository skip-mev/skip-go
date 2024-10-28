import { matchSorter } from "match-sorter";
import { useMemo } from "react";
import { ChainWithAsset, GroupedAsset } from "./TokenAndChainSelectorModal";
import { skipChainsAtom } from "@/state/skipClient";
import { useAtomValue } from "jotai";
import { useGetBalance } from "@/hooks/useGetBalance";
import { chainFilterAtom } from "@/state/swapPage";

export type useGetFilteredChainsProps = {
  selectedGroup: GroupedAsset | undefined;
  searchQuery: string;
  context: "source" | "destination";
};

export const useGetFilteredChains = ({
  selectedGroup,
  searchQuery,
  context,
}: useGetFilteredChainsProps) => {
  const { data: chains } = useAtomValue(skipChainsAtom);
  const chainFilter = useAtomValue(chainFilterAtom);
  const getBalance = useGetBalance();

  const filteredChains = useMemo(() => {
    if (!selectedGroup || !chains) return;

    const chainsWithAssets = selectedGroup.assets
      .map((asset) => {
        const chain = chains.find((c) => c.chainID === asset.chainID);
        return chain ? { ...chain, asset } : null;
      })
      .filter((chain) => chain !== undefined) as ChainWithAsset[];

    console.log(chainFilter);
    console.log(chainsWithAssets);

    return matchSorter(chainsWithAssets, searchQuery, {
      keys: ["prettyName", "chainName", "chainID"],
    }).sort((chainWithAssetA, chainWithAssetB) => {
      const usdValueA = Number(getBalance(chainWithAssetA.chainID, chainWithAssetA.asset.denom)?.valueUSD ?? 0);
      const usdValueB = Number(getBalance(chainWithAssetB.chainID, chainWithAssetB.asset.denom)?.valueUSD ?? 0);

      // 1. Sort by USD value first
      if (usdValueB !== usdValueA) {
        return usdValueB - usdValueA;
      }

      const chainAIsOrigin = chainWithAssetA.asset.originChainID === chainWithAssetA.chainID;
      const chainBIsOrigin = chainWithAssetB.asset.originChainID === chainWithAssetB.chainID;

      // 2. Sort by whether it's the origin chain
      if (chainBIsOrigin) return 1;
      if (chainAIsOrigin) return -1;

      return 0;
    });
  }, [chains, getBalance, searchQuery, selectedGroup]);

  return filteredChains;
};
