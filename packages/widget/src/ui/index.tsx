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
import { useCallbackStore, WalletCallbackStore } from '../store/callbacks';

export type SwapWidgetWithoutProvidersProps = SwapWidgetUIProps &
  ConfigureSwapWidgetArgs &
  WalletCallbackStore & {
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
  onWalletConnected,
  onWalletDisconnected,
  onTransactionBroadcasted,
  onTransactionComplete,
  onTransactionFailed,
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
    useCallbackStore.setState({
      onWalletConnected,
      onWalletDisconnected,
      onTransactionBroadcasted,
      onTransactionComplete,
      onTransactionFailed,
    });
  }, [
    onlyTestnet,
    settings,
    defaultRoute,
    routeConfig,
    onWalletConnected,
    onWalletDisconnected,
    onTransactionBroadcasted,
    onTransactionComplete,
    onTransactionFailed,
  ]);

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
  persistSwapWidgetState,
  onWalletConnected,
  onWalletDisconnected,
  onTransactionBroadcasted,
  onTransactionComplete,
  onTransactionFailed,
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
    useCallbackStore.setState({
      onWalletConnected,
      onWalletDisconnected,
      onTransactionBroadcasted,
      onTransactionComplete,
      onTransactionFailed,
    });
  }, [
    onlyTestnet,
    settings,
    defaultRoute,
    routeConfig,
    onWalletConnected,
    onWalletDisconnected,
    onTransactionBroadcasted,
    onTransactionComplete,
    onTransactionFailed,
  ]);

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
            persistSwapWidgetState={persistSwapWidgetState}
          />
        </SwapWidgetProvider>
      </ThemeProvider>
    </WithStyledShadowDom>
  );
};
