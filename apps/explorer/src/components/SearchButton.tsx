import { SearchIcon } from "@/icons/SearchIcon";
import { StyledWrapper } from "./TxHashInput";
import { styled, useTheme } from "@/styled-components";
import { Text } from "@/components/Typography";

export const SearchButton = ({
  size = "normal",
  onClick,
  iconOnly = false,
}: {
  size?: "normal" | "small";
  onClick?: () => void;
  iconOnly?: boolean;
}) => {
  const theme = useTheme();
  return (
    <SearchWrapper
      size={size}
      isClickable
      onClick={onClick}
      iconOnly={iconOnly}
    >
      <StyledText size={size} iconOnly={iconOnly}>
        Search transaction
      </StyledText>
      <SearchIcon color={theme.primary.text.lowContrast} />
    </SearchWrapper>
  );
};

const SearchWrapper = styled(StyledWrapper)<{
  iconOnly?: boolean;
}>`
  background-color: ${(props) => props.theme.secondary.background.normal};
  width: ${(props) => (props.size === "normal" ? "64px" : "48px")};
  height: ${(props) => (props.size === "normal" ? "64px" : "48px")};
  justify-content: center;
  flex: none;
  @media (max-width: 1023px) {
    width: ${(props) =>
      props.iconOnly ? (props.size === "normal" ? "64px" : "48px") : "100%"};
    justify-content: ${(props) =>
      props.iconOnly ? "center" : "space-between"};
  }
`;

const StyledText = styled(Text)<{
  size: "normal" | "small";
  iconOnly?: boolean;
}>`
  font-size: ${(props) => (props.size === "normal" ? "24px" : "16px")};
  color: ${(props) => props.theme.primary.text.lowContrast};
  display: ${(props) => (props.iconOnly ? "none" : "")};
  @media (min-width: 1023px) {
    display: none;
  }
`;
