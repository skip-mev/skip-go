import { create } from 'zustand';

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

interface ConfigureSwapWidgetArgs {
  colors?: {
    primary?: string;
  };
}

export const configureSwapWidget = (args: ConfigureSwapWidgetArgs) => {
  useSwapWidgetUIStore.setState((prev) => ({
    colors: {
      primary: args.colors?.primary || prev.colors.primary,
    },
  }));
};
