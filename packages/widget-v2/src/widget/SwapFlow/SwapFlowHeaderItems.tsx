import { Row } from '../../components/Layout';
import { GhostButton } from '../../components/Button';
import { iconMap, ICONS } from '../../icons';

export type SwapFlowHeaderItemButton = {
  label: React.ReactNode;
  icon?: ICONS;
  onClick?: () => void;
};

type SwapFlowHeaderItemsProps = {
  leftButton?: SwapFlowHeaderItemButton;
  rightButton?: SwapFlowHeaderItemButton;
  rightContent?: React.ReactNode;
};

export const SwapFlowHeaderItems = ({
  leftButton,
  rightButton,
  rightContent,
}: SwapFlowHeaderItemsProps) => {
  const LeftIcon = iconMap[leftButton?.icon || ICONS.none];
  const RightIcon = iconMap[rightButton?.icon || ICONS.none];
  return (
    <Row justify="space-between">
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
    </Row>
  );
};
