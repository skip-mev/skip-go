import { atom } from "jotai";
import { ClientAsset } from "@/state/skipClient";
import { skipRouteAtom } from "@/state/route";
import { atomEffect } from "jotai-effect";
import { atomWithDebounce } from "@/utils/atomWithDebounce";
import { convertTokenAmountToHumanReadableAmount } from "@/utils/crypto";
import { limitDecimalsDisplayed } from "@/utils/number";
import { atomWithStorageNoCrossTabSync } from "@/utils/misc";

export type AssetAtom = Partial<ClientAsset> & {
  amount?: string;
};

export const {
  debouncedValueAtom: debouncedSourceAssetAmountAtom,
} = atomWithDebounce<string | undefined>();

export const {
  debouncedValueAtom: debouncedDestinationAssetAmountAtom,
} = atomWithDebounce<string | undefined>();

export const sourceAssetAtom = atomWithStorageNoCrossTabSync<AssetAtom | undefined>(
  "sourceAsset",
  undefined,
);

export const sourceAssetAmountAtom = atom(
  (get) => get(sourceAssetAtom)?.amount,
  (get, set, newAmount: string) => {
    const oldSourceAsset = get(sourceAssetAtom);
    set(sourceAssetAtom, { ...oldSourceAsset, amount: newAmount });
    set(debouncedSourceAssetAmountAtom, newAmount);
    set(swapDirectionAtom, "swap-in");
  }
);

export const destinationAssetAtom = atomWithStorageNoCrossTabSync<AssetAtom | undefined>(
  "destinationAsset",
  undefined
);

export const destinationAssetAmountAtom = atom(
  (get) => get(destinationAssetAtom)?.amount,
  (get, set, newAmount: string, callback?: () => void) => {
    const oldDestinationAsset = get(destinationAssetAtom);
    set(destinationAssetAtom, { ...oldDestinationAsset, amount: newAmount });
    set(debouncedDestinationAssetAmountAtom, newAmount, callback);
    set(swapDirectionAtom, "swap-out");
  }
);

export const isWaitingForNewRouteAtom = atom((get) => {
  const sourceAmount = get(sourceAssetAmountAtom);
  const destinationAmount = get(destinationAssetAmountAtom);
  const debouncedSourceAmount = get(debouncedSourceAssetAmountAtom);
  const debouncedDestinationAmount = get(debouncedDestinationAssetAmountAtom);

  const { isLoading } = get(skipRouteAtom);
  const direction = get(swapDirectionAtom);

  if (direction === "swap-in") {
    return sourceAmount !== debouncedSourceAmount || isLoading;
  } else if (direction === "swap-out") {
    return destinationAmount !== debouncedDestinationAmount || isLoading;
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
  if (destinationAsset?.amount) {
    set(sourceAssetAmountAtom, destinationAsset?.amount);
  }

  set(destinationAssetAtom, { ...sourceAsset });
  if (sourceAsset?.amount) {
    set(destinationAssetAmountAtom, sourceAsset?.amount, () => {
      const newSwapDirection =
        swapDirection === "swap-in" ? "swap-out" : "swap-in";
      set(swapDirectionAtom, newSwapDirection);
      set(isInvertingSwapAtom, false);
    });
  }
});

export const routeAmountEffect = atomEffect((get, set) => {
  const route = get(skipRouteAtom);
  const direction = get(swapDirectionAtom);
  const sourceAsset = get(sourceAssetAtom);
  const destinationAsset = get(destinationAssetAtom);

  if (!route.data || !sourceAsset || !destinationAsset) return;

  const swapInAmount = convertTokenAmountToHumanReadableAmount(
    route.data.amountOut,
    destinationAsset.decimals
  );
  const swapOutAmount = convertTokenAmountToHumanReadableAmount(
    route.data.amountIn,
    sourceAsset.decimals
  );
  const swapInAmountChanged = swapInAmount !== destinationAsset.amount;
  const swapOutAmountChanged = swapOutAmount !== sourceAsset.amount;

  if (direction === "swap-in" && swapInAmountChanged) {
    set(destinationAssetAtom, (old) => ({
      ...old,
      amount: limitDecimalsDisplayed(swapInAmount),
    }));
  } else if (direction === "swap-out" && swapOutAmountChanged) {
    set(sourceAssetAtom, (old) => ({
      ...old,
      amount: limitDecimalsDisplayed(swapOutAmount),
    }));
  }
});

export type ChainFilter = {
  source?: Record<string, string[] | undefined>;
  destination?: Record<string, string[] | undefined>;
};

export const chainFilterAtom = atom<ChainFilter>();

export const defaultSwapSettings = {
  slippage: 3,
  customGasAmount: 200_000
};

export const swapSettingsAtom = atomWithStorageNoCrossTabSync("swapSettingsAtom", defaultSwapSettings);

export const setSlippageAtom = atom(null, (_get, set, slippage: number) => {
  set(swapSettingsAtom, (state) => ({ ...state, slippage }));
});