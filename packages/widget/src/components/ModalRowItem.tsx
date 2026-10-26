import { css, styled } from "styled-components";
import { Row } from "@/components/Layout";
import { removeButtonStyles, Text } from "@/components/Typography";
import { transition } from "@/utils/transitions";
import { convertToPxValue } from "@/utils/style";

export type ModalRowItemProps = {
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
  highlightColor?: string;
};

export const ModalRowItem = ({
  leftContent,
  rightContent,
  onClick,
  style,
  highlightColor,
}: ModalRowItemProps) => {
  return (
    <StyledModalRowItemContainer
      as="button"
      align="center"
      justify="space-between"
      onClick={onClick}
      gap={16}
      style={style}
      highlightColor={highlightColor}
    >
      {typeof leftContent === "string" ? <Text fontSize={20}>{leftContent}</Text> : leftContent}
      {typeof rightContent === "string" ? <Text fontSize={20}>{rightContent}</Text> : rightContent}
    </StyledModalRowItemContainer>
  );
};

const StyledModalRowItemContainer = styled(Row)<{ onClick?: () => void; highlightColor?: string }>`
  ${removeButtonStyles};
  position: relative;
  height: 60px;
  border-radius: ${({ theme }) => convertToPxValue(theme.borderRadius?.rowItem)};
  width: 100%;
  padding: 12px 15px;
  margin-top: 5px;

  z-index: 0;

  ${({ theme }) => `background: ${theme.secondary.background.normal}`};
  ${transition(["background-color"], "fast", "easeOut")};
  ${({ onClick, theme }) =>
    onClick &&
    css`
      @media (min-width: 768px) {
        &:hover,
        &:focus {
          background: ${theme.secondary.background.hover};
          cursor: pointer;
        }
      }
      @media (max-width: 767px) {
        &:active {
          background: ${theme.secondary.background.hover};
          cursor: pointer;
        }
      }
    `};

  ${({ highlightColor }) =>
    highlightColor &&
    css`
      box-shadow: inset 0 0 0 1.5px ${highlightColor};
    `}
`;
