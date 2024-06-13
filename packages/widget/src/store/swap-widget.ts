import { create } from 'zustand';
import { useSettingsStore } from './settings';

interface SwapWidgetStore {
  colors: {
    primary?: string;
  };
}
export const swapWidgetDefaultValues: SwapWidgetStore = {
  colors: {
    primary: '#FF486E',
  },
};

export const useSwapWidgetUIStore = create(() => swapWidgetDefaultValues);

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
}

export const configureSwapWidget = (args: ConfigureSwapWidgetArgs) => {
  useSwapWidgetUIStore.setState((prev) => ({
    colors: {
      primary: args.colors?.primary || prev.colors.primary,
    },
  }));
  useSettingsStore.setState((prev) => ({
    customGasAmount:
      args.settings?.customGasAmount?.toString() || prev.customGasAmount,
    slippage: args.settings?.slippage?.toString() || prev.slippage,
  }));
};
