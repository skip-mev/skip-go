import { skipAssetsAtom } from "@/state/skipClient";
import { TransferAssetRelease } from "@skip-go/client";
import { useMemo } from "react";
import { useAtomValue } from "@/jotai";
import { transformHexToMoveDenom } from "../utils/denomUtils";

export const useGetTransferAssetReleaseAsset = (transferAssetRelease?: TransferAssetRelease) => {
  const skipAssets = useAtomValue(skipAssetsAtom);

  const transferAssetReleaseAsset = useMemo(() => {
    if (!transferAssetRelease) return;
    if (transferAssetRelease?.denom === "0x0000000000000000000000000000000000000000") {
      return skipAssets?.data?.find((asset) => asset.chainId === transferAssetRelease?.chainId && asset.denom.includes("-native"));
    }
    return skipAssets?.data?.find((asset) =>
      asset.chainId === transferAssetRelease?.chainId &&
      (asset.denom === transferAssetRelease?.denom ||
        asset.denom === transformHexToMoveDenom(transferAssetRelease?.denom)
      ));
  }, [skipAssets?.data, transferAssetRelease]);

  return transferAssetReleaseAsset;
}