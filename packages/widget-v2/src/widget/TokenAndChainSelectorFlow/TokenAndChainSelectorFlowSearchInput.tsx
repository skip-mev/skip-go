import React, { useState, useCallback } from 'react';
import { styled } from 'styled-components';

interface SearchInputProps {
  onSearch: (term: string) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({ onSearch }) => {
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
    <StyledSearchInput
      type="text"
      placeholder="Search asset or network"
      value={searchTerm}
      onChange={handleSearch}
    />
  );
};

const StyledSearchInput = styled.input`
  padding: 8px;
  padding-left: 30px;
  margin-bottom: 10px;
  border: none;
  color: ${({ theme }) => theme.textColor};
  background-color: ${({ theme }) => theme.backgroundColor};
`;
