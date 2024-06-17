import { SkipAPIProvider, SkipAPIProviderProps } from '../provider';
import {
  configureSwapWidget,
  ConfigureSwapWidgetArgs,
} from '../store/swap-widget';
import { SwapWidgetUI } from './Widget';

export interface SwapWidgetProps
  extends Omit<SkipAPIProviderProps, 'children'>,
    Pick<React.HTMLAttributes<HTMLDivElement>, 'className' | 'style'>,
    ConfigureSwapWidgetArgs {}

export const SwapWidget: React.FC<SwapWidgetProps> = ({
  colors,
  className,
  style,
  settings,
  onlyTestnet,
  ...props
}) => {
  configureSwapWidget({
    colors,
    onlyTestnet,
    settings,
  });
  const divProps = { className, style };
  return (
    <SkipAPIProvider {...props}>
      <SwapWidgetUI {...divProps} />
    </SkipAPIProvider>
  );
};
