import { css, styled } from "styled-components";
import { getBrandButtonTextColor } from "@/utils/colors";

type TextProps = {
  fontSize?: number;
  fontWeight?: "normal" | "medium" | "bold" | number | string;
  textAlign?: string;
  lineHeight?: string;
  textWrap?: string;
  color?: string;
  opacity?: string | number;
  monospace?: boolean;
  mainButtonColor?: string;
  normalTextColor?: boolean;
  capitalize?: boolean;
  overflowEllipsis?: boolean;
};

export const removeButtonStyles = css`
  background: none;
  border: none;
  padding: 0;
  outline: inherit;
`;

export const textProps = css<TextProps>`
  font-family: 'ABCDiatype-regular', sans-serif;
  ${({ fontSize }) => fontSize && `font-size: ${fontSize}px`};
  ${({ fontWeight }) => fontWeight && `font-weight: ${fontWeight}`};
  ${({ fontWeight }) => {
    switch (fontWeight) {
      case "400":
      case "normal":
        return "font-family: 'ABCDiatype-regular', sans-serif;";
      case "500":
      case "medium":
        return "font-family: 'ABCDiatype-medium', sans-serif;";
      case "700":
      case "bold":
        return "font-family: 'ABCDiatype-bold', sans-serif;";
    }
  }};
  ${({ textAlign }) => textAlign && `text-align: ${textAlign}`};
  ${({ normalTextColor, theme }) =>
    normalTextColor && `color: ${theme.primary.text.normal}`};
  ${({ color }) => color && `color: ${color}`};
  ${({ opacity }) => opacity && `opacity: ${opacity}`};
  ${({ lineHeight }) => lineHeight && `line-height: ${lineHeight}`};
  ${({ textWrap }) => textWrap && `text-wrap: ${textWrap}`};
  ${({ monospace }) =>
    monospace && "font-family: 'ABCDiatype-mono', monospace;"};
  ${({ mainButtonColor }) =>
    mainButtonColor && `color: ${getBrandButtonTextColor(mainButtonColor)}`};
  ${({ capitalize }) =>
    capitalize &&
    css`
      &::first-letter {
        text-transform: capitalize;
      }
    `};
  ${({ overflowEllipsis }) =>
    overflowEllipsis &&
    css`
      text-overflow: ellipsis;
      overflow: hidden;
    `};
`;

export const SmallText = styled.p<TextProps>`
  color: ${({ theme }) => theme.primary.text.lowContrast};
  margin: 0;
  font-size: 13px;
  ${textProps}
`;

export const SmallTextButton = styled(SmallText).attrs({ as: "button" })`
  line-height: 15px;
  ${removeButtonStyles}
  cursor: pointer;
`;

export const Text = styled(SmallText)`
  color: ${(props) => props.theme.primary.text.normal};
  font-size: 20px;
  font-weight: 500;
  ${textProps}
`;

export const TextButton = styled(Text).attrs({ as: "button" })`
  ${removeButtonStyles}
  cursor: pointer;
`;
