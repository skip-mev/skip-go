import { useMemo } from "react";
import { GroupedAsset } from "./AssetAndChainSelectorModal";
import { ibcEurekaHighlightedAssetsAtom } from "@/state/ibcEurekaHighlightedAssets";
import { useAtomValue } from "jotai";

export type useFilteredAssetsProps = {
  groupedAssetsByRecommendedSymbol: GroupedAsset[] | undefined;
  searchQuery: string;
};

const PRIVILEGED_ASSETS = ["ATOM", "USDC", "USDT", "ETH", "TIA", "OSMO", "NTRN", "INJ"];

export const EXCLUDED_TOKEN_COMBINATIONS: {
  id: string;
  chainIDs: string[];
}[] = [{ id: "SOL", chainIDs: ["solana"] }];

export const useFilteredAssets = ({
  groupedAssetsByRecommendedSymbol,
  searchQuery,
}: useFilteredAssetsProps) => {
  const ibcEurekaHighlightedAssets = useAtomValue(ibcEurekaHighlightedAssetsAtom);

  const filteredAssets = useMemo(() => {
    if (!groupedAssetsByRecommendedSymbol) return;

    // Filter out excluded assets first
    const sanitizedAssets = groupedAssetsByRecommendedSymbol
      .map((group) => {
        const allowedAssets = group.assets.filter((asset) => {
          const isExcluded = EXCLUDED_TOKEN_COMBINATIONS.some(
            (ex) => ex.id === group.id && ex.chainIDs.includes(asset.chainID),
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
        if (assetB.totalUsd !== 0 || assetA.totalUsd !== 0) {
          return assetB.totalUsd - assetA.totalUsd;
        }

        if (assetB.totalAmount !== 0 || assetA.totalAmount !== 0) {
          return assetB.totalAmount - assetA.totalAmount;
        }

        const assetAIbcEureka = assetA.assets.find((asset) =>
          ibcEurekaHighlightedAssets.includes(asset.denom),
        );
        const assetBIbcEureka = assetB.assets.find((asset) =>
          ibcEurekaHighlightedAssets.includes(asset.denom),
        );
        const assetAIbcEurekaIndex = assetAIbcEureka?.denom
          ? ibcEurekaHighlightedAssets.indexOf(assetAIbcEureka.denom)
          : -1;
        const assetBIbcEurekaIndex = assetBIbcEureka?.denom
          ? ibcEurekaHighlightedAssets.indexOf(assetBIbcEureka.denom)
          : -1;

        if (assetAIbcEurekaIndex !== -1 && assetBIbcEurekaIndex !== -1) {
          return assetAIbcEurekaIndex - assetBIbcEurekaIndex;
        }

        if (assetAIbcEurekaIndex !== -1) return 1;
        if (assetBIbcEurekaIndex !== -1) return -1;

        const aPrivilegedIndex = PRIVILEGED_ASSETS.indexOf(assetA.id);
        const bPrivilegedIndex = PRIVILEGED_ASSETS.indexOf(assetB.id);

        const bothArePrivileged = aPrivilegedIndex !== -1 && bPrivilegedIndex !== -1;
        if (bothArePrivileged) {
          return aPrivilegedIndex - bPrivilegedIndex;
        }

        if (bPrivilegedIndex !== -1) return 1;
        if (aPrivilegedIndex !== -1) return -1;

        return 0;
      });
  }, [groupedAssetsByRecommendedSymbol, ibcEurekaHighlightedAssets, searchQuery]);

  return filteredAssets;
};
