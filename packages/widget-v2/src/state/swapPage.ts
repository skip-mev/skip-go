import { atom } from "jotai";
import { ClientAsset, skipRouteAtom } from "./skipClient";
import { Wallet } from "@/components/RenderWalletList";
import { atomEffect } from "jotai-effect";
import { parseAmountWei } from "@/utils/number";

export type AssetAtom = Partial<ClientAsset> & {
  amount?: string;
};

export const sourceAssetAtom = atom<AssetAtom>();

export const destinationAssetAtom = atom<AssetAtom>();

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
