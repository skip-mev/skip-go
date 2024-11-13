import { useMemo } from "react";
import { Row } from "@/components/Layout";
import { GhostButton } from "@/components/Button";
import { SkipLogoIcon } from "@/icons/SkipLogoIcon";
import { SpeedometerIcon } from "@/icons/SpeedometerIcon";
import { useAtomValue } from "jotai";
import { convertSecondsToMinutesOrHours } from "@/utils/number";
import { skipRouteAtom } from "@/state/route";
import { SignatureIcon } from "@/icons/SignatureIcon";
import pluralize from "pluralize";
import { styled } from "styled-components";
import { CogIcon } from "@/icons/CogIcon";
import { swapSettingsAtom, defaultSwapSettings } from "@/state/swapPage";
import { useIsMobileScreenSize } from "@/hooks/useIsMobileScreenSize";

export type SwapPageFooterItemsProps = {
  rightContent?: React.ReactNode;
  showRouteInfo?: boolean;
  showEstimatedTime?: boolean;
};

export const SwapPageFooterItems = ({
  rightContent = null,
  showRouteInfo,
  showEstimatedTime,
}: SwapPageFooterItemsProps) => {
  const { data: route, isLoading } = useAtomValue(skipRouteAtom);
  const swapSettings = useAtomValue(swapSettingsAtom);
  const isMobileScreenSize = useIsMobileScreenSize();

  const settingsChanged = useMemo(() => {
    return (
      swapSettings.slippage !== defaultSwapSettings.slippage ||
      swapSettings.customGasAmount !== defaultSwapSettings.customGasAmount
    );
  }, [swapSettings]);

  const estimatedTime = convertSecondsToMinutesOrHours(
    route?.estimatedRouteDurationSeconds
  );

  const routeRequiresMultipleSignatures =
    route?.txsRequired && route.txsRequired > 1;

  const renderSignatureRequired = useMemo(() => {
    return (
      <Row gap={4} align="center">
        <StyledSignatureRequiredContainer gap={5} align="center">
          <SignatureIcon />
          {route?.txsRequired} {pluralize("Signature", route?.txsRequired)}{" "}
          required
        </StyledSignatureRequiredContainer>
      </Row>
    );
  }, [route?.txsRequired]);

  const renderMobileContent = useMemo(() => {
    const renderLeftContent = () => {
      if (showRouteInfo && routeRequiresMultipleSignatures) {
        return renderSignatureRequired;
      }
      return (
        <Row align="center" gap={5}>
          Powered by <SkipLogoIcon />
        </Row>
      );
    };
    const renderRightContent = () => {
      if (rightContent) return rightContent;
      if (isLoading) return;
      if (showRouteInfo && route) {
        return (
          <Row align="center" gap={8}>
            {showEstimatedTime && estimatedTime && (
              <Row gap={6} align="center">
                <SpeedometerIcon />
                {estimatedTime}
                <CogIconWrapper>
                  <CogIcon height={13} width={13} />
                  {settingsChanged && <SettingsChangedIndicator />}
                </CogIconWrapper>
              </Row>
            )}
          </Row>
        );
      }
    };
    return (
      <>
        {renderLeftContent()}
        {renderRightContent()}
      </>
    );
  }, [
    estimatedTime,
    isLoading,
    renderSignatureRequired,
    rightContent,
    route,
    routeRequiresMultipleSignatures,
    settingsChanged,
    showEstimatedTime,
    showRouteInfo,
  ]);

  const renderDesktopContent = useMemo(() => {
    const renderRightContent = () => {
      if (rightContent) return rightContent;
      if (isLoading) return;
      if (showRouteInfo && route) {
        return (
          <Row align="center" gap={8}>
            {!isMobileScreenSize &&
              routeRequiresMultipleSignatures &&
              renderSignatureRequired}
            {showEstimatedTime && estimatedTime && (
              <Row gap={6} align="center">
                <SpeedometerIcon />
                {estimatedTime}
                <CogIconWrapper>
                  <CogIcon height={13} width={13} />
                  {settingsChanged && <SettingsChangedIndicator />}
                </CogIconWrapper>
              </Row>
            )}
          </Row>
        );
      }
    };
    return (
      <>
        <Row align="center" gap={5}>
          Powered by <SkipLogoIcon />
        </Row>
        {renderRightContent()}
      </>
    );
  }, [
    estimatedTime,
    isLoading,
    isMobileScreenSize,
    renderSignatureRequired,
    rightContent,
    route,
    routeRequiresMultipleSignatures,
    settingsChanged,
    showEstimatedTime,
    showRouteInfo,
  ]);

  if (isMobileScreenSize) {
    return renderMobileContent;
  }

  return renderDesktopContent;
};

export const SwapPageFooter = ({
  onClick,
  rightContent,
  showRouteInfo,
  showEstimatedTime,
  ...props
}: {
  onClick?: () => void;
} & SwapPageFooterItemsProps &
  React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <GhostButton gap={5} justify="space-between" onClick={onClick} {...props}>
      <SwapPageFooterItems
        rightContent={rightContent}
        showRouteInfo={showRouteInfo}
        showEstimatedTime={showEstimatedTime}
      />
    </GhostButton>
  );
};

export const StyledSignatureRequiredContainer = styled(Row)`
  ${({ theme }) => `color: ${theme.warning.text}`};
`;

const CogIconWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const SettingsChangedIndicator = styled.div`
  position: absolute;
  top: -2px;
  right: -2px;
  width: 4px;
  height: 4px;
  background-color: white;
  border-radius: 50%;
`;
