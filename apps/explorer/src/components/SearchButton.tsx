import { SearchIcon } from "@/icons/SearchIcon";
import { StyledWrapper } from "./TxHashInput"
import { styled, useTheme } from "@/styled-components";

export const SearchButton = ({
  size = "normal",
  onClick,
}: {
  size?: "normal" | "small";
  onClick?: () => void;
}) => {
  const theme = useTheme();
  return (
    <SearchWrapper size={size} isClickable onClick={onClick}>
      <SearchIcon color={theme.primary.text.lowContrast} />
    </SearchWrapper>
  );
};

const SearchWrapper = styled(StyledWrapper)`
  background-color: ${(props) => props.theme.secondary.background.normal};
  width: ${(props) => (props.size === "normal" ? "64px" : "48px")};
  justify-content: center;
`;
