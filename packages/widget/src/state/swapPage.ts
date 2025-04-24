import { atom } from "jotai";
import { ClientAsset, skipClient } from "@/state/skipClient";
import { setRouteToDefaultRouteAtom, skipRouteAtom } from "@/state/route";
import { atomWithDebounce } from "@/utils/atomWithDebounce";
import { atomWithStorageNoCrossTabSync } from "@/utils/misc";
import { RoutePreference } from "./types";
import { atomEffect } from "jotai-effect";
import { callbacksAtom } from "./callbacks";
import { jotaiStore } from "@/widget/Widget";
import { currentPageAtom, Routes } from "./router";
import { errorAtom } from "./errorPage";
import { walletsAtom } from "./wallets";

export type AssetAtom = Partial<ClientAsset> & {
  amount?: string;
  locked?: boolean;
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

export const onRouteUpdatedEffect: ReturnType<typeof atomEffect> = atomEffect((get) => {
  const sourceAsset = get(sourceAssetAtom);
  const destinationAsset = get(destinationAssetAtom);
  const { data } = get(skipRouteAtom);

  const callbacks = get(callbacksAtom);

  if (callbacks?.onRouteUpdated) {
    callbacks?.onRouteUpdated({
      srcChainId: sourceAsset?.chainID,
      srcAssetDenom: sourceAsset?.denom,
      destChainId: destinationAsset?.chainID,
      destAssetDenom: destinationAsset?.denom,
      amountIn: sourceAsset?.amount,
      amountOut: destinationAsset?.amount,
      requiredChainAddresses: data?.requiredChainAddresses,
    });
  }
});

export const onSourceAssetUpdatedEffect: ReturnType<typeof atomEffect> = atomEffect((get) => {
  const sourceAsset = get(sourceAssetAtom);
  const skip = get(skipClient);
  const wallets = get(walletsAtom);
  if (sourceAsset?.chainID && wallets.cosmos) {
    skip.getSigningStargateClient({
      chainId: sourceAsset?.chainID,
    });
  }
});

export const sourceAssetAtom = atomWithStorageNoCrossTabSync<AssetAtom | undefined>(
  "sourceAsset",
  undefined,
);

export const resetWidget = ({ onlyClearInputValues }: { onlyClearInputValues?: boolean } = {}) => {
  const { set } = jotaiStore;

  if (onlyClearInputValues) {
    set(clearAssetInputAmountsAtom);
  } else {
    set(sourceAssetAtom, undefined);
    set(debouncedSourceAssetAmountAtom, "", undefined, true);

    set(destinationAssetAtom, undefined);
    set(debouncedDestinationAssetAmountAtom, "", undefined, true);
  }

  set(setRouteToDefaultRouteAtom);
  set(currentPageAtom, Routes.SwapPage);
  set(errorAtom, undefined);
};

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
  },
);

export const destinationAssetAtom = atomWithStorageNoCrossTabSync<AssetAtom | undefined>(
  "destinationAsset",
  undefined,
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
  },
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

  const sourceAmountIsValidNumber = !isNaN(parseFloat(sourceAmount));
  const destinationAmountIsValidNumber = !isNaN(parseFloat(destinationAmount));
  const sourceAmountHasChanged = sourceAmount !== debouncedSourceAmount;
  const destinationAmountHasChanged = destinationAmount !== debouncedDestinationAmount;

  if (direction === "swap-in") {
    return (sourceAmountHasChanged && sourceAmountIsValidNumber) || isLoading;
  } else if (direction === "swap-out") {
    return (destinationAmountHasChanged && destinationAmountIsValidNumber) || isLoading;
  }
});

export type SwapDirection = "swap-in" | "swap-out";

export const swapDirectionAtom = atomWithStorageNoCrossTabSync<SwapDirection>(
  "swapDirection",
  "swap-in",
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
    const newSwapDirection = swapDirection === "swap-in" ? "swap-out" : "swap-in";
    set(swapDirectionAtom, newSwapDirection);
    set(isInvertingSwapAtom, false);
  });
});

export type ChainFilter = {
  source?: Record<string, string[] | undefined>;
  destination?: Record<string, string[] | undefined>;
};

export const filterAtom = atom<ChainFilter>();

export const filterOutAtom = atom<ChainFilter>();

export const EVM_GAS_AMOUNT = 150_000;

export const COSMOS_GAS_AMOUNT = {
  DEFAULT: 300_000,
  SWAP: 2_800_000,
  CARBON: 1_000_000,
};

export const defaultSwapSettings = {
  slippage: 1,
  routePreference: RoutePreference.FASTEST,
  useUnlimitedApproval: false,
};

export const swapSettingsAtom = atomWithStorageNoCrossTabSync(
  "swapSettingsAtom",
  defaultSwapSettings,
);

export const slippageAtom = atom(
  (get) => get(swapSettingsAtom).slippage,
  (_get, set, newSlippage: number) => {
    set(swapSettingsAtom, (prev) => ({ ...prev, slippage: newSlippage }));
  },
);

export const routePreferenceAtom = atom(
  (get) => get(swapSettingsAtom).routePreference,
  (_get, set, newRoutePreference: RoutePreference) => {
    set(swapSettingsAtom, (prev) => ({ ...prev, routePreference: newRoutePreference }));
  },
);

export const goFastWarningAtom = atomWithStorageNoCrossTabSync("showGoFastWarning", true);
