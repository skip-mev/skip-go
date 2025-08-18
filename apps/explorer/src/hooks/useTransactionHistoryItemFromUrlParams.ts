import { useAtomValue } from "@/jotai";
import { transactionHistoryItemFromUrlParamsAtom } from "../state/transactionHistoryItemFromUrlParams";
import { skipAssetsAtom } from "@/state/skipClient";
import { convertTokenAmountToHumanReadableAmount } from "@/utils/crypto";
import { getClientOperations } from "@/utils/clientType";
import { RouteStatus } from "@skip-go/client";

export const useTransactionHistoryItemFromUrlParams = () => {
  const transactionHistoryItemFromUrlParams = useAtomValue(transactionHistoryItemFromUrlParamsAtom);
  const skipAssets = useAtomValue(skipAssetsAtom);

  const sourceAsset = skipAssets?.data?.find((asset) => {
    return asset.chainId === transactionHistoryItemFromUrlParams?.route?.sourceAssetChainId && asset.denom === transactionHistoryItemFromUrlParams?.route?.sourceAssetDenom
  });
  const destAsset = skipAssets?.data?.find((asset) => {
    return asset.chainId === transactionHistoryItemFromUrlParams?.route?.destAssetChainId && asset.denom === transactionHistoryItemFromUrlParams?.route?.destAssetDenom
  });

  return {
    sourceAsset,
    destAsset,
    sourceAmount: convertTokenAmountToHumanReadableAmount(transactionHistoryItemFromUrlParams?.route?.amountIn, sourceAsset?.decimals),
    destAmount: convertTokenAmountToHumanReadableAmount(transactionHistoryItemFromUrlParams?.route?.amountOut, destAsset?.decimals),
    userAddresses: transactionHistoryItemFromUrlParams?.userAddresses as { chainId: string, address: string }[],
    operations: getClientOperations(transactionHistoryItemFromUrlParams?.route?.operations),
    routeStatus: transactionHistoryItemFromUrlParams?.status as RouteStatus,
  }
}