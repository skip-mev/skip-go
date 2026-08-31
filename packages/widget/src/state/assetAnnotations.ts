import { atom } from "jotai";

export type AssetAnnotationVariant = "warning";

export type AssetAnnotation = {
  label: string;
  variant?: AssetAnnotationVariant;
};

// the key is the recommended symbol, e.g. { "USDC.n": { label: "Migration required", variant: "warning" } }
export type AssetAnnotations = Record<string, AssetAnnotation | undefined>;

export const assetAnnotationsAtom = atom<AssetAnnotations>({});
