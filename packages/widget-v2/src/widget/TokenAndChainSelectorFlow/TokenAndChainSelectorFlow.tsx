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
import { getHexColor, opacityToHex } from '../../utils/colors';
import { hashObject } from '../../utils/misc';

export type TokenAndChainSelectorFlowProps = ModalProps & {
  onSelect: (tokenOrChain: string) => void;
};

export const TokenAndChainSelectorFlow = NiceModal.create(
  (modalProps: TokenAndChainSelectorFlowProps) => {
    const { theme, onSelect } = modalProps;
    const [{ data: assets }] = useAtom(skipAssets);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const filteredAssets = useMemo(() => {
      if (!assets) return [];
      const filtered = assets.filter((asset) =>
        asset.symbol?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return filtered;
    }, [searchQuery, assets]);

    const handleSearch = (term: string) => {
      setSearchQuery(term);
    };

    const renderItem = useCallback(
      (asset: ClientAsset | null, index: number) => {
        return (
          <RowItem
            asset={asset}
            index={index}
            onSelect={onSelect}
            skeleton={
              <Skeleton
                color={getHexColor(theme?.textColor ?? '') + opacityToHex(10)}
              />
            }
          />
        );
      },
      [onSelect]
    );

    return (
      <Modal {...modalProps}>
        <StyledContainer>
          <SearchInput onSearch={handleSearch} />
          {filteredAssets ? (
            <VirtualList
              listItems={filteredAssets}
              height={530}
              itemHeight={70}
              scrollBarColor={theme?.textColor ?? ''}
              renderItem={renderItem}
              itemKey={(asset: ClientAsset) => hashObject(asset)}
            />
          ) : (
            <Column>
              {Array.from({ length: 10 }, (_, index) => (
                <Skeleton
                  key={index}
                  color={getHexColor(theme?.textColor ?? '') + opacityToHex(10)}
                />
              ))}
            </Column>
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
