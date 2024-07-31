import { useTheme } from 'styled-components';
import { Row } from '../../components/Layout';
import { GasIcon } from '../../icons/GasIcon';
import { SkipLogoIcon } from '../../icons/SkipLogoIcon';
import { SpeedometerIcon } from '../../icons/SpeedometerIcon';

export const SwapFlowFlooterItems = () => {
  const theme = useTheme();
  return (
    <>
      <Row align="center" gap={5}>
        Powered by <SkipLogoIcon color={theme.textColor} />
      </Row>
      <Row align="center" gap={9}>
        <GasIcon color={theme.textColor} />
        ~$0.03
        <SpeedometerIcon color={theme.textColor} />
        1min
      </Row>
    </>
  );
};
