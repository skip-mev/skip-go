import { atom } from "jotai";
import { ClientAsset, skipRouteAtom } from "./skipClient";
import { atomEffect } from "jotai-effect";
import { atomWithDebounce } from "@/utils/atomWithDebounce";
import { MinimalWallet } from "./wallets";
import { convertTokenAmountToHumanReadableAmount } from "@/utils/crypto";

export type AssetAtom = Partial<ClientAsset> & {
  amount?: string;
};

const ROUTE_REQUEST_DEBOUNCE_DELAY = 500;

export const {
  debouncedValueAtom: debouncedSourceAssetAmountAtom,
  forceUpdateAtom: forceUpdateSourceAssetAmountAtom,
} = atomWithDebounce<string | undefined>(
  undefined,
  ROUTE_REQUEST_DEBOUNCE_DELAY
);

export const {
  debouncedValueAtom: debouncedDestinationAssetAmountAtom,
  forceUpdateAtom: forceUpdateDestinationAssetAmountAtom,
} = atomWithDebounce<string | undefined>(
  undefined,
  ROUTE_REQUEST_DEBOUNCE_DELAY
);

export const sourceAssetAtom = atom<AssetAtom>();

export const sourceAssetAmountAtom = atom(
  (get) => get(sourceAssetAtom)?.amount,
  (get, set, newAmount: string) => {
    const oldSourceAsset = get(sourceAssetAtom);
    set(sourceAssetAtom, { ...oldSourceAsset, amount: newAmount });
    set(debouncedSourceAssetAmountAtom, newAmount);
    set(swapDirectionAtom, "swap-in");
  }
);

export const destinationAssetAtom = atom<AssetAtom>();

export const destinationAssetAmountAtom = atom(
  (get) => get(destinationAssetAtom)?.amount,
  (get, set, newAmount: string, callback?: () => void) => {
    const oldDestinationAsset = get(destinationAssetAtom);
    set(destinationAssetAtom, { ...oldDestinationAsset, amount: newAmount });
    set(debouncedDestinationAssetAmountAtom, newAmount);
    set(swapDirectionAtom, "swap-out");
    callback?.();
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

export const swapDirectionAtom = atom<SwapDirection>("swap-in");

export const isInvertingSwapAtom = atom(false);

export const invertSwapAtom = atom(null, (get, set) => {
  const sourceAsset = get(sourceAssetAtom);
  const destinationAsset = get(destinationAssetAtom);
  const swapDirection = get(swapDirectionAtom);
  set(isInvertingSwapAtom, true);

  set(sourceAssetAtom, destinationAsset);
  if (destinationAsset?.amount) {
    set(sourceAssetAmountAtom, destinationAsset?.amount);
  }

  set(destinationAssetAtom, sourceAsset);
  if (sourceAsset?.amount) {
    set(destinationAssetAmountAtom, sourceAsset?.amount, () => {
      const newSwapDirection = swapDirection === "swap-in" ? "swap-out" : "swap-in";
      set(swapDirectionAtom, newSwapDirection);
    });
  }

});

export const connectedWalletAtom = atom<MinimalWallet>();

export const destinationWalletAtom = atom<MinimalWallet>();

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
      amount: swapInAmount,
    }));
  } else if (direction === "swap-out" && swapOutAmountChanged) {
    set(sourceAssetAtom, (old) => ({
      ...old,
      amount: swapOutAmount,
    }));
  }
});

export const swapSettingsAtom = atom({
  slippage: 3,
});
