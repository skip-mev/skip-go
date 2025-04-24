import { useMemo } from "react";
import { Row } from "@/components/Layout";
import { GhostButton } from "@/components/Button";
import { SkipLogoIcon } from "@/icons/SkipLogoIcon";
import { useAtomValue } from "jotai";
import { convertSecondsToMinutesOrHours } from "@/utils/number";
import { skipRouteAtom } from "@/state/route";
import { SignatureIcon } from "@/icons/SignatureIcon";
import pluralize from "pluralize";
import { styled } from "styled-components";
import { CogIcon } from "@/icons/CogIcon";
import { useSettingsChanged } from "@/hooks/useSettingsChanged";
import { routePreferenceAtom } from "@/state/swapPage";
import { RoutePreference } from "@/state/types";
import { useIsMobileScreenSize } from "@/hooks/useIsMobileScreenSize";
import { useIsGoFast } from "@/hooks/useIsGoFast";
import { getFeeList, getTotalFees } from "@/utils/route";

export type SwapPageFooterItemsProps = {
  content?: React.ReactNode;
  showRouteInfo?: boolean;
  showEstimatedTime?: boolean;
  highlightSettings?: boolean;
};

export const poweredBySkipGo = (
  <Row data-logo="skip-go" align="center" gap={5}>
    Powered by <SkipLogoIcon />
  </Row>
);

export const SwapPageFooterItems = ({
  content = null,
  showRouteInfo,
  showEstimatedTime,
  highlightSettings,
}: SwapPageFooterItemsProps) => {
  const { data: route, isLoading } = useAtomValue(skipRouteAtom);
  const settingsChanged = useSettingsChanged();
  const routePreference = useAtomValue(routePreferenceAtom);
  const isMobileScreenSize = useIsMobileScreenSize();
  const isGoFast = useIsGoFast(route);

  const feeList = useMemo(() => {
    if (!route) return [];
    return getFeeList(route);
  }, [route]);
  const totalFees = getTotalFees(feeList);


  const estimatedTime = convertSecondsToMinutesOrHours(route?.estimatedRouteDurationSeconds);

  const routeRequiresMultipleSignatures = route?.txsRequired && route.txsRequired > 1;

  const renderSignatureRequired = useMemo(() => {
    if (!route?.txsRequired) return null;
    return (
      <Row gap={4} align="center">
        <StyledSignatureRequiredContainer gap={5} align="flex-end">
          {route.txsRequired} {pluralize("Signature", route.txsRequired)} required
          <SignatureIcon />
        </StyledSignatureRequiredContainer>
      </Row>
    );
  }, [route?.txsRequired]);

  const renderRoutePreference = useMemo(() => {
    switch (routePreference) {
      case RoutePreference.FASTEST:
        return "Fastest route";
      case RoutePreference.CHEAPEST:
        return "Cheapest route";
    }
  }, [routePreference]);

  const renderMobileContent = useMemo(() => {
    const renderRightContent = () => {
      if (isGoFast) {
        return renderRoutePreference;
      }
      return poweredBySkipGo;
    };
    const renderLeftContent = () => {
      if (content) return content;
      if (isLoading) return;
      if (showRouteInfo && route) {
        return (
          <Row align="flex-end" gap={8}>
            {showEstimatedTime && estimatedTime && (
              <>
                <StyledSettingsContainer
                  align="flex-end"
                  gap={3}
                  highlightSettings={highlightSettings}
                >
                  <CogIconWrapper>
                    <CogIcon />
                    {settingsChanged && <SettingsChangedIndicator />}
                  </CogIconWrapper>
                  Settings
                </StyledSettingsContainer>
                <Row gap={8} align="flex-end">
                  {estimatedTime}
                </Row>
  
              </>
            )}
            <Row gap={8} align="flex-end">
              {totalFees?.formattedUsdAmount}
            </Row>
          </Row>
        );
      }
    };
    return (
      <>
        {renderLeftContent() ?? <div />}
        {renderRightContent()}
      </>
    );
  }, [
    content,
    estimatedTime,
    highlightSettings,
    isGoFast,
    isLoading,
    renderRoutePreference,
    route,
    settingsChanged,
    showEstimatedTime,
    showRouteInfo,
    totalFees?.formattedUsdAmount,
  ]);

  const renderDesktopContent = useMemo(() => {
    const renderLeftContent = () => {
      if (content) return content;
      if (isLoading) return;
      if (showRouteInfo && route) {
        return (
          <Row align="flex-end" gap={10} height={13}>
            {showEstimatedTime && estimatedTime && (
              <>
                <StyledSettingsContainer
                  align="flex-end"
                  gap={3}
                  highlightSettings={highlightSettings}
                >
                  <CogIconWrapper>
                    <CogIcon />
                    {settingsChanged && <SettingsChangedIndicator />}
                  </CogIconWrapper>
                  Settings
                </StyledSettingsContainer>
                <Row gap={8} align="flex-end">
                  {estimatedTime}
                </Row>
              </>
            )}
            <Row gap={8} align="flex-end">
              {totalFees?.formattedUsdAmount}
            </Row>
            {routeRequiresMultipleSignatures
              ? renderSignatureRequired
              : isGoFast
                ? renderRoutePreference
                : null}
          </Row>
        );
      }
    };
    return (
      <>
        {renderLeftContent() ?? <div />}
        {poweredBySkipGo}
      </>
    );
  }, [
    content,
    estimatedTime,
    highlightSettings,
    isGoFast,
    isLoading,
    renderRoutePreference,
    renderSignatureRequired,
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
  content,
  showRouteInfo,
  showEstimatedTime,
  highlightSettings,
  ...props
}: {
  onClick?: () => void;
} & SwapPageFooterItemsProps &
  React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <GhostButton
      gap={5}
      justify="space-between"
      align="center"
      onClick={onClick}
      height={35}
      {...props}
    >
      <SwapPageFooterItems
        content={content}
        showRouteInfo={showRouteInfo}
        showEstimatedTime={showEstimatedTime}
        highlightSettings={highlightSettings}
      />
    </GhostButton>
  );
};

export const StyledSignatureRequiredContainer = styled(Row)`
  ${({ theme }) => `color: ${theme.warning.text}`};
`;

const StyledSettingsContainer = styled(Row)<{ highlightSettings?: boolean }>`
  ${({ highlightSettings, theme }) => {
    if (highlightSettings) {
      return `color: ${theme.primary.text.normal}`;
    }
  }}
`;

const CogIconWrapper = styled(Row)`
  position: relative;

  svg {
    display: block;
  }
`;

const SettingsChangedIndicator = styled.div`
  position: absolute;
  top: -3px;
  right: -3px;
  width: 4px;
  height: 4px;
  background: ${({ theme }) => theme.primary.text.normal};
  border-radius: 50%;
`;
