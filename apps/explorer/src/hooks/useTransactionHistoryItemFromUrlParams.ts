import { useAtomValue } from "@/jotai";
import { skipAssetsAtom } from "@/state/skipClient";
import { convertTokenAmountToHumanReadableAmount } from "@/utils/crypto";
import { getClientOperations } from "@/utils/clientType";
import { RouteStatus } from "@skip-go/client";

const getTransactionHistoryItemFromUrlParams = () => {
  try {
    let targetUrl;
    if (typeof window !== 'undefined') {
      targetUrl = new URL(window.location.href);
    }

    const base64Data = targetUrl?.searchParams.get("data");
    
    if (!base64Data) {
      console.warn("No 'data' parameter found in URL");
      return null;
    }

    const jsonString = atob(base64Data);

    const decodedData = JSON.parse(jsonString);
    
    return decodedData;

  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to decode URL parameter:", error.message);
    } else {
      console.error("Failed to decode URL parameter:", String(error));
    }
  }
}

export const useTransactionHistoryItemFromUrlParams = () => {
  const transactionHistoryItemFromUrlParams = getTransactionHistoryItemFromUrlParams();
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
    transactionDetails: transactionHistoryItemFromUrlParams?.transactionDetails,
  }
}