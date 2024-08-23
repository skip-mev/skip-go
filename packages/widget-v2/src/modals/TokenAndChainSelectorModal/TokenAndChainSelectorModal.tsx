import { createModal, ModalProps, useModal } from "@/components/Modal";
import { Column, Row } from "@/components/Layout";
import { styled } from "styled-components";
import { useAtom } from "jotai";
import { ChainWithAsset, ClientAsset, skipAssets } from "@/state/skipClient";
import { useCallback, useEffect, useMemo, useState } from "react";
import { VirtualList } from "@/components/VirtualList";
import {
  isChainWithAsset,
  TokenAndChainSelectorModalRowItem,
  Skeleton,
} from "./TokenAndChainSelectorModalRowItem";
import { TokenAndChainSelectorModalSearchInput } from "./TokenAndChainSelectorModalSearchInput";
import { SmallText } from "@/components/Typography";

export type TokenAndChainSelectorModalProps = ModalProps & {
  onSelect: (token: ClientAsset | null) => void;
  chainsContainingAsset?: ChainWithAsset[];
  asset?: Partial<ClientAsset>;
};

export const TokenAndChainSelectorModal = createModal(
  (modalProps: TokenAndChainSelectorModalProps) => {
    const modal = useModal();
    const { onSelect, chainsContainingAsset, asset } = modalProps;
    const [{ data: assets, isPending }] = useAtom(skipAssets);

    const [showSkeleton, setShowSkeleton] = useState(true);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const filteredAssets = useMemo(() => {
      if (!assets) return;
      const filtered = assets.filter((asset) =>
        asset.symbol?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return filtered;
    }, [searchQuery, assets]);

    const filteredChains = useMemo(() => {
      if (!chainsContainingAsset) return;
      const filtered = chainsContainingAsset.filter(
        (chain) =>
          chain.chain_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          chain.pretty_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return filtered;
    }, [searchQuery, chainsContainingAsset]);

    useEffect(() => {
      if (!isPending && assets) {
        const timer = setTimeout(() => {
          setShowSkeleton(false);
        }, 100);
        return () => clearTimeout(timer);
      }
    }, [isPending, assets]);

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
        <Row gap={5} style={{marginTop: -10}}>
          {["All", "Bitcoin", "Ethereum", "Cosmos","Osmosis", "Optimism", "Select chain"].map(chain => <StyledChainPill><SmallText>{chain}</SmallText></StyledChainPill>)}
        </Row>
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
            renderItem={renderItem}
            itemKey={(item) => {
              if (isChainWithAsset(item)) {
                return `${item.chain_id}${item.chain_name}`;
              }
              return `${item.chainID}${item.denom}`;
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

const StyledChainPill = styled.div`
  background-color: ${({ theme }) => theme.secondary.background.normal};
  padding: 5px 10px;
  border-radius: 10px;
`;