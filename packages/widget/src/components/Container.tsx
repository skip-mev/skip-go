import { convertToPxValue } from "@/utils/style";
import styled from "styled-components";
import { WidgetBorderRadius } from "@/widget/theme";

type ContainerProps = {
  backgroundColor?: string;
  borderRadius?: keyof WidgetBorderRadius | number;
  padding?: number | string;
  flexDirection?: "row" | "column";
  gap?: number | string;
  width?: number | string;
  height?: number | string;
};

export const Container = styled.div<ContainerProps>`
  position: relative;
  display: flex;
  gap: ${({ gap = 10 }) => convertToPxValue(gap)};
  flex-direction: ${({ flexDirection }) => flexDirection ?? "column"};
  height: ${({ height = "100%" }) => convertToPxValue(height)};
  width: ${({ width = "100%" }) => convertToPxValue(width)};
  padding: ${({ padding = 20 }) => convertToPxValue(padding)};
  border-radius: ${({ theme, borderRadius }) => {
    if (!borderRadius) return convertToPxValue(theme.borderRadius?.main);

    if (
      typeof borderRadius === "string" &&
      theme.borderRadius &&
      borderRadius in theme.borderRadius
    ) {
      return convertToPxValue(theme.borderRadius[borderRadius]);
    }

    return convertToPxValue(borderRadius);
  }};
  background: ${({ theme, backgroundColor }) => backgroundColor ?? theme.primary.background.normal};
`;
