import { Row } from "@/components/Layout";
import { GhostButton } from "@/components/Button";
import { iconMap, ICONS } from "@/icons";
import { styled } from "styled-components";
import React from "react";

export type SwapPageHeaderItemButton = {
  label: React.ReactNode;
  icon?: ICONS | React.ReactElement;
  onClick?: () => void;
};

type SwapPageHeaderProps = {
  leftButton?: SwapPageHeaderItemButton;
  rightButton?: SwapPageHeaderItemButton;
  rightContent?: React.ReactNode;
};

export const SwapPageHeader = ({ leftButton, rightButton, rightContent }: SwapPageHeaderProps) => {
  const renderIcon = (icon?: ICONS | React.ReactElement) => {
    if (React.isValidElement(icon)) {
      return () => icon;
    }

    if (icon && icon in iconMap) {
      return iconMap[icon];
    }

    return () => null;
  };

  const LeftIcon = renderIcon(leftButton?.icon);
  const RightIcon = renderIcon(rightButton?.icon);
  return (
    <StyledSwapPageHeaderContainer justify="space-between">
      <Row align="center" gap={10}>
        {leftButton && (
          <GhostButton gap={5} align="center" onClick={leftButton.onClick}>
            <LeftIcon />
            {leftButton.label}
          </GhostButton>
        )}
      </Row>

      <Row align="center" gap={10}>
        {rightContent}
        {rightButton && (
          <GhostButton gap={5} align="center" onClick={rightButton.onClick}>
            {rightButton.label}
            <RightIcon />
          </GhostButton>
        )}
      </Row>
    </StyledSwapPageHeaderContainer>
  );
};

const StyledSwapPageHeaderContainer = styled(Row)`
  height: 30px;
`;
