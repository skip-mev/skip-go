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

export type SwapWidgetProps = Pick<
  React.HTMLAttributes<HTMLDivElement>,
  'className' | 'style'
> &
  ConfigureSwapWidgetArgs &
  SwapWidgetProviderProps & {
    children?: React.ReactNode;
  };

export const SwapWidget: React.FC<SwapWidgetProps> = ({
  colors,
  settings,
  onlyTestnet,
  defaultRoute,
  routeConfig,
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
      <style type="text/css">{styles}</style>
      <SwapWidgetProvider {...swapWidgetProps}>
        <SwapWidgetUI {...swapWidgetProps} />
      </SwapWidgetProvider>
    </root.div>
  );
  return renderWidgetWithProvider;
};
