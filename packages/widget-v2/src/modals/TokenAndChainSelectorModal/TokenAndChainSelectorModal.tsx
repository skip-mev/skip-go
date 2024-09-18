import { createModal, ModalProps, useModal } from "@/components/Modal";
import { Column } from "@/components/Layout";
import { styled } from "styled-components";
import { useAtomValue } from "jotai";
import { ChainWithAsset, ClientAsset, skipAssetsAtom, skipChainsAtom } from "@/state/skipClient";
import { useCallback, useEffect, useMemo, useState } from "react";
import { VirtualList } from "@/components/VirtualList";
import {
  TokenAndChainSelectorModalRowItem,
  Skeleton,
  isClientAsset,
} from "./TokenAndChainSelectorModalRowItem";
import { TokenAndChainSelectorModalSearchInput } from "./TokenAndChainSelectorModalSearchInput";
import { matchSorter } from "match-sorter";

export type TokenAndChainSelectorModalProps = ModalProps & {
  onSelect: (token: ClientAsset | null) => void;
  chainsContainingAsset?: ChainWithAsset[];
  asset?: Partial<ClientAsset>;
};

export const TokenAndChainSelectorModal = createModal(
  (modalProps: TokenAndChainSelectorModalProps) => {
    const modal = useModal();
    const { onSelect, chainsContainingAsset, asset } = modalProps;
    const { data: assets, isLoading: isAssetsLoading } = useAtomValue(skipAssetsAtom);
    const { isLoading: isChainsLoading } = useAtomValue(skipChainsAtom);
    const isLoading = isAssetsLoading || isChainsLoading;

    const [showSkeleton, setShowSkeleton] = useState(true);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const filteredAssets = useMemo(() => {
      if (!assets) return;
      return matchSorter(assets, searchQuery, {
        keys: ["recommendedSymbol", "symbol", "denom"],
      });
    }, [assets, searchQuery]);

    const filteredChains = useMemo(() => {
      if (!chainsContainingAsset) return;
      return matchSorter(chainsContainingAsset, searchQuery, {
        keys: ["chainID", "chainName", "prettyName"],
      });
    }, [chainsContainingAsset, searchQuery]);


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
      (asset: ClientAsset | ChainWithAsset, index: number) => {
        return (
          <TokenAndChainSelectorModalRowItem
            item={asset}
            index={index}
            onSelect={onSelect}
            skeleton={<Skeleton />}
          />
        );
      },
      [onSelect]
    );

    return (
      <StyledContainer>
        <TokenAndChainSelectorModalSearchInput
          onSearch={handleSearch}
          asset={asset}
        />
        {showSkeleton || (!filteredAssets && !filteredChains) ? (
          <Column>
            {Array.from({ length: 10 }, (_, index) => (
              <Skeleton key={index} />
            ))}
          </Column>
        ) : (
          <VirtualList
            listItems={filteredChains ?? filteredAssets ?? []}
            height={530}
            itemHeight={70}
            itemKey={(item) => {
              if (isClientAsset(item)) {
                return `${item.denom}-${item.chainID}-${item.recommendedSymbol}`;
              }
              return `${item.chainID}-${item.asset?.denom}`;
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
