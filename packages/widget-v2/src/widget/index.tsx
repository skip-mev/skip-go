import { ShadowDomAndProviders } from './ShadowDomAndProviders';
import { PartialTheme } from './theme';
import { SwapFlow } from './SwapFlow';

type SwapWidgetProps = {
  theme?: PartialTheme;
};

export const SwapWidget = (props: SwapWidgetProps) => {
  return (
    <ShadowDomAndProviders {...props}>
      <SwapFlow />
    </ShadowDomAndProviders>
  );
};
