import { SkipAPIProvider, SkipAPIProviderProps } from '../provider';
import { configureSwapWidget } from '../store/swap-widget';
import { SwapWidgetUI } from './Widget';

interface SwapWidgetProps
  extends Omit<SkipAPIProviderProps, 'children'>,
    Pick<React.HTMLAttributes<HTMLDivElement>, 'className' | 'style'> {
  colors?: {
    primary?: string;
  };
}

export const SwapWidget: React.FC<SwapWidgetProps> = ({
  colors,
  className,
  style,
  ...props
}) => {
  configureSwapWidget({
    colors: colors,
  });
  const divProps = { className, style };
  return (
    <SkipAPIProvider {...props}>
      <SwapWidgetUI {...divProps} />
    </SkipAPIProvider>
  );
};
