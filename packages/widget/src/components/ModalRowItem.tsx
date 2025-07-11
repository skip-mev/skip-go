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
  eureka?: boolean;
  as?: "button" | "div";
};

export const ModalRowItem = ({
  leftContent,
  rightContent,
  onClick,
  style,
  eureka,
  as = "button",
}: ModalRowItemProps) => {
  return (
    <StyledModalRowItemContainer
      as={as}
      align="center"
      justify="space-between"
      onClick={onClick}
      gap={16}
      style={style}
      eureka={eureka}
    >
      {typeof leftContent === "string" ? <Text fontSize={20}>{leftContent}</Text> : leftContent}
      {typeof rightContent === "string" ? <Text fontSize={20}>{rightContent}</Text> : rightContent}
    </StyledModalRowItemContainer>
  );
};

type ModalRowFunctionalProps = {
  onClick?: () => void;
  as?: "button" | "div";
};

type ModalRowStyleProps = ModalRowFunctionalProps & {
  eureka?: boolean;
};

const StyledModalRowItemContainer = styled(Row).attrs<ModalRowFunctionalProps>(
  ({ onClick, as }) => ({
    ...(as === "div" &&
      !!onClick && {
        role: "button",
        tabIndex: 0,
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onClick();
          }
        },
      }),
  }),
)<ModalRowStyleProps>`
  ${removeButtonStyles};
  position: relative;
  width: ${({ as }) => (as === "div" ? "-webkit-fill-available" : "100%")};
  height: 60px;
  border-radius: ${({ theme }) => convertToPxValue(theme.borderRadius?.rowItem)};
  padding: ${({ as }) => (as === "div" ? "0 15px" : "12px 15px")};
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

  ${({ eureka }) => {
    return eureka
      ? css`
          &:before {
            content: "";
            position: absolute;
            inset: 0;
            z-index: -2;
            padding: 2px;
            border-radius: 12px;
            background: var(--eureka-border);
            -webkit-mask:
              linear-gradient(#fff 0 0) content-box,
              linear-gradient(#fff 0 0);
            mask-composite: exclude;
          }
        `
      : "";
  }}
`;
