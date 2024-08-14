import { Row } from '../../components/Layout';
import { GhostButton } from '../../components/Button';

export type SwapFlowHeaderItemButton = {
  content: React.ReactNode;
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
  return (
    <Row justify="space-between">
      {leftButton && (
        <GhostButton gap={5} onClick={leftButton.onClick}>
          {leftButton.content}
        </GhostButton>
      )}

      <Row align="center" gap={10}>
        {rightContent}
        {rightButton && (
          <GhostButton gap={5} onClick={rightButton.onClick}>
            {rightButton.content}
          </GhostButton>
        )}
      </Row>
    </Row>
  );
};
