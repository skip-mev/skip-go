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
  rightButton?: SwapPageHeaderItemButton;
  rightContent?: React.ReactNode;
};

export const SwapPageHeader = ({
  leftButton,
  rightButton,
  rightContent,
}: SwapPageHeaderProps) => {
  const LeftIcon = iconMap[leftButton?.icon || ICONS.none];
  const RightIcon = iconMap[rightButton?.icon || ICONS.none];
  return (
    <StyledSwapPageHeaderContainer justify="space-between">
      {leftButton && (
        <GhostButton gap={5} align="center" onClick={leftButton.onClick}>
          <LeftIcon />
          {leftButton.label}
        </GhostButton>
      )}

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