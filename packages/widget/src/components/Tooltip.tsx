import styled, { keyframes, useTheme } from "styled-components";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ANIMATION_TIMINGS, EASINGS } from "@/utils/transitions";
import { SmallText } from "./Typography";
import { isMobile } from "@/utils/os";
import { createPortal } from "react-dom";
import { ShadowDomAndProviders } from "@/widget/ShadowDomAndProviders";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const Tooltip = ({
  children,
  content,
  direction = "right",
  style,
}: {
  children?: React.ReactNode;
  content?: React.ReactNode;
  direction?: "left" | "right";
  style?: React.CSSProperties;
}) => {
  const theme = useTheme();
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipTriggerContainerRef = useRef<HTMLDivElement | null>(null);
  const tooltipContainerRef = useRef<HTMLSpanElement | null>(null);
  const [tooltipTop, setTooltipTop] = useState<number>(0);
  const [tooltipPosition, setTooltipPosition] = useState({ left: 0, top: 0 });

  useEffect(() => {
    if (showTooltip && tooltipContainerRef.current && tooltipTriggerContainerRef.current) {
      const rect = tooltipTriggerContainerRef.current.getBoundingClientRect();
      const height = tooltipContainerRef.current.offsetHeight;
      const containerHeight = tooltipTriggerContainerRef.current.offsetHeight;

      const top = rect.top + rect.height / 2 - height / 2;
      const left = direction === "right" ? rect.right + OFFSET_GAP : rect.left - OFFSET_GAP;

      setTooltipPosition({ left, top });
      setTooltipTop(height / 2 - containerHeight / 2);
    }
  }, [showTooltip, direction]);

  const renderContent = useMemo(() => {
    if (typeof content === "string") {
      return (
        <SmallText normalTextColor textWrap="nowrap">
          {content}
        </SmallText>
      );
    }
    return content;
  }, [content]);

  if (isMobile()) {
    return children;
  }

  return (
    <StyledTooltipTriggerContainer
      style={style}
      ref={tooltipTriggerContainerRef}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      {showTooltip &&
        createPortal(
          <ShadowDomAndProviders theme={theme} disableShadowDom>
            <StyledTooltipContainer
              ref={tooltipContainerRef}
              direction={direction}
              top={tooltipTop}
              style={{
                position: "fixed",
                left: tooltipPosition.left,
                top: tooltipPosition.top,
                zIndex: 9999,
              }}
            >
              {renderContent}
            </StyledTooltipContainer>
          </ShadowDomAndProviders>,
          document.body,
        )}
    </StyledTooltipTriggerContainer>
  );
};

const StyledTooltipTriggerContainer = styled.span`
  position: relative;
  display: flex;
`;

const OFFSET_GAP = 5;

const StyledTooltipContainer = styled.span<{
  offset?: number;
  top?: number;
  direction?: "left" | "right";
}>`
  position: absolute;
  padding: 13px;
  border-radius: 13px;
  border: 1px solid ${({ theme }) => theme.primary.text.ultraLowContrast};
  background: ${({ theme }) => theme.secondary.background.normal};
  top: ${({ top }) => top && `-${top}px`};
  ${({ offset, direction }) => {
    if (!offset) return;
    if (!direction) return;
    switch (direction) {
      case "right":
        return `left:${offset + OFFSET_GAP}px`;
      case "left":
        return `right:${offset + OFFSET_GAP}px`;
      default:
    }
  }};
  z-index: 1;
  animation: ${fadeIn} ${ANIMATION_TIMINGS.medium} ${EASINGS.easeOut};
`;
