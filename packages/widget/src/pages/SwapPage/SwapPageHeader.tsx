import { Row } from "@/components/Layout";
import { GhostButton } from "@/components/Button";
import { iconMap, ICONS } from "@/icons";
import { styled } from "styled-components";

export type SwapPageHeaderItemButton = {
  label: React.ReactNode;
  icon?: ICONS;
  onClick?: () => void;
};

type SwapPageHeaderProps = {
  leftButton?: SwapPageHeaderItemButton;
  centerButton?: SwapPageHeaderItemButton;
  rightButton?: SwapPageHeaderItemButton;
  rightContent?: React.ReactNode;
};

export const SwapPageHeader = ({
  leftButton,
  centerButton,
  rightButton,
  rightContent,
}: SwapPageHeaderProps) => {
  const LeftIcon = iconMap[leftButton?.icon || ICONS.none];
  const CenterIcon = iconMap[centerButton?.icon || ICONS.none];
  const RightIcon = iconMap[rightButton?.icon || ICONS.none];

  return (
    <StyledSwapPageHeaderContainer align="center" justify="space-between">
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
    </StyledSwapPageHeaderContainer>
  );
};

const StyledSwapPageHeaderContainer = styled(Row)`
  height: 30px;
  position: relative;
`;

const CenterContainer = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;
