import { atom } from "jotai";

export type AssetAnnotationVariant = "info" | "warning" | "error";

export type AssetAnnotation = {
  // color of the badge / icon / border; defaults to "info"
  variant?: AssetAnnotationVariant;
  // shown on the swap page asset rows (source and destination) for the selected asset.
  // when `label` is set, a badge and a warning icon (right of the name) are rendered.
  swapPage?: {
    label: string;
  };
  // shown on the asset's row in the token selector.
  selector?: {
    // detail line under the asset name, rendered with a warning icon on its left
    description?: string;
    // pin this asset to the very top of the token selector, above balances
    pinToTop?: boolean;
  };
};

// Keyed by the grouped asset's recommended symbol (same key the selector groups by:
// GroupedAsset.id resolves to recommendedSymbol for annotation targets), e.g.
// { "USDC.n": { variant: "info", swapPage: {...}, selector: {...} } }
export type AssetAnnotations = Record<string, AssetAnnotation | undefined>;

export const assetAnnotationsAtom = atom<AssetAnnotations>({});
