import { useAtomValue } from "@/jotai";
import { transactionHistoryItemFromUrlParamsAtom } from "../state/transactionHistoryItemFromUrlParams";
import { skipChainsAtom, skipAssetsAtom } from "@/state/skipClient";
import { convertTokenAmountToHumanReadableAmount } from "@/utils/crypto";

export const useTransactionHistoryItemFromUrlParams = () => {
  const transactionHistoryItemFromUrlParams = useAtomValue(transactionHistoryItemFromUrlParamsAtom);
  const skipChains = useAtomValue(skipChainsAtom);
  const skipAssets = useAtomValue(skipAssetsAtom);

  const sourceAsset = skipAssets?.data?.find((asset) => {
    return asset.chainId === transactionHistoryItemFromUrlParams?.route?.sourceAssetChainId && asset.denom === transactionHistoryItemFromUrlParams?.route?.sourceAssetDenom
  });
  const destAsset = skipAssets?.data?.find((asset) => {
    return asset.chainId === transactionHistoryItemFromUrlParams?.route?.destAssetChainId && asset.denom === transactionHistoryItemFromUrlParams?.route?.destAssetDenom
  });

  console.log(sourceAsset, destAsset);

  return {
    sourceAsset,
    destAsset,
    sourceAmount: convertTokenAmountToHumanReadableAmount(transactionHistoryItemFromUrlParams?.route?.amountIn, sourceAsset?.decimals),
    destAmount: convertTokenAmountToHumanReadableAmount(transactionHistoryItemFromUrlParams?.route?.amountOut, destAsset?.decimals),
    userAddresses: transactionHistoryItemFromUrlParams?.userAddresses as { chainId: string, address: string }[],
  }

}