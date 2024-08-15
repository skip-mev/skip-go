import { css, styled } from 'styled-components';
import { FlexProps, flexProps } from './Layout';
import { removeButtonStyles, SmallText } from './Typography';

export type GhostButtonProps = {
  secondary?: boolean;
} & FlexProps;

export const GhostButton = styled(SmallText).attrs({
  as: 'button',
})<GhostButtonProps>`
  ${removeButtonStyles};
  line-height: 13px;
  &:hover {
    ${({ theme, onClick, secondary, disabled }) =>
      onClick &&
      !disabled &&
      css`
        background-color: ${secondary
          ? theme.secondary.background.normal
          : theme.primary.ghostButtonHover};
        color: ${theme.primary.text.normal};
        cursor: pointer;
      `};
  }
  padding: 9px 16px;
  border-radius: 90px;
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
