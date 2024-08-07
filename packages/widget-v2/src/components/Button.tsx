import { css, styled } from 'styled-components';
import { FlexProps, flexProps, Row } from './Layout';
import { removeButtonStyles, SmallText } from './Typography';
import { getHexColor, opacityToHex } from '../utils/colors';

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
          ? theme.secondary.background
          : getHexColor(theme.backgroundColor) + opacityToHex(50)};
        opacity: 1;
        cursor: pointer;
      `};
  }
  ${({ onClick }) =>
    onClick &&
    css`
      padding: 9px 16px;
    `}
  border-radius: 90px;
  ${flexProps};
`;

export const Button = styled.button<FlexProps>`
  ${removeButtonStyles}
  &:hover {
    cursor: pointer;
  }
  ${flexProps};
`;
