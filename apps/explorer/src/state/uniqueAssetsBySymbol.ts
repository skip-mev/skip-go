import { atom } from "@/jotai";
import { ClientAsset, skipAssetsAtom } from "@/state/skipClient";

export const uniqueAssetsBySymbolAtom = atom((get) => {
  const { data: assets } = get(skipAssetsAtom);

  const seen = new Map<string, ClientAsset>();
  
  assets?.forEach(asset => {
    const chainId = asset.chainId;
    if (chainId && !seen.has(chainId)) {
      seen.set(chainId, asset);
    }
  });
  
  return Array.from(seen.values());
});
