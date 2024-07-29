import { css, styled } from 'styled-components';

type TextProps = {
  fontSize?: number;
  fontWeight?: 'normal' | 'bold' | number;
  textAlign?: string;
};

export const textProps = css<TextProps>`
  font-family: 'ABCDiatype', sans-serif;
  ${({ fontSize }) => fontSize && `font-size: ${fontSize}px`};
  ${({ fontWeight }) => fontWeight && `font-weight: ${fontWeight}`};
  ${({ textAlign }) => textAlign && `text-align: ${textAlign}`};
`;

export const SmallText = styled.p<TextProps>`
  color: ${(props) => props.theme.textColor};
  opacity: 0.5;
  margin: 0;
  font-size: 13px;
  ${textProps}
`;

export const Text = styled(SmallText)`
  opacity: unset;
  font-size: 20px;
  font-weight: 500;
  ${textProps}
`;
