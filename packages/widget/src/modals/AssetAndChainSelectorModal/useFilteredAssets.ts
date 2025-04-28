import { useMemo } from "react";
import { GroupedAsset } from "./AssetAndChainSelectorModal";
import { useAtomValue } from "jotai";
import { assetSymbolsSortedToTopAtom } from "@/state/assetSymbolsSortedToTop";

export type useFilteredAssetsProps = {
  groupedAssetsByRecommendedSymbol: GroupedAsset[] | undefined;
  searchQuery: string;
};

export const EXCLUDED_TOKEN_COMBINATIONS: {
  id: string;
  chainIDs: string[];
}[] = [{ id: "SOL", chainIDs: ["solana"] }];

export const useFilteredAssets = ({
  groupedAssetsByRecommendedSymbol,
  searchQuery,
}: useFilteredAssetsProps) => {
  const assetSymbolsSortedToTop = useAtomValue(assetSymbolsSortedToTopAtom);

  const filteredAssets = useMemo(() => {
    if (!groupedAssetsByRecommendedSymbol) return;

    // Filter out excluded assets first
    const sanitizedAssets = groupedAssetsByRecommendedSymbol
      .map((group) => {
        const allowedAssets = group.assets.filter((asset) => {
          const isExcluded = EXCLUDED_TOKEN_COMBINATIONS.some(
            (ex) => ex.id === group.id && ex.chainIDs.includes(asset.chainId),
          );
          return !isExcluded;
        });

        if (allowedAssets.length === 0) return null;
        return { ...group, assets: allowedAssets };
      })
      .filter(Boolean) as GroupedAsset[];

    return sanitizedAssets
      .filter((asset) => asset.id?.toLowerCase()?.includes(searchQuery.toLowerCase()))
      .sort((assetA, assetB) => {
        // 1. Sort by totalUsd descending
        if (assetA.totalUsd !== assetB.totalUsd) {
          return assetB.totalUsd - assetA.totalUsd;
        }

        // 2. Sort by totalAmount descending
        if (assetA.totalAmount !== assetB.totalAmount) {
          return assetB.totalAmount - assetA.totalAmount;
        }

        // 3. Sort by privileged asset
        const privA = assetSymbolsSortedToTop.indexOf(assetA.id);
        const privB = assetSymbolsSortedToTop.indexOf(assetB.id);

        if (privA !== -1 && privB !== -1) {
          return privA - privB;
        }
        if (privA !== -1) return -1;
        if (privB !== -1) return 1;

        return 0;
      });
  }, [assetSymbolsSortedToTop, groupedAssetsByRecommendedSymbol, searchQuery]);

  return filteredAssets;
};
