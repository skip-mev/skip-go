import React, { useState, useCallback } from 'react';
import { styled, useTheme } from 'styled-components';
import { Row } from '../../components/Layout';
import { SkipLogoIcon } from '../../icons/SkipLogoIcon';
import { SmallText } from '../../components/Typography';
import { SearchIcon } from '../../icons/SearchIcon.tsx';

interface SearchInputProps {
  onSearch: (term: string) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({ onSearch }) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const term = event.target.value;
      setSearchTerm(term);
      onSearch(term);
    },
    [onSearch]
  );

  return (
    <StyledSearchInputContainer align="center" gap={5}>
      <StyledSearchIcon color={theme.textColor} />
      <StyledSearchInput
        type="text"
        placeholder="Search asset or network"
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

const StyledSearchIcon = styled(SearchIcon)`
  position: absolute;
  width: 20px;
  height: 20px;
`;

const StyledSearchInputContainer = styled(Row)`
  padding: 6px 10px;
  position: relative;
`;

const StyledSearchInput = styled.input`
  height: 40px;
  box-sizing: border-box;
  width: 100%;
  padding-left: 30px;
  border: none;
  color: ${({ theme }) => theme.textColor};
  background-color: ${({ theme }) => theme.backgroundColor};
`;
