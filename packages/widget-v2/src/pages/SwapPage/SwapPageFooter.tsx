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
  const estimatedTime = convertSecondsToMinutesOrHours(
    route?.estimatedRouteDurationSeconds
  );

  const renderRightContent = useMemo(() => {
    if (rightContent) return rightContent;
    if (isLoading) return;
    if (showRouteInfo && route) {
      return (
        <Row align="center" gap={8}>
          <Row gap={4} align="center">
            <StyledSignatureRequiredContainer gap={5} align="center">
              <SignatureIcon />
              {route?.txsRequired}{" "}
              {pluralize("Signature", route?.txsRequired)} required
            </StyledSignatureRequiredContainer>
          </Row>

          {showEstimatedTime && estimatedTime && (
            <Row gap={4} align="center">
              <SpeedometerIcon />
              {estimatedTime}
            </Row>
          )}
        </Row>
      );
    }
  }, [estimatedTime, isLoading, rightContent, route, showEstimatedTime, showRouteInfo]);

  return (
    <>
      <Row align="center" gap={5}>
        Powered by <SkipLogoIcon />
      </Row>
      {renderRightContent}
    </>
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
      onClick={onClick}
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

export const StyledSignatureRequiredContainer = styled(Row)`
  ${({ theme }) => `color: ${theme.warning.text}`};
`;
