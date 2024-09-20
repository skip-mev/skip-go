import { useMemo } from "react";
import { Row } from "@/components/Layout";
import { GhostButton } from "@/components/Button";
import { SkipLogoIcon } from "@/icons/SkipLogoIcon";
import { SpeedometerIcon } from "@/icons/SpeedometerIcon";
import { useAtomValue } from "jotai";
import { convertSecondsToMinutesOrHours } from "@/utils/number";
import { skipRouteAtom } from "@/state/skipClient";
import { SkeletonElement } from "@/components/Skeleton";
import { SignatureIcon } from "@/icons/SignatureIcon";

export type SwapPageFooterItemsProps = {
  rightContent?: React.ReactNode;
  showRouteInfo?: boolean;
};

export const SwapPageFooterItems = ({
  rightContent = null,
  showRouteInfo,
}: SwapPageFooterItemsProps) => {
  const { data: route, isLoading } = useAtomValue(skipRouteAtom);
  const estimatedTime = convertSecondsToMinutesOrHours(
    route?.estimatedRouteDurationSeconds
  );

  const renderRightContent = useMemo(() => {
    if (showRouteInfo && route) {
      return (
        <Row align="center" gap={8}>
          <Row gap={4} align="center">
            {isLoading ? (
              <SkeletonElement width={40} height={16} />
            ) : (
              <>
                <SignatureIcon />
                {route?.txsRequired} tx required
              </>
            )}
          </Row>
          <Row gap={4} align="center">
            {isLoading ? (
              <SkeletonElement width={80} height={16} />
            ) : estimatedTime ? (
              <>
                <SpeedometerIcon />
                {estimatedTime}
              </>
            ) : null}
          </Row>
        </Row>
      );
    }
    return rightContent;
  }, [estimatedTime, isLoading, rightContent, route, showRouteInfo]);

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
  ...props
}: {
  onClick?: () => void;
} & SwapPageFooterItemsProps & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <GhostButton
      gap={5}
      align="center"
      justify="space-between"
      onClick={onClick}
      {...props}
    >
      <SwapPageFooterItems
        rightContent={rightContent}
        showRouteInfo={showRouteInfo}
      />
    </GhostButton>
  );
};
