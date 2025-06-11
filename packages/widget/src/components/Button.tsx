import { css, styled } from "styled-components";
import { FlexProps, flexProps } from "@/components/Layout";
import { removeButtonStyles, SmallText } from "@/components/Typography";
import { transition } from "@/utils/transitions";
import { px } from "@/utils/style";

export type GhostButtonProps = {
  secondary?: boolean;
  alwaysShowBackground?: boolean;
  height?: number;
} & FlexProps;

export const GhostButton = styled(SmallText).attrs({
  as: "button",
})<GhostButtonProps>`
  ${removeButtonStyles};
  line-height: 13px;
  height: ${({ height }) => height || 30}px;
  ${transition(["background-color"], "fast", "easeOut")}

  ${({ alwaysShowBackground, theme, secondary }) => {
    if (alwaysShowBackground) {
      return css`
        background: ${secondary
          ? theme.secondary.background.normal
          : theme.primary.ghostButtonHover};
      `;
    }
  }}

  ${({ onClick, disabled, secondary, theme }) => {
    if (onClick && !disabled) {
      return css`
        &:hover {
          background: ${secondary
            ? theme.secondary.background.normal
            : theme.primary.ghostButtonHover};
          color: ${theme.primary.text.normal};
          cursor: pointer;
        }
      `;
    }
  }}

  padding: 8px 15px;
  border-radius: ${({ theme }) => px(theme.borderRadius?.ghostButton)};
  ${flexProps};
`;

export const Button = styled.button<FlexProps>`
  ${removeButtonStyles}
  line-height: initial;
  ${({ disabled }) =>
    disabled
      ? css`
          &:hover {
            cursor: not-allowed;
          }
        `
      : css`
          &:hover {
            cursor: pointer;
          }
        `}

  ${flexProps};
`;

export const PillButton = styled(Button)`
  padding: 5px 10px;
  height: 28px;
  border-radius: 30px;
  box-sizing: border-box;
  background: ${({ theme }) => theme.secondary.background.normal};
  gap: 10px;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${({ theme }) => theme.secondary.background.hover};
  }
`;

export const Link = styled(Button).attrs({
  as: "a",
})`
  color: ${({ theme }) => theme.primary.text.lowContrast};
  text-decoration: none;
`;

export const PillButtonLink = styled(PillButton).attrs({
  as: "a",
})`
  color: ${({ theme }) => theme.primary.text.lowContrast};
  text-decoration: none;
`;
