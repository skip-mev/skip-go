import React, { useState, useCallback, useEffect, useRef } from 'react';
import { styled, useTheme } from 'styled-components';
import { Row } from '../../components/Layout';
import { SkipLogoIcon } from '../../icons/SkipLogoIcon';
import { SmallText } from '../../components/Typography';
import { SearchIcon } from '../../icons/SearchIcon.tsx';
import { StyledAssetLabel } from '../../components/AssetChainInput.tsx';
import { ClientAsset } from '../../state/skip.ts';
import { LeftArrowIcon } from '../../icons/ArrowIcon.tsx';
import { useModal } from '@ebay/nice-modal-react';
import { Button } from '../../components/Button.tsx';
import { Text } from '../../components/Typography';

interface SearchInputProps {
  onSearch: (term: string) => void;
  asset?: Partial<ClientAsset>;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  onSearch,
  asset,
}) => {
  const theme = useTheme();
  const modal = useModal();
  const inputRef = useRef<HTMLInputElement>(null);

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const term = event.target.value;
      setSearchTerm(term);
      onSearch(term);
    },
    [onSearch]
  );

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }, []);

  return (
    <StyledSearchInputContainer align="center" gap={5}>
      {asset ? (
        <>
          <Button onClick={() => modal.remove()}>
            <StyledLeftArrowIcon color={theme.textColor} />
          </Button>
          <StyledSelectedAsset gap={5} align="center" justify="center">
            <img src={asset.logoURI} width={20} height={20} />
            <Text>{asset?.symbol}</Text>
          </StyledSelectedAsset>
        </>
      ) : (
        <StyledSearchIcon color={theme.textColor} />
      )}

      <StyledSearchInput
        ref={inputRef}
        style={{ paddingLeft: asset ? undefined : 30 }}
        type="text"
        placeholder={asset ? 'Search networks' : 'Search  asset or network'}
        value={searchTerm}
        onChange={handleSearch}
      />

      <Row align="center" gap={5}>
        <SmallText style={{ textWrap: 'nowrap' }}> Powered by </SmallText>
        <SkipLogoIcon />
      </Row>
    </StyledSearchInputContainer>
  );
};

const StyledLeftArrowIcon = styled(LeftArrowIcon)`
  width: 25px;
  opacity: 0.5;
`;

const StyledSelectedAsset = styled(StyledAssetLabel)`
  height: auto;
`;

const StyledSearchIcon = styled(SearchIcon)`
  position: absolute;
  width: 20px;
  height: 20px;
`;

const StyledSearchInputContainer = styled(Row)`
  padding: 6px 10px;
  height: 50px;
  position: relative;
`;

const StyledSearchInput = styled.input`
  height: 40px;
  box-sizing: border-box;
  width: 100%;
  border: none;
  outline: none;
  color: ${({ theme }) => theme.textColor};
  background-color: ${({ theme }) => theme.backgroundColor};
`;
