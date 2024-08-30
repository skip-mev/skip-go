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
  const route = get(skipRouteAtom)
  const direction = get(swapDirectionAtom)
  const sourceAsset = get(sourceAssetAtom)
  const destinationAsset = get(destinationAssetAtom)

  const isSwapIn = direction === "swap-in";

  if (!route.data || !sourceAsset || !destinationAsset) return

  if (isSwapIn) {
    const amount = parseAmountWei(route.data.amountOut, destinationAsset.decimals)
    set(destinationAssetAtom, (old) => ({
      ...old,
      amount,
    }))
  }
  else {
    const amount = parseAmountWei(route.data.amountIn, sourceAsset.decimals)
    set(sourceAssetAtom, (old) => ({
      ...old,
      amount,
    }))
  }
})
