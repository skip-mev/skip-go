import { atom } from "jotai";
import { ClientAsset } from "@/state/skipClient";
import { skipRouteAtom } from "@/state/route";
import { atomWithDebounce } from "@/utils/atomWithDebounce";
import { atomWithStorageNoCrossTabSync } from "@/utils/misc";

export type AssetAtom = Partial<ClientAsset> & {
  amount?: string;
};

export const sourceAssetAtom = atomWithStorageNoCrossTabSync<AssetAtom | undefined>(
  "sourceAsset",
  undefined
);

export const sourceAssetAmountAtom = atom(
  (get) => get(sourceAssetAtom)?.amount,
  (get, set, newAmount: string) => {
    const oldSourceAsset = get(sourceAssetAtom);
    set(sourceAssetAtom, { ...oldSourceAsset, amount: newAmount });
    set(swapDirectionAtom, "swap-in");
  }
);

export const clearInputAmountsAtom = atom(null, (_get, set) => {
  set(sourceAssetAmountAtom, "");
  set(destinationAssetAmountAtom, "");
});

export const destinationAssetAtom = atomWithStorageNoCrossTabSync<AssetAtom | undefined>(
  "destinationAsset",
  undefined
);

export const destinationAssetAmountAtom = atom(
  (get) => get(destinationAssetAtom)?.amount,
  (get, set, newAmount: string, callback?: () => void) => {
    const oldDestinationAsset = get(destinationAssetAtom);
    set(destinationAssetAtom, { ...oldDestinationAsset, amount: newAmount });
    set(swapDirectionAtom, "swap-out");
    callback?.();
  }
);

export const isWaitingForNewRouteAtom = atom((get) => {
  const { isLoading } = get(skipRouteAtom);
  return isLoading
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