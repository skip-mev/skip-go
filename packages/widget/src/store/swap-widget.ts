import { create } from 'zustand';
import { useSettingsStore } from './settings';
import { DefaultRouteConfig } from '../hooks/use-swap-widget';
import { RouteConfig } from '../hooks/use-route';
import {
  createJSONStorage,
  persist,
  PersistOptions,
  subscribeWithSelector,
} from 'zustand/middleware';

interface SwapWidgetStore {
  colors: {
    primary?: string;
  };
  onlyTestnet?: boolean;
  defaultRoute?: DefaultRouteConfig;
  routeConfig?: RouteConfig;
}
export const swapWidgetDefaultValues: SwapWidgetStore = {
  colors: {
    primary: '#FF486E',
  },
  onlyTestnet: false,
  defaultRoute: undefined,
  routeConfig: {
    allowMultiTx: true,
    allowUnsafe: true,
    experimentalFeatures: ['hyperlane'],
  },
};

const sessionOptions: PersistOptions<
  SwapWidgetStore,
  Pick<SwapWidgetStore, 'defaultRoute'>
> = {
  name: 'skip-go-widget',
  partialize: (x) => ({
    defaultRoute: x.defaultRoute,
  }),
  storage: createJSONStorage(() => window.sessionStorage),
};

export const useSwapWidgetUIStore = create(
  subscribeWithSelector(persist(() => swapWidgetDefaultValues, sessionOptions))
);

export interface ConfigureSwapWidgetArgs {
  colors?: {
    /**
     * @default '#FF486E'
     */
    primary?: string;
  };
  settings?: {
    /**
     * gas amount for validation
     * @default 200_000
     */
    customGasAmount?: number;
    /**
     * percentage of slippage 0-100
     * @default 3
     */
    slippage?: number;
  };
  onlyTestnet?: boolean;
  defaultRoute?: DefaultRouteConfig;
  routeConfig?: RouteConfig;
}

export const configureSwapWidget = (args: ConfigureSwapWidgetArgs) => {
  useSwapWidgetUIStore.setState((prev) => ({
    colors: {
      primary: args.colors?.primary || prev.colors.primary,
    },
    onlyTestnet: args.onlyTestnet || prev.onlyTestnet,
    defaultRoute: args.defaultRoute || prev.defaultRoute,
    routeConfig: {
      ...prev.routeConfig,
      ...args.routeConfig,
    },
  }));
  useSettingsStore.setState((prev) => ({
    customGasAmount:
      args.settings?.customGasAmount?.toString() || prev.customGasAmount,
    slippage: args.settings?.slippage?.toString() || prev.slippage,
  }));
};
