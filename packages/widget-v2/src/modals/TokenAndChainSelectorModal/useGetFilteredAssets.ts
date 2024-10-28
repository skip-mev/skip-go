import { matchSorter } from "match-sorter";
import { useMemo } from "react";
import { GroupedAsset } from "./TokenAndChainSelectorModal";

export type useGetFilteredAssetsProps = {
  groupedAssetsByRecommendedSymbol: GroupedAsset[] | undefined;
  searchQuery: string;
};

const PRIVILEGED_ASSETS = ["ATOM", "USDC", "USDT", "ETH", "TIA", "OSMO", "NTRN", "INJ"];

export const useGetFilteredAssets = ({
  groupedAssetsByRecommendedSymbol,
  searchQuery,
}: useGetFilteredAssetsProps) => {

  const filteredAssets = useMemo(() => {
    if (!groupedAssetsByRecommendedSymbol) return;
    return matchSorter(groupedAssetsByRecommendedSymbol, searchQuery, {
      keys: ["id"],
    }).sort((assetA, assetB) => {
      const bothHaveZeroBalance = assetA.totalUsd === 0 && assetB.totalUsd === 0;

      // If both assets have zero balance, sort by privileged status
      if (bothHaveZeroBalance) {
        const aPrivilegedIndex = PRIVILEGED_ASSETS.indexOf(assetA.id);
        const bPrivilegedIndex = PRIVILEGED_ASSETS.indexOf(assetB.id);

        const bothArePrivileged = aPrivilegedIndex !== -1 && bPrivilegedIndex !== -1;

        if (bothArePrivileged) {
          // Sort by privilege order
          return aPrivilegedIndex - bPrivilegedIndex;
        }

        // If only one is privileged, it should come first
        if (bPrivilegedIndex !== -1) return 1;
        if (aPrivilegedIndex !== -1) return -1;
      }

      // Sort by USD value (higher values first)
      return assetB.totalUsd - assetA.totalUsd;
    });
  }, [groupedAssetsByRecommendedSymbol, searchQuery]);

  return filteredAssets;
};
