import React, { useCallback, useEffect, useRef } from "react";
import { styled, useTheme } from "styled-components";
import { Row } from "@/components/Layout";
import { SkipLogoIcon } from "@/icons/SkipLogoIcon";
import { SmallText } from "@/components/Typography";
import { SearchIcon } from "@/icons/SearchIcon";
import { LeftArrowIcon } from "@/icons/ArrowIcon";
import { Button } from "@/components/Button";
import { Text } from "@/components/Typography";
import { StyledAssetLabel } from "@/pages/SwapPage/SwapPageAssetChainInput";
import { useIsMobileScreenSize } from "@/hooks/useIsMobileScreenSize";
import { isMobile } from "@/utils/os";
import { GroupedAsset } from "./AssetAndChainSelectorModal";
import { GroupedAssetImage } from "@/components/GroupedAssetImage";
import { Asset } from "@skip-go/client";

type AssetAndChainSelectorModalSearchInputProps = {
  onSearch: (term: string) => void;
  onClickBack: () => void;
  groupedAsset?: GroupedAsset;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
};

export const AssetAndChainSelectorModalSearchInput = ({
  groupedAsset,
  onSearch,
  onClickBack,
  searchTerm,
  setSearchTerm,
  onKeyDown,
}: AssetAndChainSelectorModalSearchInputProps) => {
  const theme = useTheme();
  const asset = groupedAsset?.assets[0] as Asset;
  const isMobileScreenSize = useIsMobileScreenSize();
  const mobile = isMobile();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const term = event.target.value;
      setSearchTerm(term);
      onSearch(term);
    },
    [onSearch, setSearchTerm],
  );

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }, [asset, isMobileScreenSize, mobile]);

  return (
    <StyledSearchInputContainer align="center" gap={5}>
      {asset ? (
        <>
          <Button onClick={onClickBack}>
            <StyledLeftArrowIcon color={theme.primary.text.normal} maskedVersion={false} />
          </Button>
          <StyledSelectedAsset gap={5} align="center" justify="center">
            <GroupedAssetImage groupedAsset={groupedAsset} width={20} height={20} />
            <Text useWindowsTextHack>{asset?.recommendedSymbol}</Text>
          </StyledSelectedAsset>
        </>
      ) : (
        <StyledSearchIcon color={theme.primary.text.normal} />
      )}

      <StyledSearchInput
        ref={inputRef}
        style={{ paddingLeft: asset ? undefined : 30 }}
        type="text"
        placeholder={asset ? "Search networks" : "Search for an asset"}
        value={searchTerm}
        onChange={handleSearch}
        onKeyDown={onKeyDown}
      />
      <Row align="center" gap={5} data-logo="skip-go">
        {!isMobileScreenSize && (
          <>
            <SmallText textWrap="nowrap"> Powered by </SmallText>
            <SkipLogoIcon color={theme.primary.text.lowContrast} />
          </>
        )}
      </Row>
    </StyledSearchInputContainer>
  );
};

const StyledLeftArrowIcon = styled(LeftArrowIcon)`
  width: 25px;
  opacity: 0.5;
  transform: rotate(180deg);
`;

const StyledSelectedAsset = styled(StyledAssetLabel)`
  height: auto;

  &:after {
    background-color: transparent;
  }
  &:hover {
    &:after {
      background-color: transparent;
    }
  }
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

const StyledSearchInput = styled(Text).attrs({
  as: "input",
})`
  height: 40px;
  box-sizing: border-box;
  width: 100%;
  font-size: 20px;
  border: none;
  outline: none;
  color: ${({ theme }) => theme.primary.text.normal};
  background: ${({ theme }) => theme.primary.background.normal};
`;
