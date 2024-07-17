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
  onlyTestnet?: boolean;
  defaultRoute?: DefaultRouteConfig;
  routeConfig?: RouteConfig;
  /**
   * Filter chains and assets in selection
   *
   * Record<chainID, assetDenoms>
   * if assetDenoms is undefined, all assets are allowed
   * @example
   * ```ts
   * {
   * source: {
   *   'noble-1': undefined,
   * },
   * destination: {
   *   'cosmoshub-4': [
   *     'uatom',
   *     'ibc/2181AAB0218EAC24BC9F86BD1364FBBFA3E6E3FCC25E88E3E68C15DC6E752D86',
   *   ],
   *   'agoric-3': [
   *     'ibc/FE98AAD68F02F03565E9FA39A5E627946699B2B07115889ED812D8BA639576A9',
   *   ],
   *   'osmosis-1': undefined,
   * }
   * ```
   */
  filter?: {
    source?: Record<string, string[] | undefined>;
    destination?: Record<string, string[] | undefined>;
  };
}
export const swapWidgetDefaultValues: SwapWidgetStore = {
  onlyTestnet: false,
  defaultRoute: undefined,
  routeConfig: {
    allowMultiTx: true,
    allowUnsafe: true,
    experimentalFeatures: ['hyperlane'],
    smartSwapOptions: {
      splitRoutes: true,
      evmSwaps: true,
    },
  },
  filter: undefined,
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
  /**
   * Filter chains and assets in selection
   *
   * Record<chainID, assetDenoms>
   * if assetDenoms is undefined, all assets are allowed
   * @example
   * ```ts
   * {
   * source: {
   *   'noble-1': undefined,
   * },
   * destination: {
   *   'cosmoshub-4': [
   *     'uatom',
   *     'ibc/2181AAB0218EAC24BC9F86BD1364FBBFA3E6E3FCC25E88E3E68C15DC6E752D86',
   *   ],
   *   'agoric-3': [
   *     'ibc/FE98AAD68F02F03565E9FA39A5E627946699B2B07115889ED812D8BA639576A9',
   *   ],
   *   'osmosis-1': undefined,
   * }
   * ```
   */

  filter?: SwapWidgetStore['filter'];
}

export const configureSwapWidget = (args: ConfigureSwapWidgetArgs) => {
  useSwapWidgetUIStore.setState((prev) => ({
    onlyTestnet: args.onlyTestnet || prev.onlyTestnet,
    defaultRoute: args.defaultRoute || prev.defaultRoute,
    routeConfig: {
      ...prev.routeConfig,
      ...args.routeConfig,
    },
    filter: args.filter || prev.filter,
  }));
  useSettingsStore.setState((prev) => ({
    customGasAmount:
      args.settings?.customGasAmount?.toString() || prev.customGasAmount,
    slippage: args.settings?.slippage?.toString() || prev.slippage,
  }));
};
