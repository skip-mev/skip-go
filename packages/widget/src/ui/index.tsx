import { useEffect } from 'react';
import { SkipAPIProvider, SkipAPIProviderProps } from '../provider';
import {
  configureSwapWidget,
  ConfigureSwapWidgetArgs,
} from '../store/swap-widget';
import { SwapWidgetUI } from './Widget';

export interface SwapWidgetProps
  extends Pick<React.HTMLAttributes<HTMLDivElement>, 'className' | 'style'>,
    ConfigureSwapWidgetArgs {}

export const SwapWidget: React.FC<SwapWidgetProps> = ({
  colors,
  className,
  style,
  settings,
  onlyTestnet,
  defaultRoute,
  routeConfig,
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
  return <SwapWidgetUI {...divProps} />;
};
