import { useAtomValue } from "@/jotai";
import { skipAssetsAtom } from "@/state/skipClient";
import { convertTokenAmountToHumanReadableAmount } from "@/utils/crypto";
import { getClientOperations } from "@/utils/clientType";
import { useQueryState } from "nuqs";
import { useMemo } from "react";

export const useTransactionHistoryItemFromUrlParams = () => {
  const [data] = useQueryState("data");
  const skipAssets = useAtomValue(skipAssetsAtom);

  const transactionHistoryItemFromUrlParams = useMemo(() => {
    if (!data) return null;
    
    try {
      const jsonString = atob(data);
      const decodedData = JSON.parse(jsonString);
      return decodedData;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to decode URL parameter:", error.message);
      } else {
        console.error("Failed to decode URL parameter:", String(error));
      }
      return null;
    }
  }, [data]);

  const sourceAsset = useMemo(() => {
    return skipAssets?.data?.find((asset) => {
      return asset.chainId === transactionHistoryItemFromUrlParams?.route?.sourceAssetChainId && 
             asset.denom === transactionHistoryItemFromUrlParams?.route?.sourceAssetDenom;
    });
  }, [skipAssets?.data, transactionHistoryItemFromUrlParams?.route?.sourceAssetChainId, transactionHistoryItemFromUrlParams?.route?.sourceAssetDenom]);

  const destAsset = useMemo(() => {
    return skipAssets?.data?.find((asset) => {
      return asset.chainId === transactionHistoryItemFromUrlParams?.route?.destAssetChainId && 
             asset.denom === transactionHistoryItemFromUrlParams?.route?.destAssetDenom;
    });
  }, [skipAssets?.data, transactionHistoryItemFromUrlParams?.route?.destAssetChainId, transactionHistoryItemFromUrlParams?.route?.destAssetDenom]);

  return {
    sourceAsset,
    destAsset,
    sourceAmount: transactionHistoryItemFromUrlParams?.route?.amountIn && sourceAsset?.decimals !== undefined ? convertTokenAmountToHumanReadableAmount(
      transactionHistoryItemFromUrlParams?.route?.amountIn, 
      sourceAsset.decimals
    ) : undefined,
    destAmount: transactionHistoryItemFromUrlParams?.route?.amountOut && destAsset?.decimals !== undefined ? convertTokenAmountToHumanReadableAmount(
      transactionHistoryItemFromUrlParams?.route?.amountOut,
      destAsset.decimals
    ) : undefined,
    userAddresses: transactionHistoryItemFromUrlParams?.userAddresses as { chainId: string, address: string }[],
    operations: getClientOperations(transactionHistoryItemFromUrlParams?.route?.operations),
    transactionDetails: transactionHistoryItemFromUrlParams?.transactionDetails,
  };
};