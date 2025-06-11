import { styled } from "styled-components";
import { Row } from "@/components/Layout";
import { SmallText, Text } from "@/components/Typography";
import { useTheme } from "styled-components";
import { ICONS, iconMap } from "@/icons";
import { ReactNode } from "react";
import { RouteResponse } from "@skip-go/client";
import { transition } from "@/utils/transitions";
import { px } from "@/utils/style";

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
  route?: RouteResponse;
  isGoFast?: boolean;
  fontSize?: number;
};

type LoadingButtonProps = MainButtonProps;

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
  fontSize = 24,
}: MainButtonProps) => {
  const theme = useTheme();
  backgroundColor ??= disabled ? theme.secondary.background.normal : theme.brandColor;
  const textColor = disabled ? theme.primary.text.ultraLowContrast : theme.brandTextColor;

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
        fontSize={fontSize}
      />
    );
  }

  return (
    <MainButtonContainer>
      <StyledMainButton
        align="center"
        justify="space-between"
        backgroundColor={backgroundColor}
        disabled={disabled}
        onClick={onClick}
      >
        {leftIcon ? (
          <Row align="center" gap={10}>
            <LeftIcon backgroundColor={textColor} color={backgroundColor} />
            <MainButtonText color={textColor} fontSize={fontSize}>
              {label}
            </MainButtonText>
          </Row>
        ) : (
          <MainButtonText capitalize color={textColor} fontSize={fontSize}>
            {label}
          </MainButtonText>
        )}

        <StyledIcon>
          <Icon color={textColor} />
        </StyledIcon>
      </StyledMainButton>
    </MainButtonContainer>
  );
};

export const LoadingButton = ({
  label,
  backgroundColor,
  loadingTimeString,
  isGoFast,
  extra,
  fontSize,
}: LoadingButtonProps) => {
  const theme = useTheme();
  return (
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
        <MainButtonText color={theme.primary.text.ultraLowContrast} fontSize={fontSize}>
          {label}
        </MainButtonText>
        {loadingTimeString && (
          <StyledTimeRemaining align="center" justify="center">
            {extra}
            <SmallText>{loadingTimeString}.</SmallText>
          </StyledTimeRemaining>
        )}
      </StyledOverlay>
    </StyledLoadingButton>
  );
};

const MainButtonText = styled(Text).attrs({
  fontWeight: "bold",
  capitalize: true,
  letterSpacing: "-0.015em",
})`
  z-index: 1;
  letter-spacing: -0.015em;
  @media (max-width: 767px) {
    font-size: 20px;
  }
`;

// on hover mask to lighten the button
const MainButtonContainer = styled.div`
  position: relative;
  overflow: hidden;
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: ${({ theme }) => px(theme.borderRadius.mainButton)};
    background-color: rgba(255, 255, 255, 0);
    pointer-events: none;
    ${transition(["background-color"], "fast", "easeOut")};
  }
  &:hover::after {
    background-color: rgba(255, 255, 255, 0.15);
  }
`;

const StyledMainButton = styled(Row).attrs({
  as: "button",
})<{ backgroundColor?: string; disabled?: boolean; loading?: boolean }>`
  position: relative;
  border: none;
  background: ${({ theme, backgroundColor }) => backgroundColor ?? theme.brandColor};
  height: 70px;
  padding: 20px;
  width: 100%;
  border-radius: ${({ theme }) => px(theme.borderRadius.mainButton)};
  overflow: hidden;

  &:hover {
    cursor: pointer;
  }

  ${(props) =>
    props.disabled &&
    `
      background: ${props.theme.secondary.background.normal};
      &:hover {
        cursor: not-allowed;
      }
    `};

  @media (max-width: 767px) {
    height: 65px;
    padding: 15px;
  }
`;

const StyledLoadingButton = styled(StyledMainButton)<{ isGoFast?: boolean }>`
  background: ${(props) => props.theme.secondary.background.normal};
  &:hover {
    cursor: not-allowed;
  }

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: ${(props) => (props.isGoFast ? "0.9" : "0.6")};
    background: linear-gradient(
      90deg,
      transparent 0%,
      transparent 30%,
      ${(props) => (props.isGoFast ? props.theme.brandColor : props.theme.primary.text.normal)} 50%,
      transparent 54%,
      transparent 100%
    );
    background-size: 200% 100%;
    background-position: 100% 0;
    animation: loadingPulse ${(props) => (props.isGoFast ? ".6s" : "1s")} linear infinite;
  }

  @keyframes loadingPulse {
    0% {
      background-position: 100% 0;
    }
    100% {
      background-position: -100% 0;
    }
  }
  @media (max-width: 767px) {
    height: 65px;
    padding: 15px;
  }
`;

const StyledTimeRemaining = styled(Row)`
  background: ${(props) => props.theme.secondary.background.normal};
  padding: 16px;
  border-radius: 10px;
  height: 40px;
  gap: 5px;
`;

const StyledOverlay = styled(Row)<{ backgroundColor?: string }>`
  position: absolute;
  height: 66px;
  left: 2px;
  right: 0;
  width: calc(100% - 4px);
  border-radius: ${({ theme }) => px(theme.borderRadius.mainButton)};
  background: ${({ theme }) => theme.primary.background.normal};

  @media (max-width: 767px) {
    height: 61px;
  }
`;

const StyledIcon = styled.div`
  z-index: 1;

  svg {
    display: block;
  }
`;
