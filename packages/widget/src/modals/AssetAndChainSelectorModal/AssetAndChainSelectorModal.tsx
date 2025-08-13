import { createModal, ModalProps } from "@/components/Modal";
import { Column } from "@/components/Layout";
import { useAtomValue } from "jotai";
import { ClientAsset, skipAssetsAtom, skipChainsAtom } from "@/state/skipClient";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useListHeight, VirtualList } from "@/components/VirtualList";
import {
  AssetAndChainSelectorModalRowItem,
  Skeleton,
  isGroupedAsset,
} from "./AssetAndChainSelectorModalRowItem";
import { AssetAndChainSelectorModalSearchInput } from "./AssetAndChainSelectorModalSearchInput";
import { useFilteredChains } from "./useFilteredChains";
import { useFilteredAssets } from "./useFilteredAssets";
import { useGroupedAssetByRecommendedSymbol } from "./useGroupedAssetsByRecommendedSymbol";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { Modals } from "../registerModals";
import { StyledModalContainer } from "@/components/Modal";
import styled from "styled-components";
import { track } from "@amplitude/analytics-browser";
import { ibcEurekaHighlightedAssetsAtom } from "@/state/ibcEurekaHighlightedAssets";
import { Chain } from "@skip-go/client";

export type GroupedAsset = {
  id: string;
  chains: {
    chainId: string;
    chainName: string;
    originChainId: string;
  }[];
  assets: ClientAsset[];
  totalAmount: number;
  totalUsd: number;
  formattedTotalAmount: string;
  name?: string;
  decimals?: number;
};

export type ChainWithAsset = Chain & {
  asset: ClientAsset;
};

export type SelectorContext = "source" | "destination";

export type AssetAndChainSelectorModalProps = ModalProps & {
  onSelect: (token: ClientAsset | null) => void;
  selectedAsset?: ClientAsset;
  selectChain?: boolean;
  context: SelectorContext;
  overrideSelectedGroup?: GroupedAsset;
};

const ITEM_HEIGHT = 65;

