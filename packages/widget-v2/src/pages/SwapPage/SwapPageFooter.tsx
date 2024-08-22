import { useMemo } from "react";
import { Row } from "@/components/Layout";
import { GhostButton } from "@/components/Button";
import { GasIcon } from "@/icons/GasIcon";
import { SkipLogoIcon } from "@/icons/SkipLogoIcon";
import { SpeedometerIcon } from "@/icons/SpeedometerIcon";
import { formatUSD } from "@/utils/intl";

const estimatedGas = "0.03";
const estimatedTime = "1min";

export type SwapPageFooterItemsProps = {
  rightContent?: React.ReactNode;
  showRouteInfo?: boolean;
};

export const SwapPageFooterItems = ({
  rightContent = null,
  showRouteInfo,
}: SwapPageFooterItemsProps) => {
  const renderRightContent = useMemo(() => {
    if (showRouteInfo && estimatedGas && estimatedTime) {
      return (
        <Row align="center" gap={8}>
          <Row gap={2} align="flex-end">
            <GasIcon />~{formatUSD(estimatedGas)}
          </Row>
          <Row gap={2} align="flex-end">
            <SpeedometerIcon />
            {estimatedTime}
          </Row>
        </Row>
      );
    }
    return rightContent;
  }, [rightContent, showRouteInfo]);

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
  ...props
}: {
  onClick?: () => void;
} & SwapPageFooterItemsProps) => {
  return (
    <GhostButton
      gap={5}
      align="center"
      justify="space-between"
      onClick={onClick}
    >
      <SwapPageFooterItems {...props} />
    </GhostButton>
  );
};
