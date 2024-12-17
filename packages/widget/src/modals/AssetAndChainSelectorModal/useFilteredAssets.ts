import { matchSorter } from "match-sorter";
import { useMemo } from "react";
import { GroupedAsset } from "./AssetAndChainSelectorModal";

export type useFilteredAssetsProps = {
  groupedAssetsByRecommendedSymbol: GroupedAsset[] | undefined;
  searchQuery: string;
};

const PRIVILEGED_ASSETS = ["ATOM", "USDC", "USDT", "ETH", "TIA", "OSMO", "NTRN", "INJ"];

export const EXCLUDED_TOKEN_COMBINATIONS: {
  id: string;
  chainIDs: string[];
}[] = [
    { id: "SOL", chainIDs: ["solana"] },
  ];

export const useFilteredAssets = ({
  groupedAssetsByRecommendedSymbol,
  searchQuery,
}: useFilteredAssetsProps) => {
  const filteredAssets = useMemo(() => {
    if (!groupedAssetsByRecommendedSymbol) return;

    // Filter out excluded assets first
    const sanitizedAssets = groupedAssetsByRecommendedSymbol
      .map((group) => {
        const allowedAssets = group.assets.filter((asset) => {
          const isExcluded = EXCLUDED_TOKEN_COMBINATIONS.some(
            (ex) => ex.id === group.id && ex.chainIDs.includes(asset.chainID)
          );
          return !isExcluded;
        });

        if (allowedAssets.length === 0) return null;
        return { ...group, assets: allowedAssets };
      })
      .filter(Boolean) as GroupedAsset[];

    return matchSorter(sanitizedAssets, searchQuery, {
      keys: ["id", "name"],
    }).sort((assetA, assetB) => {
      const bothHaveZeroBalance = assetA.totalUsd === 0 && assetB.totalUsd === 0;

      if (bothHaveZeroBalance) {
        const aPrivilegedIndex = PRIVILEGED_ASSETS.indexOf(assetA.id);
        const bPrivilegedIndex = PRIVILEGED_ASSETS.indexOf(assetB.id);

        const bothArePrivileged = aPrivilegedIndex !== -1 && bPrivilegedIndex !== -1;
        if (bothArePrivileged) {
          return aPrivilegedIndex - bPrivilegedIndex;
        }

        if (bPrivilegedIndex !== -1) return 1;
        if (aPrivilegedIndex !== -1) return -1;
      }

      return assetB.totalUsd - assetA.totalUsd;
    });
  }, [groupedAssetsByRecommendedSymbol, searchQuery]);

  return filteredAssets;
};
