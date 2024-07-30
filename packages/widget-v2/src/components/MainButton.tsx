import { styled } from 'styled-components';
import { Row } from './Layout';
import { SmallText, Text } from './Typography';
import { PlusIcon } from '../icons/PlusIcon';
import { useTheme } from 'styled-components';
import { CheckmarkIcon } from '../icons/CheckmarkIcon';
import { LeftArrowIcon, RightArrowIcon } from '../icons/ArrowIcon';
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
  disabled?: boolean;
  loading?: boolean;
  loadingTimeString?: string;
  onClick?: () => void;
};

export const MainButton = ({
  label,
  icon = 'none',
  leftIcon = 'none',
  backgroundColor,
  disabled,
  loading,
  loadingTimeString,
  onClick,
}: MainButtonProps) => {
  const theme = useTheme();
  backgroundColor ??= disabled ? theme.secondary.background : theme.brandColor;

  const Icon = iconMap[icon];
  const LeftIcon = iconMap[leftIcon];

  if (loading) {
    return (
      <StyledMainButton
        align="center"
        justify="center"
        backgroundColor={theme.backgroundColor}
        loading={loading}
      >
        <StyledOverlay
          className="overlay"
          justify="space-between"
          padding={20}
          backgroundColor={theme.backgroundColor}
        >
          <Text fontSize={24} style={{ opacity: 0.5 }}>
            {label}
          </Text>
          {loadingTimeString && (
            <StyledTimeRemaining align="center" justify="center">
              <SmallText>{loadingTimeString}</SmallText>
            </StyledTimeRemaining>
          )}
        </StyledOverlay>
      </StyledMainButton>
    );
  }

  return (
    <StyledMainButton
      align="center"
      justify="space-between"
      padding={20}
      backgroundColor={backgroundColor}
      disabled={disabled}
      onClick={onClick}
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
})<{ backgroundColor?: string; disabled?: boolean; loading?: boolean }>`
  position: relative;
  border: none;
  background-color: ${(props) => props.backgroundColor};
  height: 70px;
  width: 480px;
  border-radius: 25px;
  overflow: hidden;

  &:hover {
    cursor: pointer;
  }

  ${(props) => props.disabled && 'opacity: 0.5'};

  ${(props) =>
    (props.loading || props.disabled) &&
    `
      background-color: ${props.theme.secondary.background};
      &:hover {
        cursor: not-allowed;
      }
    `}

  ${(props) =>
    props.loading &&
    `
    &:before {
      content: "";
      position: absolute;
      height: 500px;
      width: 500px;
      opacity: 0.5;
      background-image: conic-gradient(transparent, transparent, transparent, ${props.theme.textColor});
      animation: rotate 4s linear infinite;
    }
    @keyframes rotate {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `}
`;

const StyledTimeRemaining = styled(Row)`
  background-color: ${(props) => props.theme.secondary.background};
  padding: 16px;
  border-radius: 10px;
`;

const StyledOverlay = styled(Row)<{ backgroundColor?: string }>`
  position: absolute;
  height: 66px;
  width: 476px;
  border-radius: 24px;
  background-color: ${(props) => props.backgroundColor};
`;
