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
  position: relative;
  width: 100%;
  height: 60px;
  border-radius: 12px;
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

  --eureka-border: conic-gradient(
    from 90deg at 50% 50%,
    #49d6dd 0deg,
    #ff663c 120.6000030040741deg,
    #d466ff 251.99999570846558deg,
    #49d6dd 360deg
  );

  &:before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -2;
    padding: 2px;
    border-radius: 15px;
    background: var(--eureka-border);
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }

  &:after {
    content: "";
    position: absolute;
    inset: 2px;
    z-index: -1;
    border-radius: 13px;
    ${({ theme }) => `background: ${theme.secondary.background.normal}`};
  }
`;
