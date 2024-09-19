
import { convertHumanReadableAmountToCryptoAmount, convertTokenAmountToHumanReadableAmount } from "@/utils/crypto";
import { useGetAssetDetails } from "@/hooks/useGetAssetDetails";
import { sourceAssetAmountAtom, sourceAssetAtom } from "@/state/swapPage";
import { useAtom, useSetAtom } from "jotai";
import { skipChainsAtom } from "@/state/skipClient";
import { useSourceBalance } from "./useSourceBalance";
import { BigNumber } from "bignumber.js";


const ETH_GAS_FEE = 0.1;
const COSMOS_GAS_FEE = 2_000_000;

export const useSetMaxAmount = () => {
  const [sourceAsset] = useAtom(sourceAssetAtom);
  const [{ data: chains }] = useAtom(skipChainsAtom);
  const sourceBalance = useSourceBalance();

  const sourceDetails = useGetAssetDetails({
    assetDenom: sourceAsset?.denom,
    amount: sourceAsset?.amount,
    chainId: sourceAsset?.chainID,
  });


  const feeAsset = chains?.find(chain => chain.chainID === sourceAsset?.chainID)?.feeAssets?.[0];
  const setSourceAssetAmount = useSetAtom(sourceAssetAmountAtom);
  const chainType = sourceDetails?.chain?.chainType;

  const getGasFeeTokenAmount = () => {
    switch (chainType) {
      case "evm":
        return Number(convertHumanReadableAmountToCryptoAmount(ETH_GAS_FEE));
      case "cosmos":
        if (!feeAsset?.gasPrice?.average) return 0;
        return Number(feeAsset.gasPrice.average) * (COSMOS_GAS_FEE);
      case "svm":
      default:
        return 0;
    }
  };

  return () => {
    const gasFeeTokenAmount = getGasFeeTokenAmount();
    const maxTokenAmount = sourceBalance?.amount;
    if (gasFeeTokenAmount && maxTokenAmount) {
      const maxTokenAmountMinusGasFees = BigNumber(maxTokenAmount).minus(gasFeeTokenAmount).toString();
      const maxAmountMinusGasFees = convertTokenAmountToHumanReadableAmount(maxTokenAmountMinusGasFees);

      setSourceAssetAmount(maxAmountMinusGasFees);
    }
  };
};