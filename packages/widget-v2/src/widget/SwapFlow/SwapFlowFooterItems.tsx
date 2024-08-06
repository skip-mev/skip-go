import { useTheme } from 'styled-components';
import { Row } from '../../components/Layout';
import { GasIcon } from '../../icons/GasIcon';
import { SkipLogoIcon } from '../../icons/SkipLogoIcon';
import { SpeedometerIcon } from '../../icons/SpeedometerIcon';
import { formatUSD } from '../../utils/intl';

const estimatedGas = '0.03';
const estimatedTime = '1min';

export const SwapFlowFlooterItems = () => {
  const theme = useTheme();
  return (
    <>
      <Row align="center" gap={5}>
        Powered by <SkipLogoIcon color={theme.textColor} />
      </Row>
      {estimatedGas && estimatedTime && (
        <Row align="center" gap={8}>
          <Row gap={2} align="flex-end">
            <GasIcon color={theme.textColor} />~{formatUSD(estimatedGas)}
          </Row>
          <Row gap={2} align="flex-end">
            <SpeedometerIcon color={theme.textColor} />
            {estimatedTime}
          </Row>
        </Row>
      )}
    </>
  );
};
