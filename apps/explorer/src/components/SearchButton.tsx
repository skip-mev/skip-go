import { SearchIcon } from "@/icons/SearchIcon";
import { StyledWrapper } from "./TxHashInput";
import { styled, useTheme } from "@/styled-components";
import { Text } from "@/components/Typography";
import { loadingPulseAnimation } from "@/components/Container";

export const SearchButton = ({
  size = "normal",
  onClick,
  iconOnly = false,
  isSearchable = false,
  isLoading = false,
}: {
  size?: "normal" | "small";
  onClick?: () => void;
  iconOnly?: boolean;
  isSearchable?: boolean;
  isLoading?: boolean;
}) => {
  const theme = useTheme();
  return (
    <SearchWrapper
      size={size}
      isClickable
      onClick={onClick}
      iconOnly={iconOnly}
      isSearchable={isSearchable}
      isLoading={isLoading}
    >
      <StyledText size={size} iconOnly={iconOnly} isSearchable={isSearchable}>
        Search transaction
      </StyledText>
      <SearchIcon color={isSearchable ? theme.primary.background.normal : theme.primary.text.lowContrast} />
    </SearchWrapper>
  );
};

const SearchWrapper = styled(StyledWrapper)<{
  iconOnly?: boolean;
  isSearchable?: boolean;
  isLoading?: boolean;
}>`
  background-color: ${(props) => props.isSearchable ? props.theme.brandColor : props.theme.primary.background.normal};
  width: ${(props) => (props.size === "normal" ? "64px" : "48px")};
  height: ${(props) => (props.size === "normal" ? "64px" : "48px")};
  justify-content: center;
  flex: none;
  ${({ isLoading }) => isLoading && loadingPulseAnimation({
    active: true,
  })}
  @media (max-width: 1300px) {
    width: ${(props) =>
      props.iconOnly ? (props.size === "normal" ? "64px" : "48px") : "auto"};
    justify-content: ${(props) =>
      props.iconOnly ? "center" : "space-between"};
  }
`;

const StyledText = styled(Text)<{
  size: "normal" | "small";
  iconOnly?: boolean;
  isSearchable?: boolean;
}>`
  font-size: ${(props) => (props.size === "normal" ? "24px" : "16px")};
  color: ${(props) => props.isSearchable ? props.theme.primary.background.normal : props.theme.primary.text.lowContrast};
  display: ${(props) => (props.iconOnly ? "none" : "")};
  @media (min-width: 1300px) {
    display: none;
  }
`;
