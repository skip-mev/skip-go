import { useEffect } from 'react';
import { SwapWidgetProvider, SwapWidgetProviderProps } from '../provider';
import {
  configureSwapWidget,
  ConfigureSwapWidgetArgs,
} from '../store/swap-widget';
import { SwapWidgetUI } from './Widget';
import { Theme } from './theme';
import shadowDomStyles from '../styles/shadowDomStyles.css';
import toastStyles from '../styles/toastStyles.css';
import { Scope } from 'react-shadow-scope';
import { useInjectFontsToDocumentHead } from '../hooks/use-inject-fonts-to-document-head';

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
      stylesheets={[toastStyles, shadowDomStyles]}
      config={{ dsd: 'emulated' }}
    >
      <SwapWidgetProvider {...swapWidgetProviderProps}>
        <SwapWidgetUI className={className} style={style} theme={theme} />
      </SwapWidgetProvider>
    </Scope>
  );
};
