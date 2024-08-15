import { useTheme } from 'styled-components';
import { Row } from '../../components/Layout';
import { GasIcon } from '../../icons/GasIcon';
import { SkipLogoIcon } from '../../icons/SkipLogoIcon';
import { SpeedometerIcon } from '../../icons/SpeedometerIcon';
import { formatUSD } from '../../utils/intl';
import { useMemo } from 'react';
import { GhostButton } from '../../components/Button';

const estimatedGas = '0.03';
const estimatedTime = '1min';

export type SwapFlowFooterItemsProps = {
  rightContent?: React.ReactNode;
  showRouteInfo?: boolean;
};

export const SwapFlowFlooterItems = ({
  rightContent = null,
  showRouteInfo,
}: SwapFlowFooterItemsProps) => {
  const theme = useTheme();

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
  }, [showRouteInfo, rightContent, estimatedGas, estimatedTime, theme]);

  return (
    <>
      <Row align="center" gap={5}>
        Powered by <SkipLogoIcon />
      </Row>
      {renderRightContent}
    </>
  );
};

export const SwapFlowFooter = ({
  onClick,
  ...props
}: {
  onClick?: () => void;
} & SwapFlowFooterItemsProps) => {
  return (
    <GhostButton
      gap={5}
      align="center"
      justify="space-between"
      onClick={onClick}
    >
      <SwapFlowFlooterItems {...props} />
    </GhostButton>
  );
};
