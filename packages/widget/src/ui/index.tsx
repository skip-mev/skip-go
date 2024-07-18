import { useEffect, useMemo } from 'react';
import { SwapWidgetProvider, SwapWidgetProviderProps } from '../provider';
import {
  configureSwapWidget,
  ConfigureSwapWidgetArgs,
} from '../store/swap-widget';
import { SwapWidgetUI, SwapWidgetUIProps } from './Widget';
import { defaultTheme, PartialTheme } from './theme';
import { WithStyledShadowDom } from './WithStyledShadowDom';
import { ThemeProvider } from 'styled-components';

export type SwapWidgetWithoutProvidersProps = SwapWidgetUIProps &
  ConfigureSwapWidgetArgs & {
    theme?: PartialTheme;
  };

export type SwapWidgetProps = SwapWidgetWithoutProvidersProps &
  Partial<SwapWidgetProviderProps>;

export const SwapWidgetWithoutProviders: React.FC<
  SwapWidgetWithoutProvidersProps
> = ({
  settings,
  onlyTestnet,
  defaultRoute,
  routeConfig,
  theme,
  filter,
  ...swapWidgetUIProps
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
        <SwapWidgetUI {...swapWidgetUIProps} />
      </ThemeProvider>
    </WithStyledShadowDom>
  );
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
  toasterProps,
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
          <SwapWidgetUI
            className={className}
            style={style}
            toasterProps={toasterProps}
          />
        </SwapWidgetProvider>
      </ThemeProvider>
    </WithStyledShadowDom>
  );
};
