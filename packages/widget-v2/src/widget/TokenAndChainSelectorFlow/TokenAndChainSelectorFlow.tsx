import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Modal, ModalProps } from '../../components/Modal';
import { Column } from '../../components/Layout';
import { styled } from 'styled-components';
import { useAtom } from 'jotai';
import { ChainWithAsset, ClientAsset, skipAssets } from '../../state/skip';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { VirtualList } from '../../components/VirtualList';
import { RowItem, Skeleton } from './TokenAndChainSelectorFlowRowItem';
import { SearchInput } from './TokenAndChainSelectorFlowSearchInput';
import { hashObject } from '../../utils/misc';

export type TokenAndChainSelectorFlowProps = ModalProps & {
  onSelect: (token: ClientAsset | null) => void;
  chainsContainingAsset?: ChainWithAsset[];
  asset?: Partial<ClientAsset>;
};

export const TokenAndChainSelectorFlow = NiceModal.create(
  (modalProps: TokenAndChainSelectorFlowProps) => {
    const modal = useModal();
    const { onSelect, chainsContainingAsset, asset } = modalProps;
    const [{ data: assets, isPending }] = useAtom(skipAssets);

    const [showSkeleton, setShowSkeleton] = useState(true);
    const [searchQuery, setSearchQuery] = useState<string>('');

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
      setSearchQuery('');
    }, [modal.visible]);

    const handleSearch = (term: string) => {
      setSearchQuery(term);
    };

    const renderItem = useCallback(
      (asset: ClientAsset | ChainWithAsset, index: number) => {
        return (
          <RowItem
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
      <Modal {...modalProps}>
        <StyledContainer>
          <SearchInput onSearch={handleSearch} asset={asset} />
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
              itemKey={(item) => hashObject(item)}
            />
          )}
        </StyledContainer>
      </Modal>
    );
  }
);

const StyledContainer = styled(Column)`
  padding: 10px;
  gap: 10px;
  width: 580px;
  height: 600px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.backgroundColor};
  overflow: hidden;
`;
