
import { convertHumanReadableAmountToCryptoAmount, convertTokenAmountToHumanReadableAmount } from "@/utils/crypto";
import { useGetAssetDetails } from "@/hooks/useGetAssetDetails";
import { sourceAssetAmountAtom, sourceAssetAtom } from "@/state/swapPage";
import { useAtom, useSetAtom } from "jotai";
import { skipChainsAtom } from "@/state/skipClient";
import { useGetSourceBalance } from "@/hooks/useGetSourceBalance";
import { BigNumber } from "bignumber.js";
import { calculateFee, GasPrice } from "@cosmjs/stargate";
import { Decimal } from "@cosmjs/math";
import { useGetBalance } from "@/hooks/useGetBalance";

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
      {
        const isFeeAsset = sourceAsset?.denom?.includes("-native") && sourceAsset?.originChainID === sourceAsset?.chainID;
        if (isFeeAsset) {
          switch (sourceAsset?.chainID) {
            case "1": // mainnet
              return Number(convertHumanReadableAmountToCryptoAmount(0.015, sourceDetails.asset?.decimals));
            case "137": // polygon
              return Number(convertHumanReadableAmountToCryptoAmount(0.06, sourceDetails.asset?.decimals));
            case "43114": // avalanche
              return Number(convertHumanReadableAmountToCryptoAmount(0.02, sourceDetails.asset?.decimals));
            case "42220": // celo
              return Number(convertHumanReadableAmountToCryptoAmount(0.01, sourceDetails.asset?.decimals));
            default: // other chains
              return Number(convertHumanReadableAmountToCryptoAmount(0.0008, sourceDetails.asset?.decimals));
          }
        }
        return 0;
      }
    case "cosmos":
      if (!feeAsset?.gasPrice?.average || feeAsset.denom !== sourceAsset?.denom) return 0;
      return Number(feeAsset.gasPrice.average) * (COSMOS_GAS_FEE);
    case "svm":
    default:
      return 0;
  }
};

export const useMaxAmountTokenMinusFees = () => {
  const { data: sourceBalance } = useGetSourceBalance();
  const gasFeeTokenAmount = useGasFeeTokenAmount();
  const maxTokenAmount = sourceBalance?.amount;

  if (gasFeeTokenAmount && maxTokenAmount) {
    const maxTokenAmountMinusGasFees = BigNumber(maxTokenAmount).minus(gasFeeTokenAmount).toString();
    const maxAmountMinusGasFees = convertTokenAmountToHumanReadableAmount(maxTokenAmountMinusGasFees, sourceBalance?.decimals);

    if (Number(maxAmountMinusGasFees) > 0) {
      return maxAmountMinusGasFees;
    } else {
      return "0";
    }
  }
  return maxTokenAmount && convertTokenAmountToHumanReadableAmount(String(maxTokenAmount), sourceBalance?.decimals);
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
  const getBalance = useGetBalance();
  const [{ data: chains }] = useAtom(skipChainsAtom);
  const assetDetail = useGetAssetDetails({
    assetDenom: sourceAsset?.denom,
    amount: sourceAsset?.amount,
    chainId: sourceAsset?.chainID,
  });
  if (!sourceAsset?.amount) return false;
  if (!maxAmountTokenMinusFees) return true;

  const chain = chains?.find(chain => chain.chainID === sourceAsset?.chainID);
  if (chain?.chainType === "cosmos") {
    const cosmosFeeAssets = chain?.feeAssets;
    const cosmosFees = cosmosFeeAssets?.map((asset) => {
      const gasPrice = (() => {
        if (!asset.gasPrice) return undefined;
        let price = asset.gasPrice.average;
        if (price === '') {
          price = asset.gasPrice.high;
        }
        if (price === '') {
          price = asset.gasPrice.low;
        }
        return new GasPrice(Decimal.fromUserInput(price, 18), asset.denom);
      })();
      if (!gasPrice) return undefined;
      const fee = calculateFee(Math.ceil(parseFloat(String(COSMOS_GAS_FEE))), gasPrice);
      const feeAmount = convertTokenAmountToHumanReadableAmount(fee.amount[0].amount, assetDetail.decimals)
      if (!sourceAsset?.chainID) return undefined;
      const _balance = getBalance(sourceAsset?.chainID, asset.denom)?.amount;
      if (!_balance) return undefined;
      const balance = convertTokenAmountToHumanReadableAmount(_balance, assetDetail.decimals);
      const balanceMinusFee = BigNumber(balance).minus(feeAmount).toString();
      return {
        denom: asset.denom,
        amount: feeAmount,
        isSufficient: BigNumber(balanceMinusFee).isGreaterThanOrEqualTo(BigNumber(feeAmount))
      };
    }).filter((asset) => asset) as { denom: string, amount: string, isSufficient: boolean }[];
    if (!cosmosFees) return false;
    const isSufficient = cosmosFees.find((fee) => fee.isSufficient);
    if (isSufficient) return false;
    return true;
  }

  if (BigNumber(maxAmountTokenMinusFees).isGreaterThanOrEqualTo(BigNumber(sourceAsset?.amount))) {
    return false;
  }

  return true;
};
