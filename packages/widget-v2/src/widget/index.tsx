import { AssetChainInput } from '../components/AssetChainInput';
import { Column } from '../components/Layout';
import { MainButton } from '../components/MainButton';
import { ICONS } from '../icons';
import { ShadowDomAndProviders } from './ShadowDomAndProviders';
import { PartialTheme } from './theme';

type SwapWidgetProps = {
  theme?: PartialTheme;
};

export const SwapWidget = (props: SwapWidgetProps) => {
  return (
    <ShadowDomAndProviders {...props}>
      <Column gap={5}>
        <AssetChainInput value="0" onChangeValue={() => {}} />
        <AssetChainInput value="0" onChangeValue={() => {}} />
        <MainButton label="Connect Wallet" icon={ICONS.plus} />
      </Column>
    </ShadowDomAndProviders>
  );
};
