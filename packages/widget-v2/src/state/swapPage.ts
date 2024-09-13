import { atom } from "jotai";
import { ClientAsset, skipRouteAtom } from "./skipClient";
import { Wallet } from "@/components/RenderWalletList";
import { atomEffect } from "jotai-effect";
import { parseAmountWei } from "@/utils/number";
import { atomWithDebounce } from "@/utils/atomWithDebounce";

export type AssetAtom = Partial<ClientAsset> & {
  amount?: string;
};

const ROUTE_REQUEST_DEBOUNCE_DELAY = 500;

export const { debouncedValueAtom: debouncedSourceAssetAmount } = atomWithDebounce<string | undefined>(
  undefined,
  ROUTE_REQUEST_DEBOUNCE_DELAY,
);

export const { debouncedValueAtom: debouncedDestinationAssetAmount } = atomWithDebounce<string | undefined>(
  undefined,
  ROUTE_REQUEST_DEBOUNCE_DELAY,
);

export const sourceAssetAtom = atom<AssetAtom>();

export const sourceAssetAmount = atom(
  (get) => get(sourceAssetAtom)?.amount,
  (get, set, newAmount: string) => {
    const oldSourceAsset = get(sourceAssetAtom);
    set(sourceAssetAtom, { ...oldSourceAsset, amount: newAmount });
    set(debouncedSourceAssetAmount, newAmount);
  },
);

export const destinationAssetAtom = atom<AssetAtom>();

export const destinationAssetAmount = atom(
  (get) => get(destinationAssetAtom)?.amount,
  (get, set, newAmount: string) => {
    const oldDestinationAsset = get(destinationAssetAtom);
    set(destinationAssetAtom, { ...oldDestinationAsset, amount: newAmount });
    set(debouncedDestinationAssetAmount, newAmount);
  },
);

export const swapDirectionAtom = atom<"swap-in" | "swap-out">("swap-in");

export const connectedWalletAtom = atom<Wallet>();

export const destinationWalletAtom = atom<Wallet>();

export const routeAmountEffect = atomEffect((get, set) => {
  const route = get(skipRouteAtom);
  const direction = get(swapDirectionAtom);
  const sourceAsset = get(sourceAssetAtom);
  const destinationAsset = get(destinationAssetAtom);

  if (!route.data || !sourceAsset || !destinationAsset) return;

  const swapInAmount = parseAmountWei(route.data.amountOut, destinationAsset.decimals);
  const swapOutAmount = parseAmountWei(route.data.amountIn, sourceAsset.decimals);
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
