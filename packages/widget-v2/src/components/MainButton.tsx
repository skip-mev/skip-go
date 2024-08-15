import { styled } from 'styled-components';
import { Row } from './Layout';
import { SmallText, Text } from './Typography';
import { useTheme } from 'styled-components';
import { ICONS, iconMap } from '../icons';
import { getBrandButtonTextColor } from '../utils/colors';

export type MainButtonProps = {
  label: string;
  icon?: ICONS;
  leftIcon?: ICONS;
  backgroundColor?: string;
  disabled?: boolean;
  loading?: boolean;
  loadingTimeString?: string;
  onClick?: () => void;
};

export const MainButton = ({
  label,
  icon = ICONS.none,
  leftIcon = ICONS.none,
  backgroundColor,
  disabled,
  loading,
  loadingTimeString,
  onClick,
}: MainButtonProps) => {
  const theme = useTheme();
  backgroundColor ??= disabled
    ? theme.secondary.background.normal
    : theme.brandColor;

  const textColor = getBrandButtonTextColor(backgroundColor);

  const Icon = iconMap[icon];
  const LeftIcon = iconMap[leftIcon];

  if (loading) {
    return (
      <LoadingButton
        label={label}
        backgroundColor={theme.primary.background.normal}
        loadingTimeString={loadingTimeString}
      />
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
          <LeftIcon backgroundColor={textColor} color={backgroundColor} />
          <Text
            fontSize={24}
            color={textColor}
            mainButtonColor={backgroundColor}
          >
            {label}
          </Text>
        </Row>
      ) : (
        <Text fontSize={24} color={textColor} mainButtonColor={backgroundColor}>
          {label}
        </Text>
      )}

      <Icon backgroundColor={textColor} color={backgroundColor} />
    </StyledMainButton>
  );
};

export const LoadingButton = ({
  label,
  backgroundColor,
  loadingTimeString,
}: MainButtonProps) => (
  <StyledLoadingButton
    align="center"
    justify="center"
    backgroundColor={backgroundColor}
  >
    <StyledOverlay
      className="overlay"
      justify="space-between"
      padding={20}
      backgroundColor={backgroundColor}
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
  </StyledLoadingButton>
);

export const SpinningBorderAnimation = ({
  backgroundColor,
  children,
  width,
  height,
  borderSize = 3,
}: {
  backgroundColor: string;
  children?: React.ReactNode;
  width: number;
  height: number;
  borderSize: number;
}) => (
  <StyledLoadingContainer
    align="center"
    justify="center"
    width={width}
    height={height}
    borderSize={borderSize}
  >
    <StyledLoadingOverlay
      className="overlay"
      justify="space-between"
      backgroundColor={backgroundColor}
    >
      {children}
    </StyledLoadingOverlay>
  </StyledLoadingContainer>
);

const StyledMainButton = styled(Row).attrs({
  as: 'button',
})<{ backgroundColor?: string; disabled?: boolean; loading?: boolean }>`
  position: relative;
  border: none;
  background-color: ${({ theme, backgroundColor }) =>
    backgroundColor ?? theme.brandColor};
  height: 70px;
  width: 480px;
  border-radius: 25px;
  overflow: hidden;

  &:hover {
    cursor: pointer;
  }

  ${(props) =>
    props.disabled &&
    `
      opacity: 0.5;
      background-color: ${props.theme.secondary.background.normal};
      &:hover {
        cursor: not-allowed;
      }
    `};
`;

const StyledLoadingContainer = styled(Row)<{
  height: number;
  width: number;
  borderSize: number;
}>`
  position: relative;
  overflow: hidden;
  height: ${({ height, borderSize }) => height + borderSize * 2}px;
  width: ${({ width, borderSize }) => width + borderSize * 2}px;
  margin-left: -${({ borderSize }) => borderSize}px;
  border-radius: 50%;

  &:before {
    content: '';
    position: absolute;
    height: ${({ height }) => `${height + 20}px;`}
    width: ${({ width }) => `${width + 20}px;`}
    background-image: conic-gradient(
      transparent,
      transparent,
      transparent,
      ${(props) => props.theme.success.text}
    );
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
`;

const StyledLoadingButton = styled(StyledMainButton)`
  background-color: ${(props) => props.theme.secondary.background.normal};
  &:hover {
    cursor: not-allowed;
  }

  &:before {
    content: '';
    position: absolute;
    height: 500px;
    width: 500px;
    opacity: 0.5;
    background-image: conic-gradient(
      transparent,
      transparent,
      transparent,
      ${(props) => props.theme.primary.text.normal}
    );
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
`;

const StyledTimeRemaining = styled(Row)`
  background-color: ${(props) => props.theme.secondary.background.normal};
  padding: 16px;
  border-radius: 10px;
`;

const StyledOverlay = styled(Row)<{ backgroundColor?: string }>`
  position: absolute;
  height: 66px;
  width: 476px;
  border-radius: 24px;
  background-color: ${({ theme }) => theme.primary.background.normal};
`;

const StyledLoadingOverlay = styled(Row)<{ backgroundColor?: string }>`
  position: absolute;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.primary.background.normal};
`;
