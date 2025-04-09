import { useMemo } from "react";
import { ChainWithAsset, GroupedAsset } from "./AssetAndChainSelectorModal";
import { skipChainsAtom } from "@/state/skipClient";
import { useAtomValue } from "jotai";
import { useGetBalance } from "@/hooks/useGetBalance";
import { chainFilterAtom } from "@/state/swapPage";
import { EXCLUDED_TOKEN_COMBINATIONS } from "./useFilteredAssets";

export type useFilteredChainsProps = {
  selectedGroup: GroupedAsset | undefined;
  searchQuery?: string;
  context: "source" | "destination";
  accounts: { cosmosAccount: unknown; evmAccount: unknown };
};

export const useFilteredChains = ({
  selectedGroup,
  searchQuery = "",
  context,
  accounts,
}: useFilteredChainsProps) => {
  const { data: chains } = useAtomValue(skipChainsAtom);
  const chainFilter = useAtomValue(chainFilterAtom);
  const getBalance = useGetBalance();

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

        const isAllowedByFilter =
          !chainFilter?.[context] || Object.keys(chainFilter[context]).includes(chain.chainID);

        // For source context, exclude Penumbra chains
        const isPenumbraAllowed = context !== "source" || !chain.chainID.startsWith("penumbra");

        return isAllowedByFilter && isPenumbraAllowed;
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

        // 1. Sort by USD value
        if (usdValueB !== usdValueA) return usdValueB - usdValueA;

        const chainAIsOrigin = chainWithAssetA.asset.originChainID === chainWithAssetA.chainID;
        const chainBIsOrigin = chainWithAssetB.asset.originChainID === chainWithAssetB.chainID;

        // 2. If USD values are equal, sort by origin chain
        if (chainBIsOrigin) return 1;
        if (chainAIsOrigin) return -1;

        return 0;
      });

    return filtered
      .filter((chainWithAsset) => {
        const cosmosWalletConnected = accounts?.cosmosAccount;

        if (
          !cosmosWalletConnected &&
          chainWithAsset.chainName === "sei" &&
          chainWithAsset?.chainType === "cosmos"
        ) {
          // If the user does not have a cosmos wallet connected and the asset is the "cosmos" version of SEI, then hide it.
          return false;
        }
        return true;
      })
      .map((chainWithAsset) => {
        if (chainWithAsset.chainName === "sei") {
          if (!accounts?.cosmosAccount) {
            // Remove confusing "Sei - EVM" when they only ever see EVM stuff
            chainWithAsset.prettyName = "SEI";
          }
        }
        return chainWithAsset;
      });
  }, [
    accounts?.cosmosAccount,
    chainFilter,
    chains,
    context,
    getBalance,
    searchQuery,
    selectedGroup,
  ]);

  return filteredChains;
};
