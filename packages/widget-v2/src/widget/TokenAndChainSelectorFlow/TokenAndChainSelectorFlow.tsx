import NiceModal from '@ebay/nice-modal-react';
import { Modal, ModalProps } from '../../components/Modal';
import { Column } from '../../components/Layout';
import { styled } from 'styled-components';
import { useAtom } from 'jotai';
import { ClientAsset, skipAssets } from '../../state/skip';
import { useCallback, useMemo, useState } from 'react';
import { VirtualList } from '../../components/VirtualList';
import { RowItem, Skeleton } from './TokenAndChainSelectorFlowRowItem';
import { SearchInput } from './TokenAndChainSelectorFlowSearchInput';

export const TokenAndChainSelectorFlow = NiceModal.create(
  (modalProps: ModalProps) => {
    const theme = modalProps.theme;
    const [loadingAssets] = useAtom(skipAssets);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const assets =
      loadingAssets.state === 'hasData' ? loadingAssets.data : undefined;

    const filteredAssets = useMemo(() => {
      const filtered = assets?.filter((asset) =>
        asset?.symbol?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return filtered;
    }, [searchQuery]);

    const handleSearch = (term: string) => {
      setSearchQuery(term);
    };

    const renderItem = useCallback(
      (asset: ClientAsset | null, index: number) => {
        return (
          <RowItem
            asset={asset}
            index={index}
            skeleton={<Skeleton color={theme?.secondary?.background} />}
          />
        );
      },
      []
    );

    return (
      <Modal {...modalProps}>
        <StyledContainer>
          <SearchInput onSearch={handleSearch} />
          <VirtualList
            listItems={filteredAssets}
            key={searchQuery}
            height={500}
            itemHeight={70}
            textColor={theme?.textColor ?? ''}
            renderItem={renderItem}
            itemKey={(asset: ClientAsset) =>
              asset.denom + asset.recommendedSymbol + asset.tokenContract
            }
          />
        </StyledContainer>
      </Modal>
    );
  }
);

const StyledContainer = styled(Column)`
  padding: 10px;
  gap: 10px;
  width: 480px;
  height: 600px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.backgroundColor};
`;
