import { css, styled } from "styled-components";
import { FlexProps, flexProps } from "@/components/Layout";
import { removeButtonStyles, SmallText } from "@/components/Typography";

export type GhostButtonProps = {
  secondary?: boolean;
  alwaysShowBackground?: boolean;
} & FlexProps;

export const GhostButton = styled(SmallText).attrs({
  as: "button",
}) <GhostButtonProps>`
  ${removeButtonStyles};
  line-height: 13px;
  height: 30px;

  ${({ alwaysShowBackground, theme, secondary }) => {
    if (alwaysShowBackground) {
      return (css`
        background-color: ${secondary
          ? theme.secondary.background.normal
          : theme.primary.ghostButtonHover};
      `);
    }
  }}

  ${({ onClick, disabled, secondary, theme }) => {
    if (onClick && !disabled) {
      return css`
          &:hover {
            background-color: ${secondary
          ? theme.secondary.background.normal
          : theme.primary.ghostButtonHover};
            color: ${theme.primary.text.normal};
            cursor: pointer;
          }
        `;
    }
  }}
 
  padding: 8px 16px;
  border-radius: 90px;
  ${flexProps};
`;

export const Button = styled.button<FlexProps>`
  ${removeButtonStyles}
  line - height: initial;
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
  padding: 5px 8px;
  height: 28px;
  border-radius: 30px;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.secondary.background.normal};
  gap: 4px;
  align-items: center;
`;

export const Link = styled(Button).attrs({
  as: "a",
})`
  text-decoration: none;
`;
