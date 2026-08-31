import { atom } from "jotai";

export type AssetAnnotationVariant = "info" | "warning" | "error";

export type AssetAnnotation = {
  variant?: AssetAnnotationVariant;
  // Rendered on the swap input for the selected asset (badge + warning icon).
  swapInput?: {
    label: string;
  };
  // Rendered on the asset's row in the token selector.
  selector?: {
    label: string;
    description?: string;
    // Pin this asset to the very top of the token selector, above balances.
    pinToTop?: boolean;
  };
};

// keyed by recommended symbol, e.g. { "USDC.n": { variant: "info", swapInput: {...}, selector: {...} } }
export type AssetAnnotations = Record<string, AssetAnnotation | undefined>;

export const assetAnnotationsAtom = atom<AssetAnnotations>({});
