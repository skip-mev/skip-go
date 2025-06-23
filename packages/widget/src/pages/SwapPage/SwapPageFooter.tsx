import React from "react";
import { Row } from "@/components/Layout";
import { GhostButton } from "@/components/Button";
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
import { getFeeList, getTotalFees } from "@/utils/fees";

const EstimatedDuration = ({ seconds }: { seconds?: number }) => {
  const formatted = seconds ? convertSecondsToMinutesOrHours(seconds) : null;
  return formatted ? (
    <Row gap={4} align="flex-end">
      {formatted}
    </Row>
  ) : null;
};


const SettingsButton = ({ highlight, changed }: { highlight?: boolean; changed: boolean }) => (
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
    <StyledSignatureRequiredContainer gap={3} align="flex-end">
      {`${count} ${pluralize("Signature", count)} required`}
      <SignatureIcon />
    </StyledSignatureRequiredContainer>
  </Row>
);

const RoutePreferenceLabel = ({ preference }: { preference: RoutePreference }) => {
  const label = preference === RoutePreference.FASTEST ? "Fastest route" : "Cheapest route";
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
  const signaturesRequired = route?.txsRequired ?? 1;

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
        {!isMobile && signaturesRequired > 1 && <SignatureRequired count={signaturesRequired} />}
        {!isMobile && signaturesRequired <= 1 && isGoFast && (
          <RoutePreferenceLabel preference={routePreference} />
        )}
      </Row>
    );
  };

  const rightContent = () =>
    isMobile && isGoFast ? <RoutePreferenceLabel preference={routePreference} /> : null;

  return (
    <>
      {leftContent() ?? <div />}
      {rightContent()}
    </>
  );
};

export const SwapPageFooter: React.FC<
  { onClick?: () => void } & SwapPageFooterItemsProps &
    React.ButtonHTMLAttributes<HTMLButtonElement>
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

export const StyledSignatureRequiredContainer = styled(Row)`
  ${({ theme }) => `color: ${theme.warning.text}`};
`;

const StyledSettingsContainer = styled(Row)<{ highlightSettings?: boolean }>`
  ${({ highlightSettings, theme }) => highlightSettings && `color: ${theme.primary.text.normal}`};
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
