import { isWindows } from "@/utils/os";
import { css, styled } from "styled-components";

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
  letterSpacing?: string;
};

export const removeButtonStyles = css`
  background: none;
  border: none;
  padding: 0;
  outline: inherit;
`;

export const textProps = css<TextProps>`
  text-align: left;
  box-sizing: border-box;
  font-family: "ABCDiatype", sans-serif;
  ${({ fontSize }) => fontSize && `font-size: ${fontSize}px`};
  ${({ fontWeight }) => fontWeight && `font-weight: ${fontWeight}`};
  ${({ fontWeight }) => {
    switch (fontWeight) {
      case "400":
      case "normal":
        return "font-weight: 400";
      case "500":
      case "medium":
        return "font-weight: 500";
      case "700":
      case "bold":
        return "font-weight: 700";
    }
  }};
  ${({ textAlign }) => textAlign && `text-align: ${textAlign}`};
  ${({ normalTextColor, theme }) => normalTextColor && `color: ${theme.primary.text.normal}`};
  ${({ color }) => color && `color: ${color}`};
  ${({ opacity }) => opacity && `opacity: ${opacity}`};
  ${({ lineHeight }) => lineHeight && `line-height: ${lineHeight}`};
  ${({ textWrap }) => textWrap && `text-wrap: ${textWrap}`};
  ${({ monospace }) => monospace && "font-family: 'ABCDiatype-mono', monospace; letter-spacing: 0"};
  ${({ mainButtonColor, theme }) => mainButtonColor && `color: ${theme.brandTextColor}`};
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
  ${({ letterSpacing }) => letterSpacing && `letter-spacing: ${letterSpacing}`};
`;

export const SmallText = styled.p<TextProps>`
  color: ${({ theme, color }) => color ?? theme.primary.text.lowContrast};
  margin: 0;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.01em;
  ${textProps}
`;

export const SmallTextButton = styled(SmallText).attrs({ as: "button" })`
  line-height: 15px;
  ${removeButtonStyles}
  cursor: pointer;
  letter-spacing: 0.01em;
`;

export const Text = styled(SmallText)<{ useWindowsTextHack?: boolean }>`
  color: ${({ color, theme }) => color ?? theme.primary.text.normal};
  font-size: 20px;
  font-weight: 400;
  letter-spacing: 0;
  ${({ useWindowsTextHack }) => (useWindowsTextHack && isWindows() ? "margin-bottom: -4px" : "")};
  ${textProps}
`;

export const TextButton = styled(Text).attrs({ as: "button" })`
  ${removeButtonStyles}
  cursor: pointer;
`;
