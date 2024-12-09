import { atom } from "jotai";
import { ClientAsset } from "@/state/skipClient";
import { routeConfigAtom, skipRouteAtom } from "@/state/route";
import { atomWithDebounce } from "@/utils/atomWithDebounce";
import { atomWithStorageNoCrossTabSync } from "@/utils/misc";
import { RoutePreference } from "./types";

export type AssetAtom = Partial<ClientAsset> & {
  amount?: string;
};

export const {
  debouncedValueAtom: debouncedSourceAssetAmountAtom,
  valueInitialized: debouncedSourceAssetAmountValueInitializedAtom,
  clearTimeoutAtom: cleanupDebouncedSourceAssetAmountAtom,
} = atomWithDebounce<string | undefined>();

export const {
  debouncedValueAtom: debouncedDestinationAssetAmountAtom,
  valueInitialized: debouncedDestinationAssetAmountValueInitializedAtom,
  clearTimeoutAtom: cleanupDebouncedDestinationAssetAmountAtom,
} = atomWithDebounce<string | undefined>();

export const sourceAssetAtom = atomWithStorageNoCrossTabSync<AssetAtom | undefined>(
  "sourceAsset",
  undefined,
);

export const sourceAssetAmountAtom = atom(
  (get) => get(sourceAssetAtom)?.amount ?? "",
  (_get, set, newAmount: string) => {
    set(sourceAssetAtom, (prev) => ({ ...prev, amount: newAmount }));
    set(debouncedSourceAssetAmountAtom, newAmount);
    set(swapDirectionAtom, "swap-in");
    if (newAmount === "") {
      set(destinationAssetAtom, (prev) => ({ ...prev, amount: newAmount }));
      set(debouncedDestinationAssetAmountAtom, newAmount, undefined, true);
    }
  }
);

export const destinationAssetAtom = atomWithStorageNoCrossTabSync<AssetAtom | undefined>(
  "destinationAsset",
  undefined
);

export const destinationAssetAmountAtom = atom(
  (get) => get(destinationAssetAtom)?.amount ?? "",
  (_get, set, newAmount: string, callback?: () => void) => {
    set(destinationAssetAtom, (prev) => ({ ...prev, amount: newAmount }));
    set(debouncedDestinationAssetAmountAtom, newAmount, callback);
    set(swapDirectionAtom, "swap-out");

    if (newAmount === "") {
      set(sourceAssetAtom, (prev) => ({ ...prev, amount: newAmount }));
      set(debouncedSourceAssetAmountAtom, newAmount, undefined, true);
    }
  }
);

export const clearAssetInputAmountsAtom = atom(null, (_get, set) => {
  set(sourceAssetAtom, (prev) => ({ ...prev, amount: "" }));
  set(debouncedSourceAssetAmountAtom, "", undefined, true);

  set(destinationAssetAtom, (prev) => ({ ...prev, amount: "" }));
  set(debouncedDestinationAssetAmountAtom, "", undefined, true);
});

export const isWaitingForNewRouteAtom = atom((get) => {
  const sourceAmount = get(sourceAssetAmountAtom);
  const destinationAmount = get(destinationAssetAmountAtom);
  const debouncedSourceAmount = get(debouncedSourceAssetAmountAtom);
  const debouncedDestinationAmount = get(debouncedDestinationAssetAmountAtom);

  const { isLoading } = get(skipRouteAtom);
  const direction = get(swapDirectionAtom);

  const sourceAmountHasChanged = sourceAmount !== debouncedSourceAmount;
  const destinationAmountHasChanged = destinationAmount !== debouncedDestinationAmount;

  if (direction === "swap-in") {
    return sourceAmountHasChanged || isLoading;
  } else if (direction === "swap-out") {
    return destinationAmountHasChanged || isLoading;
  }
});

export type SwapDirection = "swap-in" | "swap-out";

export const swapDirectionAtom = atomWithStorageNoCrossTabSync<SwapDirection>(
  "swapDirection",
  "swap-in"
);

export const isInvertingSwapAtom = atom(false);

export const invertSwapAtom = atom(null, (get, set) => {
  const sourceAsset = get(sourceAssetAtom);
  const destinationAsset = get(destinationAssetAtom);
  const swapDirection = get(swapDirectionAtom);
  set(isInvertingSwapAtom, true);

  set(sourceAssetAtom, { ...destinationAsset });
  set(sourceAssetAmountAtom, destinationAsset?.amount ?? "");

  set(destinationAssetAtom, { ...sourceAsset });
  set(destinationAssetAmountAtom, sourceAsset?.amount ?? "", () => {
    const newSwapDirection =
      swapDirection === "swap-in" ? "swap-out" : "swap-in";
    set(swapDirectionAtom, newSwapDirection);
    set(isInvertingSwapAtom, false);
  });
});

export type ChainFilter = {
  source?: Record<string, string[] | undefined>;
  destination?: Record<string, string[] | undefined>;
};

export const chainFilterAtom = atom<ChainFilter>();


export const defaultSwapSettings = {
  slippage: 1,
  customGasAmount: 200_000,
  routePreference: RoutePreference.FASTEST,
};

export const swapSettingsAtom = atomWithStorageNoCrossTabSync("swapSettingsAtom", defaultSwapSettings);

export const slippageAtom = atom(
  (get) => get(swapSettingsAtom).slippage,
  (get, set, newSlippage: number) => {
    const currentSettings = get(swapSettingsAtom);
    set(swapSettingsAtom, { ...currentSettings, slippage: newSlippage });
  }
);

export const routePreferenceAtom = atom(
  (get) => get(swapSettingsAtom).routePreference,
  (get, set, newRoutePreference: RoutePreference) => {
    const currentSettings = get(swapSettingsAtom);
    set(swapSettingsAtom, { ...currentSettings, routePreference: newRoutePreference });
    set(routeConfigAtom, (prev) => ({ ...prev, goFast: newRoutePreference === RoutePreference.FASTEST }));
  }
);
