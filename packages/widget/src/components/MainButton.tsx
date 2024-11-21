import { styled } from "styled-components";
import { Row } from "@/components/Layout";
import { SmallText, Text } from "@/components/Typography";
import { useTheme } from "styled-components";
import { ICONS, iconMap } from "@/icons";
import { getBrandButtonTextColor } from "@/utils/colors";
import { ReactNode } from "react";
import { RouteResponse } from "@skip-go/client";

export type MainButtonProps = {
  label: string;
  icon?: ICONS;
  leftIcon?: ICONS;
  backgroundColor?: string;
  disabled?: boolean;
  loading?: boolean;
  loadingTimeString?: string;
  onClick?: () => void;
  extra?: ReactNode;
  route?: RouteResponse
  isGoFast?: boolean;
};

type LoadingButtonProps = MainButtonProps & {
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
  extra,
  isGoFast,
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
        extra={extra}
        isGoFast={isGoFast}
      />
    );
  }

  return (
    <MainButtonContainer>
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
              fontWeight="bold"
              fontSize={24}
              color={textColor}
              mainButtonColor={backgroundColor}
              letterSpacing="-0.015em"
              capitalize
            >
              {label}
            </Text>
          </Row>
        ) : (
          <Text fontWeight="bold" capitalize fontSize={24} color={textColor} mainButtonColor={backgroundColor} letterSpacing="-0.015em">
            {label}
          </Text>
        )}

        <Icon backgroundColor={textColor} color={backgroundColor} />
      </StyledMainButton>
    </MainButtonContainer>
  );
};

export const LoadingButton = ({
  label,
  backgroundColor,
  loadingTimeString,
  isGoFast,
  extra
}: LoadingButtonProps) => (
  <StyledLoadingButton
    align="center"
    justify="center"
    backgroundColor={backgroundColor}
    isGoFast={isGoFast}
  >
    <StyledOverlay
      className="overlay"
      justify="space-between"
      align="center"
      padding={20}
      backgroundColor={backgroundColor}
    >
      <Text fontWeight="bold" fontSize={24} style={{ opacity: 0.5 }} letterSpacing="-0.015em">
        {label}
      </Text>
      {loadingTimeString && (
        <StyledTimeRemaining align="center" justify="center">
          {extra}
          <SmallText>{loadingTimeString}.</SmallText>
        </StyledTimeRemaining>
      )}
    </StyledOverlay>
  </StyledLoadingButton>
);

// on hover mask to lighten the button
const MainButtonContainer = styled.div`
  position: relative;
  overflow: hidden;
  &:hover::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 25px;
    background-color: rgba(255, 255, 255, 0.1);
    pointer-events: none;
  }
`;

const StyledMainButton = styled(Row).attrs({
  as: "button",
}) <{ backgroundColor?: string; disabled?: boolean; loading?: boolean }>`
  position: relative;
  border: none;
  background-color: ${({ theme, backgroundColor }) =>
    backgroundColor ?? theme.brandColor};
  height: 70px;
  width: 100%;
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

const StyledLoadingButton = styled(StyledMainButton) <{ isGoFast?: boolean; }>`
  background-color: ${(props) => props.theme.secondary.background.normal};
  &:hover {
    cursor: not-allowed;
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: ${(props) =>
    props.isGoFast
      ? '0.9'
      : '0.6'};
    background: linear-gradient(
      90deg,
      transparent 0%,
      transparent 10%,
      ${(props) =>
    props.isGoFast
      ? props.theme.brandColor
      : props.theme.primary.text.normal} 50%,
      transparent 55%,
      transparent 100%
    );
    background-size: 200% 100%;
    background-position: 100% 0;
    animation: loadingPulse ${(props) => (props.isGoFast ? '.6s' : '1s')} linear infinite;
  }

  @keyframes loadingPulse {
    0% {
      background-position: 100% 0;
    }
    100% {
      background-position: -100% 0;
    }
  }
`;

const StyledTimeRemaining = styled(Row)`
  background-color: ${(props) => props.theme.secondary.background.normal};
  padding: 16px;
  border-radius: 10px;
  height: 40px;
  gap: 5px
`;

const StyledOverlay = styled(Row) <{ backgroundColor?: string }>`
  position: absolute;
  height: 66px;
  left:2px;
  right: 0;
  width: calc(100% - 4px);
  border-radius: 24px;
  background-color: ${({ theme }) => theme.primary.background.normal};
`;
