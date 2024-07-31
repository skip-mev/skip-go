import { useTheme } from 'styled-components';
import { AssetChainInput } from '../components/AssetChainInput';
import { GhostButton } from '../components/Button';
import { Column, Row } from '../components/Layout';
import { MainButton } from '../components/MainButton';
import { SmallText } from '../components/Typography';
import { ICONS } from '../icons';
import { HistoryIcon } from '../icons/HistoryIcon';
import { SkipLogoIcon } from '../icons/SkipLogoIcon';
import { GasIcon } from '../icons/GasIcon';
import { SpeedometerIcon } from '../icons/SpeedometerIcon';

export const SwapFlow = () => {
  const theme = useTheme();

  return (
    <Column gap={5}>
      <Row justify="space-between">
        <GhostButton gap={5} onClick={() => {}}>
          <HistoryIcon color={theme.textColor} />
          History
        </GhostButton>
        <Row align="center" gap={10}>
          <SmallText> Balance: 125 </SmallText>
          <GhostButton onClick={() => {}}>Max</GhostButton>
        </Row>
      </Row>
      <AssetChainInput value="0" onChangeValue={() => {}} />
      <AssetChainInput value="0" onChangeValue={() => {}} />
      <MainButton label="Connect Wallet" icon={ICONS.plus} />

      <GhostButton
        gap={5}
        align="center"
        justify="space-between"
        onClick={() => {}}
      >
        <Row align="center" gap={5}>
          Powered by <SkipLogoIcon color={theme.textColor} />
        </Row>
        <Row align="center" gap={9}>
          <GasIcon color={theme.textColor} />
          ~$0.03
          <SpeedometerIcon color={theme.textColor} />
          1min
        </Row>
      </GhostButton>
    </Column>
  );
};
