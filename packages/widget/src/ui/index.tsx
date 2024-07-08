import { useEffect } from 'react';
import { SwapWidgetProvider, SwapWidgetProviderProps } from '../provider';
import {
  configureSwapWidget,
  ConfigureSwapWidgetArgs,
} from '../store/swap-widget';
import { SwapWidgetUI } from './Widget';
import styles from '../styles/global.css';
import toastStyles from '../styles/toastStyles.css';
import { Scope } from 'react-shadow-scope';

export type SwapWidgetProps = Pick<
  React.HTMLAttributes<HTMLDivElement>,
  'className' | 'style'
> &
  ConfigureSwapWidgetArgs &
  Partial<SwapWidgetProviderProps>;

export const SwapWidget: React.FC<SwapWidgetProps> = ({
  colors,
  settings,
  onlyTestnet,
  defaultRoute,
  routeConfig,
  className,
  style,
  ...swapWidgetProviderProps
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

  return (
    <Scope stylesheets={[toastStyles, styles]} config={{ dsd: 'emulated' }}>
      <SwapWidgetProvider {...swapWidgetProviderProps}>
        <SwapWidgetUI className={className} style={style} />
      </SwapWidgetProvider>
    </Scope>
  );
};
