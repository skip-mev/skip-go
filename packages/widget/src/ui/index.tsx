import { useEffect } from 'react';
import { SwapWidgetProvider, SwapWidgetProviderProps } from '../provider';
import {
  configureSwapWidget,
  ConfigureSwapWidgetArgs,
} from '../store/swap-widget';
import { SwapWidgetUI } from './Widget';
import { useForceClientRender } from '../hooks/use-force-client-render';
import root from 'react-shadow';
import styles from '../styles/global.css';
import toastStyles from '../styles/toastStyles.css';

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
  ...swapWidgetProps
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

  const renderWidgetWithProvider = useForceClientRender(
    <root.div mode="open">
      <style type="text/css">{toastStyles}</style>
      <style type="text/css">{styles}</style>
      <SwapWidgetProvider {...swapWidgetProps}>
        <SwapWidgetUI className={className} style={style} />
      </SwapWidgetProvider>
    </root.div>
  );
  return renderWidgetWithProvider;
};
