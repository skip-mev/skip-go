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
  const settingsChanged = useSettingsChanged();

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

  const poweredBy = (
    <Row align="center" gap={5}>
      Powered by <SkipLogoIcon />
    </Row>
  );

  const rightContentRendered = rightContent ? (
    rightContent
  ) : !isLoading && showRouteInfo && route ? (
    <Row align="center" gap={8}>
      {routeRequiresMultipleSignatures && renderSignatureRequired}
      {showEstimatedTime && estimatedTime && (
        <Row gap={8} align="center">
          {estimatedTime}
          <CogIconWrapper>
            <CogIcon height={15} width={14} />
            {settingsChanged && <SettingsChangedIndicator />}
          </CogIconWrapper>
        </Row>
      )}
    </Row>
  ) : null;

  return (
    <FooterItemsContainer>
      {poweredBy}
      {rightContentRendered}
    </FooterItemsContainer>
  );
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
    <GhostButton
      gap={5}
      justify="space-between"
      align="center"
      onClick={onClick}
      height={35}
      {...props}
    >
      <SwapPageFooterItems
        rightContent={rightContent}
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

const CogIconWrapper = styled.div`
  position: relative;
  display: inline-block;

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
