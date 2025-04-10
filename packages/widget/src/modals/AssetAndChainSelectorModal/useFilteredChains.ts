import { useMemo } from "react";
import { ChainWithAsset, GroupedAsset } from "./AssetAndChainSelectorModal";
import { skipChainsAtom } from "@/state/skipClient";
import { useAtomValue } from "jotai";
import { useGetBalance } from "@/hooks/useGetBalance";
import { filterAtom, filterOutAtom } from "@/state/swapPage";
import { EXCLUDED_TOKEN_COMBINATIONS } from "./useFilteredAssets";
import { cosmosWalletAtom } from "@/state/wallets";
import { ibcEurekaHighlightedAssetsAtom } from "@/state/ibcEurekaHighlightedAssets";
import { hideAssetsUnlessWalletTypeConnectedAtom } from "@/state/hideAssetsUnlessWalletTypeConnected";

export type useFilteredChainsProps = {
  selectedGroup: GroupedAsset | undefined;
  searchQuery?: string;
  context: "source" | "destination";
};

export const useFilteredChains = ({
  selectedGroup,
  searchQuery = "",
  context,
}: useFilteredChainsProps) => {
  const { data: chains } = useAtomValue(skipChainsAtom);
  const hideAssetsUnlessWalletTypeConnected = useAtomValue(hideAssetsUnlessWalletTypeConnectedAtom);
  const getBalance = useGetBalance();

  const cosmosWallet = useAtomValue(cosmosWalletAtom);
  const cosmosWalletConnected = cosmosWallet !== undefined;
  const filter = useAtomValue(filterAtom);
  const filterOut = useAtomValue(filterOutAtom);

  const ibcEurekaHighlightedAssets = useAtomValue(ibcEurekaHighlightedAssetsAtom);

  const filteredChains = useMemo(() => {
    if (!selectedGroup || !chains) return;

    // Filter out excluded assets before mapping to chains
    const allowedAssets = selectedGroup.assets.filter((asset) => {
      const isExcluded = EXCLUDED_TOKEN_COMBINATIONS.some(
        (ex) => ex.id === selectedGroup.id && ex.chainIDs.includes(asset.chainID),
      );
      return !isExcluded;
    });

    const chainsWithAssets = allowedAssets
      .map((asset) => {
        const chain = chains.find((c) => c.chainID === asset.chainID);
        return chain ? ({ ...chain, asset } as ChainWithAsset) : null;
      })
      .filter((chain) => {
        if (!chain) return false;

        const allowedChainIds = filter?.[context];
        const blockedChainIds = filterOut?.[context];

        const isAllowedByFilter = !allowedChainIds || chain.chainID in allowedChainIds;
        const isFilteredOutByFilter = Boolean(
          blockedChainIds?.[chain.chainID] && blockedChainIds?.[chain.chainID] === undefined,
        );

        const isPenumbraAllowed = context !== "source" || !chain.chainID.startsWith("penumbra");

        return isAllowedByFilter && isPenumbraAllowed && !isFilteredOutByFilter;
      }) as ChainWithAsset[];

    const filtered = chainsWithAssets
      .filter((chainWithAsset) => {
        const { chainName, prettyName } = chainWithAsset;
        const chainNameIncludesSearchQuery = chainName
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const prettyNameIncludesSearchQuery = prettyName
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        return chainNameIncludesSearchQuery || prettyNameIncludesSearchQuery;
      })
      .sort((chainWithAssetA, chainWithAssetB) => {
        const usdValueA = Number(
          getBalance(chainWithAssetA.chainID, chainWithAssetA.asset.denom)?.valueUSD ?? 0,
        );
        const usdValueB = Number(
          getBalance(chainWithAssetB.chainID, chainWithAssetB.asset.denom)?.valueUSD ?? 0,
        );

        const amountA = Number(
          getBalance(chainWithAssetA.chainID, chainWithAssetA.asset.denom)?.amount ?? 0,
        );
        const amountB = Number(
          getBalance(chainWithAssetB.chainID, chainWithAssetB.asset.denom)?.amount ?? 0,
        );

        // 1. Sort by USD value descending
        if (usdValueA !== usdValueB) {
          return usdValueB - usdValueA;
        }

        // 2. Sort by raw amount descending
        if (amountA !== amountB) {
          return amountB - amountA;
        }

        // 3. Sort by ibcEurekaHighlightedAssets index
        const indexA = ibcEurekaHighlightedAssets.indexOf(chainWithAssetA.asset.denom);
        const indexB = ibcEurekaHighlightedAssets.indexOf(chainWithAssetB.asset.denom);

        const aIsHighlighted = indexA !== -1;
        const bIsHighlighted = indexB !== -1;

        if (aIsHighlighted && bIsHighlighted) {
          return indexA - indexB;
        }
        if (aIsHighlighted) return -1;
        if (bIsHighlighted) return 1;

        // 4. Sort by chainName including asset denom/symbol
        const aMatchesName = chainWithAssetA.chainName
          ?.toLowerCase()
          .includes(chainWithAssetA.asset.recommendedSymbol?.toLowerCase() ?? "");
        const bMatchesName = chainWithAssetB.chainName
          ?.toLowerCase()
          .includes(chainWithAssetB.asset.recommendedSymbol?.toLowerCase() ?? "");

        if (aMatchesName && !bMatchesName) return -1;
        if (bMatchesName && !aMatchesName) return 1;

        // 5. Sort by origin chain
        const aIsOrigin = chainWithAssetA.asset.originChainID === chainWithAssetA.chainID;
        const bIsOrigin = chainWithAssetB.asset.originChainID === chainWithAssetB.chainID;

        if (aIsOrigin && !bIsOrigin) return -1;
        if (bIsOrigin && !aIsOrigin) return 1;

        return 0;
      });

    return filtered
      .filter((chainWithAsset) => {
        if (
          hideAssetsUnlessWalletTypeConnected &&
          !cosmosWalletConnected &&
          chainWithAsset?.chainName === "sei" &&
          chainWithAsset?.chainType === "cosmos"
        ) {
          // If the user does not have a cosmos wallet connected and the asset is the "cosmos" version of SEI, then hide it.
          return false;
        }
        return true;
      })
      .map((chainWithAsset) => {
        if (chainWithAsset.chainName === "sei" && !cosmosWalletConnected) {
          // Remove confusing "Sei - EVM" when they only ever see EVM stuff
          chainWithAsset.prettyName = "SEI";
        }
        return chainWithAsset;
      });
  }, [
    chains,
    context,
    cosmosWalletConnected,
    filter,
    filterOut,
    getBalance,
    hideAssetsUnlessWalletTypeConnected,
    ibcEurekaHighlightedAssets,
    searchQuery,
    selectedGroup,
  ]);

  return filteredChains;
};
