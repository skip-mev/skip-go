import { createModal, ModalProps, useModal } from "@/components/Modal";
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
  TokenAndChainSelectorModalRowItem,
  Skeleton,
  isGroupedAsset,
} from "./TokenAndChainSelectorModalRowItem";
import { TokenAndChainSelectorModalSearchInput } from "./TokenAndChainSelectorModalSearchInput";
import { matchSorter } from "match-sorter";
import { useGetBalance } from "@/hooks/useGetBalance";
import { Chain } from "@skip-go/client";
import { convertTokenAmountToHumanReadableAmount } from "@/utils/crypto";
import { useGetFilteredChains } from "./useGetFilteredChains";

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

export type TokenAndChainSelectorModalProps = ModalProps & {
  onSelect: (token: ClientAsset | null) => void;
  selectedAsset?: ClientAsset;
  networkSelection?: boolean;
  context: SelectorContext;
};

export const TokenAndChainSelectorModal = createModal(
  (modalProps: TokenAndChainSelectorModalProps) => {
    const modal = useModal();
    const { onSelect: _onSelect, selectedAsset, networkSelection, context } = modalProps;
    const { data: assets, isLoading: isAssetsLoading } =
      useAtomValue(skipAssetsAtom);
    const { isLoading: isChainsLoading } = useAtomValue(skipChainsAtom);
    const isLoading = isAssetsLoading || isChainsLoading;
    const getBalance = useGetBalance();

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

    const groupedAssetsByRecommendedSymbol = useMemo(() => {
      if (!assets) return;
      const groupedAssets: GroupedAsset[] = [];

      const calculateBalanceSummary = (assets: ClientAsset[]) => {
        return assets.reduce(
          (accumulator, asset) => {
            const balance = getBalance(asset.chainID, asset.denom);
            if (balance) {
              accumulator.totalAmount += Number(
                convertTokenAmountToHumanReadableAmount(
                  balance.amount,
                  balance.decimals
                )
              );
              if (Number(balance.valueUSD)) {
                accumulator.totalUsd += Number(balance.valueUSD);
              }
            }
            return accumulator;
          },
          { totalAmount: 0, totalUsd: 0 }
        );
      };

      assets.forEach((asset) => {
        const foundGroup = groupedAssets.find(
          (group) => group.id === asset.recommendedSymbol
        );
        if (foundGroup) {
          foundGroup.assets.push(asset);
          foundGroup.chains.push({
            chainID: asset.chainID,
            chainName: asset.chainName,
            originChainID: asset.originChainID,
          });
        } else {
          groupedAssets.push({
            id: asset.recommendedSymbol || asset.symbol || asset.denom,
            chains: [
              {
                chainID: asset.chainID,
                chainName: asset.chainName,
                originChainID: asset.originChainID,
              },
            ],
            assets: [asset],
            totalAmount: 0,
            totalUsd: 0,
          });
        }
      });

      groupedAssets.forEach((group) => {
        const balanceSummary = calculateBalanceSummary(group.assets);
        group.totalAmount = balanceSummary.totalAmount;
        group.totalUsd = balanceSummary.totalUsd;
      });

      return groupedAssets;
    }, [assets, getBalance]);

    const filteredAssets = useMemo(() => {
      if (!groupedAssetsByRecommendedSymbol) return;
      return matchSorter(groupedAssetsByRecommendedSymbol, searchQuery, {
        keys: ["id"],
      }).sort((itemA, itemB) => {
        const PRIVILEGED_ASSETS = ["ATOM", "USDC", "USDT", "ETH", "TIA", "OSMO", "NTRN", "INJ"];
        if (itemA.totalUsd === 0 && itemB.totalUsd === 0) {
          const indexA = PRIVILEGED_ASSETS.indexOf(itemA.id);
          const indexB = PRIVILEGED_ASSETS.indexOf(itemB.id);

          if (indexA !== -1 && indexB !== -1) {
            return indexA - indexB;
          }

          if (indexA !== -1) return -1;
          if (indexB !== -1) return 1;
        }

        if (itemA.totalUsd < itemB.totalUsd) {
          return 1;
        }
        if (itemA.totalUsd > itemB.totalUsd) {
          return -1;
        }
        return 0;
      });
    }, [groupedAssetsByRecommendedSymbol, searchQuery]);

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

    const filteredChains = useGetFilteredChains({ selectedGroup, searchQuery, context });

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
          <TokenAndChainSelectorModalRowItem
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
    const list = useMemo(() => {
      if (!networkSelection) {
        if (groupedAssetSelected) {
          if (context === "source") {
            return filteredChains?.filter(c => !c.chainID.includes("penumbra"));
          }
          return filteredChains;
        }
        return filteredAssets;
      }
      if (context === "source") {
        return filteredChains?.filter(c => !c.chainID.includes("penumbra"));
      }
      return filteredChains;
    }, [filteredAssets, filteredChains, groupedAssetSelected, context, networkSelection]);


    const onClickBack = () => {
      if (groupedAssetSelected === null) {
        modal.remove();
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
        <TokenAndChainSelectorModalSearchInput
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
            listItems={list ?? []}
            height={530}
            itemHeight={70}
            itemKey={(item) => {
              if (isGroupedAsset(item)) {
                return `${item.id}`;
              }
              return `${item.chainID}-${item.asset.denom}`;
            }}
            renderItem={renderItem}
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
