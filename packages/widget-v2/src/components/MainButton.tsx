import { styled } from 'styled-components';
import { Row } from './Layout';
import { Text } from './Typography';
import { PlusIcon } from '../icons/PlusIcon';
import { useTheme } from 'styled-components';
import { CheckmarkIcon } from '../icons/CheckmarkIcon';
import { LeftArrowIcon, RightArrowIcon } from '../icons/ArrowIcon';
import { ReactNode } from 'react';
import { SwapIcon } from '../icons/SwapIcon';
import { WarningIcon } from '../icons/WarningIcon';

export enum ICONS {
  plus,
  checkmark,
  rightArrow,
  leftArrow,
  swap,
  warning,
}

const iconMap = {
  [ICONS.plus]: PlusIcon,
  [ICONS.checkmark]: CheckmarkIcon,
  [ICONS.rightArrow]: RightArrowIcon,
  [ICONS.leftArrow]: LeftArrowIcon,
  [ICONS.swap]: SwapIcon,
  [ICONS.warning]: WarningIcon,
  none: () => null,
};

export type MainButtonProps = {
  label: string;
  icon?: ICONS | 'none';
  leftIcon?: ICONS | 'none';
  backgroundColor?: string;
  swapInProgress?: boolean;
};

export const MainButton = ({
  label,
  icon = 'none',
  leftIcon = 'none',
  backgroundColor,
  swapInProgress,
}: MainButtonProps) => {
  const theme = useTheme();
  backgroundColor ??= theme.brandColor;

  const Icon = iconMap[icon];
  const LeftIcon = iconMap[leftIcon];

  if (swapInProgress) {
    return (
      <SwapInProgress align="center" justify="space-between" padding={20}>
        <Text fontSize={24}> Swap In Progress </Text>
      </SwapInProgress>
    );
  }

  return (
    <StyledMainButton
      align="center"
      justify="space-between"
      padding={20}
      backgroundColor={backgroundColor}
    >
      {leftIcon ? (
        <Row align="center" gap={10}>
          <LeftIcon backgroundColor={backgroundColor} color={theme.textColor} />
          <Text fontSize={24}>{label}</Text>
        </Row>
      ) : (
        <Text fontSize={24}>{label}</Text>
      )}

      <Icon backgroundColor={backgroundColor} color={theme.textColor} />
    </StyledMainButton>
  );
};

const StyledMainButton = styled(Row).attrs({
  as: 'button',
})<{ backgroundColor?: string }>`
  border: none;
  background-color: ${(props) => props.backgroundColor};
  height: 70px;
  width: 480px;
  border-radius: 25px;

  &:hover {
    cursor: pointer;
  }
`;

const SwapInProgress = styled(Row)`
  height: 70px;
  width: 480px;
  border-radius: 25px;
  background-color: ${(props) => props.theme.backgroundColor};
`;
