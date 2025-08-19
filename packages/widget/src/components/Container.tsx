import { convertToPxValue } from "@/utils/style";
import styled, { css } from "styled-components";
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
  height: ${({ height = "auto" }) => convertToPxValue(height)};
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

export type LoadingPulseAnimationProps = {
  active?: boolean;
  speedMs?: number;
  opacity?: number;
  color?: string;
  radius?: string;
};

/**
 * Reusable shimmer/stripe animation. Apply it to any container.
 */
export const loadingPulseAnimation = ({
  active = true,
  speedMs = 1000,
  opacity = 0.6,
  color,
  radius,
}: LoadingPulseAnimationProps = {}) => css`
  position: relative;
  ${active
    ? css`
        &::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: ${radius ?? "inherit"};
          opacity: ${opacity};
          pointer-events: none;
          background: ${({ theme }) => css`
            linear-gradient(
              90deg,
              transparent 0%,
              transparent 30%,
              ${color ?? theme.primary.text.normal} 50%,
              transparent 54%,
              transparent 100%
            )
          `};
          background-size: 200% 100%;
          background-position: 100% 0;
          animation: loadingPulse ${speedMs}ms linear infinite;

          mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          mask-composite: exclude;
          padding: 2px;
        }
      `
    : ""}
  @keyframes loadingPulse {
    0% {
      background-position: 100% 0;
    }
    100% {
      background-position: -100% 0;
    }
  }
`;