export const AssetAndChainSelectorModal = createModal(
  (modalProps: AssetAndChainSelectorModalProps) => {
    const modal = useModal();
    const {
      onSelect: _onSelect,
      selectedAsset,
      selectChain,
      context,
      overrideSelectedGroup,
    } = modalProps;
    const { data: assets, isFetching, isPending } = useAtomValue(skipAssetsAtom);
    const ibcEurekaHighlightedAssets = useAtomValue(ibcEurekaHighlightedAssetsAtom);
    const { isLoading: isChainsLoading } = useAtomValue(skipChainsAtom);
    const isLoading = (isFetching && isPending) || isChainsLoading;

    const [showSkeleton, setShowSkeleton] = useState(true);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [groupedAssetSelected, setGroupedAssetSelected] = useState<GroupedAsset | null>(null);

    const listHeight = useListHeight(ITEM_HEIGHT);

    const resetInput = () => {
      setSearchQuery("");
    };

    const onSelect = useCallback(
      (input: GroupedAsset | ClientAsset | null) => {
        if (!input) return;
        if (isGroupedAsset(input)) {
          if (input.assets.length === 1) {
            _onSelect(input.assets[0]);
          } else {
            setGroupedAssetSelected(input);
          }
          resetInput();
          return;
        }
        _onSelect(input);
        resetInput();
      },
      [_onSelect],
    );

    const groupedAssetsByRecommendedSymbol = useGroupedAssetByRecommendedSymbol({ context });

    const selectedGroup = useMemo(() => {
      if (overrideSelectedGroup) return overrideSelectedGroup;
      const asset = groupedAssetSelected?.assets[0] || selectedAsset;
      if (!asset) return;
      return groupedAssetsByRecommendedSymbol?.find(
        (group) => group.id === asset.recommendedSymbol,
      );
    }, [
      overrideSelectedGroup,
      groupedAssetSelected?.assets,
      selectedAsset,
      groupedAssetsByRecommendedSymbol,
    ]);

    const filteredAssets = useFilteredAssets({ groupedAssetsByRecommendedSymbol, searchQuery });
    const filteredChains = useFilteredChains({
      selectedGroup,
      searchQuery,
      context,
    });

    useEffect(() => {
      if (!isLoading && assets) {
        setShowSkeleton(false);
      }
    }, [isLoading, assets]);

    useEffect(() => {
      setSearchQuery("");
    }, [modal.visible]);

    const componentName = `${context} ${selectChain ? "chain" : "asset"} modal`;

    const handleSearch = (term: string) => {
      track(`${componentName}: search input - changed`, { term });
      setSearchQuery(term);
    };

    const renderItem = useCallback(
      (item: GroupedAsset | ChainWithAsset, index: number) => {
        const groupedAsset = item as GroupedAsset;
        const chainWithAsset = item as ChainWithAsset;

        const highlightedSymbol =
          ibcEurekaHighlightedAssets && Object.keys(ibcEurekaHighlightedAssets);

        const groupedAssetContainsEurekaAsset = highlightedSymbol?.includes(groupedAsset.id);

        const chainWithAssetContainsEurekaAsset = chainWithAsset?.asset?.recommendedSymbol
          ? ibcEurekaHighlightedAssets &&
            highlightedSymbol.includes(chainWithAsset.asset.recommendedSymbol) &&
            ibcEurekaHighlightedAssets?.[chainWithAsset.asset.recommendedSymbol] === undefined
            ? true
            : ibcEurekaHighlightedAssets?.[chainWithAsset.asset.recommendedSymbol] &&
              ibcEurekaHighlightedAssets?.[chainWithAsset.asset.recommendedSymbol]?.includes(
                chainWithAsset?.chainId,
              )
          : false;

        const eureka = groupedAssetContainsEurekaAsset || chainWithAssetContainsEurekaAsset;

        return (
          <AssetAndChainSelectorModalRowItem
            item={item}
            index={index}
            onSelect={onSelect}
            skeleton={<Skeleton />}
            context={context}
            eureka={eureka}
          />
        );
      },
      [context, ibcEurekaHighlightedAssets, onSelect],
    );

    const listOfAssetsOrChains = useMemo(() => {
      if (selectChain || groupedAssetSelected) {
        return filteredChains;
      }
      return filteredAssets;
    }, [filteredAssets, filteredChains, groupedAssetSelected, selectChain]);

    const onClickBack = () => {
      track(`${componentName}: header back button - clicked`);
      if (groupedAssetSelected === null) {
        NiceModal.remove(Modals.AssetAndChainSelectorModal);
      } else {
        setGroupedAssetSelected(null);
      }
    };

    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      track(`${componentName}: keyboard - pressed`, { key: event.key });
      const firstAssetOrChain = listOfAssetsOrChains?.[0] ?? null;
      const asset = (firstAssetOrChain as ChainWithAsset)?.asset;
      const groupedAsset = firstAssetOrChain as GroupedAsset;
      if (event.key === "Backspace" && groupedAssetSelected !== null && searchQuery === "") {
        setGroupedAssetSelected(null);
      }
      if (event.key === "Enter" && listOfAssetsOrChains?.length === 1) {
        onSelect(asset ?? groupedAsset);
      }
    };

    return (
      <StyledModalContainer>
        <AssetAndChainSelectorModalSearchInput
          onSearch={handleSearch}
          onClickBack={onClickBack}
          groupedAsset={groupedAssetSelected ?? selectedGroup}
          searchTerm={searchQuery}
          setSearchTerm={setSearchQuery}
          onKeyDown={onKeyDown}
          overrideSelectedGroup={!!overrideSelectedGroup}
        />
        {showSkeleton || (!filteredAssets && !filteredChains) ? (
          <StyledColumn height={listHeight}>
            {Array.from({ length: 8 }, (_, index) => (
              <Skeleton key={index} />
            ))}
          </StyledColumn>
        ) : (
          <VirtualList
            listItems={listOfAssetsOrChains ?? []}
            itemHeight={ITEM_HEIGHT}
            itemKey={(item) =>
              isGroupedAsset(item) ? item.id : `${item.chainId}-${item.asset.denom}`
            }
            renderItem={renderItem}
            empty={{
              header: selectedGroup ? "No networks found" : "No assets found",
              details: selectedGroup
                ? "Looking for an asset? \n Select back to return to asset selection."
                : "Looking for a network? \n Select an asset first, then move to network selection.",
            }}
          />
        )}
      </StyledModalContainer>
    );
  },
);

export const openAssetAndChainSelectorModal = ({
  context,
  onSelect,
}: {
  onSelect: (asset: ClientAsset | null) => void;
  context: "source" | "destination";
}) => {
  NiceModal.show(Modals.AssetAndChainSelectorModal, {
    context,
    onSelect: (asset: ClientAsset | null) => {
      onSelect(asset);
      NiceModal.hide(Modals.AssetAndChainSelectorModal);
    },
  });
};

const StyledColumn = styled(Column)<{
  height: number;
}>`
  height: ${({ height }) => height}px;
  overflow: hidden;
`;
