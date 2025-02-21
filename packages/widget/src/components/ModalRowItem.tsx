import { css, styled } from "styled-components";
import { Row } from "@/components/Layout";
import { removeButtonStyles, Text } from "@/components/Typography";
import { transition } from "@/utils/transitions";

export type ModalRowItemProps = {
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
};

export const ModalRowItem = ({ leftContent, rightContent, onClick, style }: ModalRowItemProps) => {
  return (
    <StyledModalRowItemContainer
      as="button"
      align="center"
      justify="space-between"
      onClick={onClick}
      gap={16}
      style={style}
    >
      {typeof leftContent === "string" ? <Text fontSize={20}>{leftContent}</Text> : leftContent}
      {typeof rightContent === "string" ? <Text fontSize={20}>{rightContent}</Text> : rightContent}
    </StyledModalRowItemContainer>
  );
};

const StyledModalRowItemContainer = styled(Row)<{ onClick?: () => void }>`
  ${removeButtonStyles};
  width: 100%;
  height: 60px;
  border-radius: 12px;
  padding: 12px 15px;
  margin-top: 5px;
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
`;
