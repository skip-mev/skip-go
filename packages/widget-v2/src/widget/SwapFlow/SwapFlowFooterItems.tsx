import { useTheme } from 'styled-components';
import { Row } from '../../components/Layout';
import { GasIcon } from '../../icons/GasIcon';
import { SkipLogoIcon } from '../../icons/SkipLogoIcon';
import { SpeedometerIcon } from '../../icons/SpeedometerIcon';
import { formatUSD } from '../../utils/intl';

export const SwapFlowFlooterItems = () => {
  const estimatedGas = '0.03';
  const estimatedTime = '1min';

  const theme = useTheme();
  return (
    <>
      <Row align="center" gap={5}>
        Powered by <SkipLogoIcon color={theme.textColor} />
      </Row>
      {estimatedGas && estimatedTime && (
        <Row align="center" gap={5}>
          <GasIcon color={theme.textColor} />~{formatUSD(estimatedGas)}
          <SpeedometerIcon color={theme.textColor} />
          {estimatedTime}
        </Row>
      )}
    </>
  );
};
