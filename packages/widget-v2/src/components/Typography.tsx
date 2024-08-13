import { css, styled } from 'styled-components';
import { getBrandButtonTextColor } from '../utils/colors';

type TextProps = {
  fontSize?: number;
  fontWeight?: 'normal' | 'bold' | number;
  textAlign?: string;
  lineHeight?: string;
  color?: string;
  opacity?: string | number;
  monospace?: boolean;
  brandButtonText?: boolean;
};

export const removeButtonStyles = css`
  background: none;
  border: none;
  padding: 0;
  outline: inherit;
`;

export const textProps = css<TextProps>`
  font-family: 'ABCDiatype', sans-serif;
  ${({ fontSize }) => fontSize && `font-size: ${fontSize}px`};
  ${({ fontWeight }) => fontWeight && `font-weight: ${fontWeight}`};
  ${({ textAlign }) => textAlign && `text-align: ${textAlign}`};
  ${({ color }) => color && `color: ${color}`};
  ${({ opacity }) => opacity && `opacity: ${opacity}`};
  ${({ lineHeight }) => lineHeight && `line-height: ${lineHeight}`};
  ${({ monospace }) => monospace && `font-family: 'ABCDiatype', monospace;`};
  ${({ brandButtonText, theme }) =>
    brandButtonText && `color: ${getBrandButtonTextColor(theme.brandColor)}`};
`;

export const SmallText = styled.p<TextProps>`
  color: ${(props) => props.theme.primary.text.normal};
  ${(props) => !props.color && `opacity: 0.5`};
  margin: 0;
  font-size: 13px;
  ${textProps}
`;

export const SmallTextButton = styled(SmallText).attrs({ as: 'button' })`
  ${removeButtonStyles}
  cursor: pointer;
`;

export const Text = styled(SmallText)`
  opacity: unset;
  font-size: 20px;
  font-weight: 500;
  ${textProps}
`;

export const TextButton = styled(Text).attrs({ as: 'button' })`
  ${removeButtonStyles}
  cursor: pointer;
`;
