import React, { useMemo } from "react";
import { Row } from "@/components/Layout";
import { GhostButton } from "@/components/Button";
import { SkipLogoIcon } from "@/icons/SkipLogoIcon";
import { SignatureIcon } from "@/icons/SignatureIcon";
import { CogIcon } from "@/icons/CogIcon";
import { useAtomValue } from "jotai";
import pluralize from "pluralize";
import styled from "styled-components";

import { skipRouteAtom } from "@/state/route";
import { routePreferenceAtom } from "@/state/swapPage";
import { RoutePreference } from "@/state/types";

import { useSettingsChanged } from "@/hooks/useSettingsChanged";
import { useIsMobileScreenSize } from "@/hooks/useIsMobileScreenSize";
import { useIsGoFast } from "@/hooks/useIsGoFast";

import { convertSecondsToMinutesOrHours } from "@/utils/number";
import { getFeeList, getTotalFees } from "@/utils/route";

export const PoweredBySkipGo = () => (
  <Row data-logo="skip-go" align="center" gap={5}>
    Powered by <SkipLogoIcon />
  </Row>
);

const EstimatedDuration = ({ seconds }: { seconds?: number }) => {
  const formatted = seconds
    ? convertSecondsToMinutesOrHours(seconds)
    : null;
  return formatted ? <Row gap={8} align="flex-end">{formatted}</Row> : null;
};

const Fee = ({ amount }: { amount?: string }) =>
  amount ? <Row gap={8} align="flex-end">Fee: {amount}</Row> : null;

const SettingsButton = ({
  highlight,
  changed,
}: {
  highlight?: boolean;
  changed: boolean;
}) => (
  <StyledSettingsContainer align="flex-end" gap={3} highlightSettings={highlight}>
    <CogIconWrapper>
      <CogIcon />
      {changed && <SettingsChangedIndicator />}
    </CogIconWrapper>
    Settings
  </StyledSettingsContainer>
);

const SignatureRequired = ({ count }: { count: number }) => (
  <Row gap={4} align="center">
    <StyledSignatureRequiredContainer gap={5} align="flex-end">
      {`${count} ${pluralize("Signature", count)} required`}
      <SignatureIcon />
    </StyledSignatureRequiredContainer>
  </Row>
);

const RoutePreferenceLabel = ({ preference }: { preference: RoutePreference }) => {
  const label =
    preference === RoutePreference.FASTEST
      ? "Fastest route"
      : "Cheapest route";
  return <span>{label}</span>;
};

export type SwapPageFooterItemsProps = {
  content?: React.ReactNode;
  showRouteInfo?: boolean;
  showEstimatedTime?: boolean;
  highlightSettings?: boolean;
};

export const SwapPageFooterItems: React.FC<SwapPageFooterItemsProps> = ({
  content,
  showRouteInfo = false,
  showEstimatedTime = false,
  highlightSettings = false,
}) => {
  const { data: route, isLoading } = useAtomValue(skipRouteAtom);
  const routePreference = useAtomValue(routePreferenceAtom);
  const settingsChanged = useSettingsChanged();
  const isMobile = useIsMobileScreenSize();
  const isGoFast = useIsGoFast(route);

  const estimatedSeconds = route?.estimatedRouteDurationSeconds;
  const fees = useMemo(() => (route ? getFeeList(route) : []), [route]);
  const totalFees = getTotalFees(fees)?.formattedUsdAmount;
  const signaturesRequired = 2

  const leftContent = () => {
    if (content) return content;
    if (isLoading || !showRouteInfo || !route) return null;

    return (
      <Row align="flex-end" gap={10} height={isMobile ? undefined : 13}>
        {showEstimatedTime && (
          <>
            <SettingsButton highlight={highlightSettings} changed={settingsChanged} />
            <EstimatedDuration seconds={estimatedSeconds} />
          </>
        )}
        <Fee amount={totalFees} />
        {!isMobile && signaturesRequired > 1 && <SignatureRequired count={signaturesRequired} />}
        {!isMobile && signaturesRequired <= 1 && isGoFast && (
          <RoutePreferenceLabel preference={routePreference} />
        )}
      </Row>
    );
  };

  const rightContent = () => (
    <>
     <RoutePreferenceLabel preference={routePreference} />
      <PoweredBySkipGo />
    </>
  )
    // isMobile && isGoFast ? (
    //   <RoutePreferenceLabel preference={routePreference} />
    // ) : (
    //   <PoweredBySkipGo />
    // );

  console.log(rightContent())
  return (
    <>
      {leftContent() || <div />}
      {rightContent()}
      <PoweredBySkipGo />

    </>
  );
};

// Footer Button
export const SwapPageFooter: React.FC<
  { onClick?: () => void } & SwapPageFooterItemsProps & React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ onClick, ...props }) => (
  <GhostButton
    gap={5}
    justify="space-between"
    align="center"
    onClick={onClick}
    height={35}
    {...props}
  >
    <SwapPageFooterItems {...props} />
  </GhostButton>
);

// Styled Components
export const StyledSignatureRequiredContainer = styled(Row)`
  ${({ theme }) => `color: ${theme.warning.text}`};
`;

const StyledSettingsContainer = styled(Row)<{ highlightSettings?: boolean }>`
  ${({ highlightSettings, theme }) =>
    highlightSettings && `color: ${theme.primary.text.normal}`};
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
