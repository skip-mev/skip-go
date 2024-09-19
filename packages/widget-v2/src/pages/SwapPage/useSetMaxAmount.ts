
import { convertHumanReadableAmountToCryptoAmount, convertTokenAmountToHumanReadableAmount } from "@/utils/crypto";
import { useGetAssetDetails } from "@/hooks/useGetAssetDetails";
import { sourceAssetAmountAtom, sourceAssetAtom } from "@/state/swapPage";
import { useAtom, useSetAtom } from "jotai";
import { skipChainsAtom } from "@/state/skipClient";
import { useSourceBalance } from "./useSourceBalance";
import { BigNumber } from "bignumber.js";


const ETH_GAS_FEE = 0.1;
const COSMOS_GAS_FEE = 2_000_000;

export const useGasFeeTokenAmount = () => {
  const [sourceAsset] = useAtom(sourceAssetAtom);
  const [{ data: chains }] = useAtom(skipChainsAtom);

  const sourceDetails = useGetAssetDetails({
    assetDenom: sourceAsset?.denom,
    amount: sourceAsset?.amount,
    chainId: sourceAsset?.chainID,
  });


  const feeAsset = chains?.find(chain => chain.chainID === sourceAsset?.chainID)?.feeAssets?.[0];
  const chainType = sourceDetails?.chain?.chainType;

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

export const useMaxAmountTokenMinusFees = () => {
  const sourceBalance = useSourceBalance();
  const gasFeeTokenAmount = useGasFeeTokenAmount();
  const maxTokenAmount = sourceBalance?.amount;

  if (gasFeeTokenAmount && maxTokenAmount) {
    const maxTokenAmountMinusGasFees = BigNumber(maxTokenAmount).minus(gasFeeTokenAmount).toString();
    const maxAmountMinusGasFees = convertTokenAmountToHumanReadableAmount(maxTokenAmountMinusGasFees);

    return maxAmountMinusGasFees;
  }
};

export const useSetMaxAmount = () => {
  const maxAmountTokenMinusFees = useMaxAmountTokenMinusFees();
  const setSourceAssetAmount = useSetAtom(sourceAssetAmountAtom);

  return () => {
    if (maxAmountTokenMinusFees) {
      setSourceAssetAmount(maxAmountTokenMinusFees);
    }
  };
};

export const useInsufficientSourceBalance = () => {
  const maxAmountTokenMinusFees = useMaxAmountTokenMinusFees();
  const [sourceAsset] = useAtom(sourceAssetAtom);

  if (!maxAmountTokenMinusFees || !sourceAsset?.amount) return true;

  if (BigNumber(maxAmountTokenMinusFees).isGreaterThanOrEqualTo(BigNumber(sourceAsset?.amount))) {
    return false;
  }

  return true;
};