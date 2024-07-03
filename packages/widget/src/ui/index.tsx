import { useEffect } from 'react';
import { SkipAPIProvider, SkipAPIProviderProps } from '../provider';
import {
  configureSwapWidget,
  ConfigureSwapWidgetArgs,
} from '../store/swap-widget';
import { SwapWidgetUI } from './Widget';
import { Theme } from './theme';

export type SwapWidgetProps = Pick<
  React.HTMLAttributes<HTMLDivElement>,
  'className' | 'style'
> &
  ConfigureSwapWidgetArgs & {
    theme?: Theme;
  };

export const SwapWidget: React.FC<SwapWidgetProps> = ({
  colors,
  className,
  style,
  settings,
  onlyTestnet,
  defaultRoute,
  routeConfig,
  theme,
}) => {
  useEffect(() => {
    configureSwapWidget({
      colors,
      onlyTestnet,
      settings,
      defaultRoute,
      routeConfig,
    });
  }, [colors, onlyTestnet, settings, defaultRoute, routeConfig]);

  const divProps = { className, style };
  return <SwapWidgetUI {...divProps} theme={theme} />;
};
