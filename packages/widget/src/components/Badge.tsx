import { convertToPxValue } from "@/utils/style";
import styled, { css } from "styled-components";
import { WidgetBorderRadius } from "@/widget/theme";

type BadgeProps = {
  variant?: "success" | "warning" | "error" | "default";
  borderRadius?: keyof WidgetBorderRadius | number;
  padding?: string;
  flexDirection?: "row" | "column";
  gap?: number | string;
  width?: number | string;
  height?: number | string;
};

export const Badge = styled.div<BadgeProps>`
  position: relative;
  font-family: "ABCDiatype", sans-serif;
  font-size: 13px;
  display: flex;
  gap: ${({ gap = 10 }) => convertToPxValue(gap)};
  flex-direction: ${({ flexDirection }) => flexDirection ?? "column"};
  height: ${({ height }) => height && convertToPxValue(height)};
  width: fit-content;
  padding: ${({ padding }) => padding ?? "6px 8px"};
  border-radius: 100px;
  ${({ theme, variant }) => {
    switch (variant) {
      case "success":
        return css`
          color: ${theme.success.text};
          background: ${theme.success.background};
        `;
      case "warning":
        return css`
          color: ${theme.warning.text};
          background: ${theme.warning.background};
        `;
      case "error":
        return css`
          color: ${theme.error.text};
          background: ${theme.error.background};
        `;
      default:
        return css`
          color: ${theme.primary.text.lowContrast};
          background: ${theme.secondary.background.normal};
        `;
    }
  }};
`;
