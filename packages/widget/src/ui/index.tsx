import { useEffect, useMemo } from 'react';
import { SwapWidgetProvider, SwapWidgetProviderProps } from '../provider';
import {
  configureSwapWidget,
  ConfigureSwapWidgetArgs,
} from '../store/swap-widget';
import { SwapWidgetUI } from './Widget';
import { defaultTheme, PartialTheme } from './theme';
import { WithStyledShadowDom } from './WithStyledShadowDom';
import { ThemeProvider } from 'styled-components';

export type SwapWidgetProps = Pick<
  React.HTMLAttributes<HTMLDivElement>,
  'className' | 'style'
> &
  ConfigureSwapWidgetArgs &
  Partial<SwapWidgetProviderProps> & {
    theme?: PartialTheme;
  };

export const SwapWidget: React.FC<SwapWidgetProps> = ({
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
      onlyTestnet,
      settings,
      defaultRoute,
      routeConfig,
      filter,
    });
  }, [onlyTestnet, settings, defaultRoute, routeConfig]);

  const mergedThemes = useMemo(() => {
    return {
      ...defaultTheme,
      ...theme,
    };
  }, [defaultTheme, theme]);

  return (
    <WithStyledShadowDom>
      <ThemeProvider theme={mergedThemes}>
        <SwapWidgetProvider {...swapWidgetProviderProps}>
          <SwapWidgetUI className={className} style={style} />
        </SwapWidgetProvider>
      </ThemeProvider>
    </WithStyledShadowDom>
  );
};
