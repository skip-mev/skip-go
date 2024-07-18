import { useEffect } from 'react';
import { SwapWidgetProvider, SwapWidgetProviderProps } from '../provider';
import {
  configureSwapWidget,
  ConfigureSwapWidgetArgs,
} from '../store/swap-widget';
import { SwapWidgetUI } from './Widget';
import shadowDomStyles from '../styles/shadowDomStyles.css';
import toastStyles from '../styles/toastStyles.css';
import cssReset from '../styles/cssReset.css';
import { Scope } from 'react-shadow-scope';
import { useInjectFontsToDocumentHead } from '../hooks/use-inject-fonts-to-document-head';

export type SwapWidgetWithoutProvidersProps = Pick<
  React.HTMLAttributes<HTMLDivElement>,
  'className' | 'style'
> &
  ConfigureSwapWidgetArgs;

export type SwapWidgetProps = SwapWidgetWithoutProvidersProps &
  Partial<SwapWidgetProviderProps>;

export const SwapWidgetWithoutProviders: React.FC<
  SwapWidgetWithoutProvidersProps
> = ({
  colors,
  settings,
  onlyTestnet,
  defaultRoute,
  routeConfig,
  className,
  style,
  filter,
}) => {
  useInjectFontsToDocumentHead();
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
    <Scope
      stylesheets={[cssReset, toastStyles, shadowDomStyles]}
      config={{ dsd: 'emulated' }}
    >
      <SwapWidgetUI className={className} style={style} />
    </Scope>
  );
};

export const SwapWidget: React.FC<SwapWidgetProps> = ({
  colors,
  settings,
  onlyTestnet,
  defaultRoute,
  routeConfig,
  className,
  style,
  filter,
  ...swapWidgetProviderProps
}) => {
  useInjectFontsToDocumentHead();
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
    <Scope
      stylesheets={[cssReset, toastStyles, shadowDomStyles]}
      config={{ dsd: 'emulated' }}
    >
      <SwapWidgetProvider {...swapWidgetProviderProps}>
        <SwapWidgetUI className={className} style={style} />
      </SwapWidgetProvider>
    </Scope>
  );
};
