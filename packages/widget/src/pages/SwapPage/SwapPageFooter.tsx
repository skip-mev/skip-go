import { useMemo } from "react";
import { Row } from "@/components/Layout";
import { GhostButton } from "@/components/Button";
import { SkipLogoIcon } from "@/icons/SkipLogoIcon";
import { useAtom, useAtomValue } from "jotai";
import { convertSecondsToMinutesOrHours } from "@/utils/number";
import { skipRouteAtom } from "@/state/route";
import { SignatureIcon } from "@/icons/SignatureIcon";
import pluralize from "pluralize";
import { styled } from "styled-components";
import { CogIcon } from "@/icons/CogIcon";
import { useSettingsChanged } from "@/hooks/useSettingsChanged";
import { routePreferenceAtom } from "@/state/swapPage";
import { RoutePreference } from "@/state/types";

export type SwapPageFooterItemsProps = {
  content?: React.ReactNode;
  showRouteInfo?: boolean;
  showEstimatedTime?: boolean;
};

export const poweredBySkipGo = (
  <Row align="center" gap={5}>
    Powered by <SkipLogoIcon />
  </Row>
);

export const SwapPageFooterItems = ({
  content = null,
  showRouteInfo,
  showEstimatedTime,
}: SwapPageFooterItemsProps) => {
  const { data: route, isLoading } = useAtomValue(skipRouteAtom);
  const settingsChanged = useSettingsChanged();
  const routePreference = useAtomValue(routePreferenceAtom);

  const estimatedTime = convertSecondsToMinutesOrHours(route?.estimatedRouteDurationSeconds);

  const routeRequiresMultipleSignatures = route?.txsRequired && route.txsRequired > 1;

  const renderSignatureRequired = useMemo(() => {
    if (!route?.txsRequired) return null;
    return (
      <Row gap={4} align="center">
        <StyledSignatureRequiredContainer gap={5} align="center">
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

  const renderContent = content ? (
    content
  ) : !isLoading && showRouteInfo && route ? (
    <Row align="flex-end" gap={10} height={13}>
      {showEstimatedTime && estimatedTime && (
        <>
          <Row align="flex-end" gap={3}>
            <CogIconWrapper>
              <CogIcon />
              {settingsChanged && <SettingsChangedIndicator />}
            </CogIconWrapper>
            Settings
          </Row>
          <Row gap={8} align="flex-end">
            {estimatedTime}
          </Row>
        </>
      )}
      {routeRequiresMultipleSignatures ? renderSignatureRequired : renderRoutePreference}
    </Row>
  ) : (
    <div></div>
  );

  return (
    <FooterItemsContainer>
      {renderContent}
      {poweredBySkipGo}
    </FooterItemsContainer>
  );
};

export const SwapPageFooter = ({
  onClick,
  content,
  showRouteInfo,
  showEstimatedTime,
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
      />
    </GhostButton>
  );
};

const FooterItemsContainer = styled(Row)`
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const StyledSignatureRequiredContainer = styled(Row)`
  ${({ theme }) => `color: ${theme.warning.text}`};
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
