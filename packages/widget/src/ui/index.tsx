import { SkipAPIProvider, SkipAPIProviderProps } from '../provider';
import { configureSwapWidget } from '../store/swap-widget';
import { SwapWidgetUI } from './Widget';

interface SwapWidgetProps extends Omit<SkipAPIProviderProps, 'children'> {
  colors?: {
    primary?: string;
  };
}

export const SwapWidget: React.FC<SwapWidgetProps> = (props) => {
  configureSwapWidget({
    colors: props.colors,
  });
  return (
    <SkipAPIProvider {...props}>
      <SwapWidgetUI />
    </SkipAPIProvider>
  );
};
