import { Row } from "@/components/Layout";
import { GhostButton } from "@/components/Button";
import { iconMap, ICONS } from "@/icons";
import { styled } from "styled-components";
import React from "react";

export type PageHeaderItemButton = {
  label: React.ReactNode;
  icon?: ICONS | React.ReactElement;
  onClick?: () => void;
};

type PageHeaderProps = {
  leftButton?: PageHeaderItemButton;
  centerButton?: PageHeaderItemButton;
  rightButton?: PageHeaderItemButton;
  rightContent?: React.ReactNode;
};

export const PageHeader = ({
  leftButton,
  centerButton,
  rightButton,
  rightContent,
}: PageHeaderProps) => {
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
  const CenterIcon = renderIcon(centerButton?.icon);
  const RightIcon = renderIcon(rightButton?.icon);

  return (
    <StyledPageHeaderContainer align="center" justify="space-between">
      <Row align="center" gap={10}>
        {leftButton && (
          <GhostButton gap={5} align="center" onClick={leftButton.onClick}>
            <LeftIcon />
            {leftButton.label}
          </GhostButton>
        )}
      </Row>

      <CenterContainer>
        {centerButton && (
          <GhostButton gap={5} align="center" onClick={centerButton.onClick}>
            <CenterIcon />
            {centerButton.label}
          </GhostButton>
        )}
      </CenterContainer>

      <Row align="center" gap={10}>
        {rightContent}
        {rightButton && (
          <GhostButton gap={5} align="center" onClick={rightButton.onClick}>
            {rightButton.label}
            <RightIcon />
          </GhostButton>
        )}
      </Row>
    </StyledPageHeaderContainer>
  );
};

const StyledPageHeaderContainer = styled(Row)`
  height: 30px;
  position: relative;
`;

const CenterContainer = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;
