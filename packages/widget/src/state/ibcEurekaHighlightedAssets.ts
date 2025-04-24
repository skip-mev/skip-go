import { atom } from "jotai";

export type IbcEurekaHighlightedAssets = Record<string, string[] | undefined>;

// the key will be recommended symbol and the value is the chainIDs
// if the value is undefined all chains are highlighted
// example { USDC: ['cosmoshub-4'], USDT: undefined }
export const ibcEurekaHighlightedAssetsAtom = atom<IbcEurekaHighlightedAssets>({});
