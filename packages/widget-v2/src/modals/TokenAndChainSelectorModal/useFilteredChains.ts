import { matchSorter } from "match-sorter";
import { useMemo } from "react";
import { ChainWithAsset, GroupedAsset } from "./TokenAndChainSelectorModal";
import { skipChainsAtom } from "@/state/skipClient";
import { useAtomValue } from "jotai";
import { useGetBalance } from "@/hooks/useGetBalance";
import { chainFilterAtom } from "@/state/swapPage";

export type useFilteredChainsProps = {
  selectedGroup: GroupedAsset | undefined;
  searchQuery: string;
  context: "source" | "destination";
};

export const useFilteredChains = ({
  selectedGroup,
  searchQuery,
  context,
}: useFilteredChainsProps) => {
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
      .filter((chain) => {
        if (!chain) return false;
        // Check if chain is allowed based on chainFilter
        const isAllowedByFilter = !chainFilter?.[context] ||
          Object.keys(chainFilter[context]).includes(chain.chainID);

        // For source context, exclude Penumbra chains
        const isPenumbraAllowed = context !== "source" ||
          !chain.chainID.includes("penumbra");

        return isAllowedByFilter && isPenumbraAllowed;
      }) as ChainWithAsset[];

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
  }, [chainFilter, chains, context, getBalance, searchQuery, selectedGroup]);

  return filteredChains;
};
