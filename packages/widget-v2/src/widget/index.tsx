import { AssetChainInput } from '../components/AssetChainInput';
import { Column } from '../components/Layout';
import { ShadowDomAndProviders } from './ShadowDomAndProviders';
import { PartialTheme } from './theme';

type SwapWidgetProps = {
  theme?: PartialTheme;
};

export const SwapWidget = (props: SwapWidgetProps) => {
  return (
    <ShadowDomAndProviders {...props}>
      <Column gap={5}>
        <AssetChainInput value={0} />
        <AssetChainInput value={0} />
      </Column>
    </ShadowDomAndProviders>
  );
};
