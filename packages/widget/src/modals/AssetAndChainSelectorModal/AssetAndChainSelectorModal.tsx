import { createModal, ModalProps } from "@/components/Modal";
import { Column } from "@/components/Layout";
import { styled } from "styled-components";
import { useAtomValue } from "jotai";
import {
  ClientAsset,
  skipAssetsAtom,
  skipChainsAtom,
} from "@/state/skipClient";
import { useCallback, useEffect, useMemo, useState } from "react";
import { VirtualList } from "@/components/VirtualList";
import {
  AssetAndChainSelectorModalRowItem,
  Skeleton,
  isGroupedAsset,
} from "./AssetAndChainSelectorModalRowItem";
import { AssetAndChainSelectorModalSearchInput } from "./AssetAndChainSelectorModalSearchInput";
import { Chain } from "@skip-go/client";
import { useFilteredChains } from "./useFilteredChains";
import { useFilteredAssets } from "./useFilteredAssets";
import { useGroupedAssetByRecommendedSymbol } from "./useGroupedAssetsByRecommendedSymbol";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { Modals } from "../registerModals";

export type GroupedAsset = {
  id: string;
  chains: {
    chainID: string;
    chainName: string;
    originChainID: string;
  }[];
  assets: ClientAsset[];
  totalAmount: number;
  totalUsd: number;
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
};

export const AssetAndChainSelectorModal = createModal(
  (modalProps: AssetAndChainSelectorModalProps) => {
    const modal = useModal();
    const { onSelect: _onSelect, selectedAsset, selectChain, context } = modalProps;
    const { data: assets, isLoading: isAssetsLoading } =
      useAtomValue(skipAssetsAtom);
    const { isLoading: isChainsLoading } = useAtomValue(skipChainsAtom);
    const isLoading = isAssetsLoading || isChainsLoading;

    const [showSkeleton, setShowSkeleton] = useState(true);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [groupedAssetSelected, setGroupedAssetSelected] =
      useState<GroupedAsset | null>(null);

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
      [_onSelect]
    );

    const groupedAssetsByRecommendedSymbol = useGroupedAssetByRecommendedSymbol({ context });

    const selectedGroup = useMemo(() => {
      const asset = groupedAssetSelected?.assets[0] || selectedAsset;
      if (!asset) return;
      return groupedAssetsByRecommendedSymbol?.find(
        (group) => group.id === asset.recommendedSymbol
      );
    }, [
      groupedAssetSelected?.assets,
      selectedAsset,
      groupedAssetsByRecommendedSymbol,
    ]);

    const filteredAssets = useFilteredAssets({ groupedAssetsByRecommendedSymbol, searchQuery });
    const filteredChains = useFilteredChains({ selectedGroup, searchQuery, context });

    useEffect(() => {
      if (!isLoading && assets) {
        const timer = setTimeout(() => {
          setShowSkeleton(false);
        }, 100);
        return () => clearTimeout(timer);
      }
    }, [isLoading, assets]);

    useEffect(() => {
      setSearchQuery("");
    }, [modal.visible]);

    const handleSearch = (term: string) => {
      setSearchQuery(term);
    };

    const renderItem = useCallback(
      (item: GroupedAsset | ChainWithAsset, index: number) => {
        return (
          <AssetAndChainSelectorModalRowItem
            item={item}
            index={index}
            onSelect={onSelect}
            skeleton={<Skeleton />}
            context={context}
          />
        );
      },
      [context, onSelect]
    );

    const listOfAssetsOrChains = useMemo(() => {
      if (selectChain || groupedAssetSelected) {
        return filteredChains;
      }
      return filteredAssets;
    }, [filteredAssets, filteredChains, groupedAssetSelected, selectChain]);

    const onClickBack = () => {
      if (groupedAssetSelected === null) {
        NiceModal.remove(Modals.AssetAndChainSelectorModal);
      } else {
        setGroupedAssetSelected(null);
      }
    };

    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Backspace" && groupedAssetSelected !== null && searchQuery === "") {
        setGroupedAssetSelected(null);
      }
    };
    return (
      <StyledContainer>
        <AssetAndChainSelectorModalSearchInput
          onSearch={handleSearch}
          onClickBack={onClickBack}
          asset={groupedAssetSelected?.assets[0] || selectedAsset}
          searchTerm={searchQuery}
          setSearchTerm={setSearchQuery}
          onKeyDown={onKeyDown}
        />
        {showSkeleton || (!filteredAssets && !filteredChains) ? (
          <Column>
            {Array.from({ length: 10 }, (_, index) => (
              <Skeleton key={index} />
            ))}
          </Column>
        ) : (
          <VirtualList
            listItems={listOfAssetsOrChains ?? []}
            height={530}
            itemHeight={70}
            itemKey={(item) => isGroupedAsset(item) ? item.id : `${item.chainID}-${item.asset.denom}`}
            renderItem={renderItem}
            empty={{
              header: selectedGroup ? "No networks found" : "No assets found",
              details: selectedGroup ? "Looking for an asset? \n Select back to return to asset selection." : "Looking for a network? \n Select an asset first, then move to network selection.",
            }}
          />
        )}
      </StyledContainer>
    );
  }
);

const StyledContainer = styled(Column)`
  padding: 10px;
  gap: 10px;
  width: 580px;
  height: 600px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.primary.background.normal};
  overflow: hidden;
`;
