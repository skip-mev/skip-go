import { css, styled } from 'styled-components';
import { FlexProps, flexProps } from './Layout';
import { removeButtonStyles, SmallText } from './Typography';
import { getHexColor, opacityToHex } from '../utils/colors';

export const GhostButton = styled(SmallText).attrs({ as: 'button' })<FlexProps>`
  ${removeButtonStyles};
  line-height: 13px;
  &:hover {
    background-color: ${({ theme, onClick }) =>
      onClick &&
      css`
        ${getHexColor(theme.backgroundColor) + opacityToHex(50)};
        opacity: 1;
      `};
  }
  ${({ onClick }) =>
    onClick &&
    css`
      cursor: pointer;
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

export type GhostButtonProps = {
  text?: string;
  onClick?: () => void;
};
