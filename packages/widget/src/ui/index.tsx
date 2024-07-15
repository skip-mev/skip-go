import { useEffect } from 'react';
import { SwapWidgetProvider, SwapWidgetProviderProps } from '../provider';
import {
  configureSwapWidget,
  ConfigureSwapWidgetArgs,
} from '../store/swap-widget';
import { SwapWidgetUI } from './Widget';
import { defaultTheme, Theme } from './theme';
import { WithStyledShadowDom } from './WithStyledShadowDom';
import { ThemeProvider } from 'styled-components';

export type SwapWidgetProps = Pick<
  React.HTMLAttributes<HTMLDivElement>,
  'className' | 'style'
> &
  ConfigureSwapWidgetArgs &
  Partial<SwapWidgetProviderProps> & {
    theme?: Theme;
  };

export const SwapWidget: React.FC<SwapWidgetProps> = ({
  colors,
  settings,
  onlyTestnet,
  defaultRoute,
  routeConfig,
  theme,
  className,
  style,
  filter,
  ...swapWidgetProviderProps
}) => {
  useEffect(() => {
    configureSwapWidget({
      colors,
      onlyTestnet,
      settings,
      defaultRoute,
      routeConfig,
      filter,
    });
  }, [colors, onlyTestnet, settings, defaultRoute, routeConfig]);

  return (
    <WithStyledShadowDom>
      <ThemeProvider theme={theme ?? defaultTheme}>
        <SwapWidgetProvider {...swapWidgetProviderProps}>
          <SwapWidgetUI className={className} style={style} />
        </SwapWidgetProvider>
      </ThemeProvider>
    </WithStyledShadowDom>
  );
};
