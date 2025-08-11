import React, { useRef, useEffect, useState } from "react";
import { styled } from "styled-components";
import { SwapExecutionPageRouteSimple } from "./SwapExecutionPageRouteSimple";
import { SwapExecutionPageRouteDetailed } from "./SwapExecutionPageRouteDetailed";
import { SwapExecutionPageRouteProps } from "./SwapExecutionPageRouteSimple";
import { convertToPxValue } from "@/utils/style";
import { Container } from "@/components/Container";

type SwapExecutionPageRouteContainerProps = {
  showDetailed: boolean;
} & SwapExecutionPageRouteProps;

export const SwapExecutionPageRouteContainer = ({
  showDetailed,
  ...routeProps
}: SwapExecutionPageRouteContainerProps) => {
  const simpleRef = useRef<HTMLDivElement>(null);
  const detailedRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<number>(0);

  useEffect(() => {
    const updateHeight = () => {
      const activeRef = showDetailed ? detailedRef : simpleRef;
      if (activeRef.current) {
        const height = activeRef.current.scrollHeight;
        setContainerHeight(height);
      }
    };

    updateHeight();

    // Add a small delay to ensure content is rendered
    const timeoutId = setTimeout(updateHeight, 10);

    return () => clearTimeout(timeoutId);
  }, [showDetailed, routeProps.operations, routeProps.statusData, routeProps.bottomContent]);

  return (
    <StyledContainer style={{ height: containerHeight }}>
      <StyledRouteWrapper ref={simpleRef} isVisible={!showDetailed} isActive={!showDetailed}>
        <SwapExecutionPageRouteSimple {...routeProps} />
      </StyledRouteWrapper>
      <StyledRouteWrapper ref={detailedRef} isVisible={showDetailed} isActive={showDetailed}>
        <SwapExecutionPageRouteDetailed {...routeProps} />
      </StyledRouteWrapper>
    </StyledContainer>
  );
};

const StyledContainer = styled(Container).attrs({
  padding: 0,
})`
  overflow: hidden;
  transition: height 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 225px;
`;

const StyledRouteWrapper = styled.div<{ isVisible: boolean; isActive: boolean }>`
  position: ${({ isActive: $isActive }) => ($isActive ? "relative" : "absolute")};
  top: 0;
  left: 0;
  right: 0;
  opacity: ${({ isVisible: $isVisible }) => ($isVisible ? 1 : 0)};
  transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: ${({ isVisible: $isVisible }) => ($isVisible ? "auto" : "none")};
`;
