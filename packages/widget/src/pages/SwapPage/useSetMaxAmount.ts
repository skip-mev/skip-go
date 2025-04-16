import {
  convertHumanReadableAmountToCryptoAmount,
  convertTokenAmountToHumanReadableAmount,
} from "@/utils/crypto";
import { useGetAssetDetails } from "@/hooks/useGetAssetDetails";
import { sourceAssetAmountAtom, sourceAssetAtom } from "@/state/swapPage";
import { useAtom, useSetAtom } from "jotai";
import { skipChainsAtom } from "@/state/skipClient";
import { useGetSourceBalance } from "@/hooks/useGetSourceBalance";
import { BigNumber } from "bignumber.js";
import {
  useCosmosFeeAssetSourceAmountValidation,
  useCosmosFeeAssetsBalanceValidation,
} from "@/hooks/useCosmosFeeAssetValidation";
import { ChainType } from "@skip-go/client";

export const useGasFeeTokenAmount = () => {
  const [sourceAsset] = useAtom(sourceAssetAtom);

  const sourceDetails = useGetAssetDetails({
    assetDenom: sourceAsset?.denom,
    amount: sourceAsset?.amount,
    chainId: sourceAsset?.chainID,
  });

  const cosmosFees = useCosmosFeeAssetsBalanceValidation(sourceAsset?.chainID);
  const cosmosFeeUsed = cosmosFees?.find((fee) => fee?.isSufficient);

  const chainType = sourceDetails?.chain?.chainType;

  switch (chainType) {
    case ChainType.EVM: {
      const isFeeAsset =
        sourceAsset?.denom?.includes("-native") &&
        sourceAsset?.originChainID === sourceAsset?.chainID;

      if (!isFeeAsset || !sourceDetails.asset?.decimals) return 0;

      let gasLimit: number;
      let gasPriceGwei: number;

      switch (sourceAsset?.chainID) {
        case "1": // Ethereum Mainnet
          gasLimit = 21000;
          gasPriceGwei = 50;
          break;
        case "137": // Polygon
          gasLimit = 80000;
          gasPriceGwei = 40;
          break;
        case "43114": // Avalanche
          gasLimit = 21000;
          gasPriceGwei = 25;
          break;
        case "42220": // Celo
          gasLimit = 21000;
          gasPriceGwei = 5;
          break;
        default:
          gasLimit = 21000;
          gasPriceGwei = 20;
          break;
      }

      const gasFeeInWei = BigNumber(gasLimit).multipliedBy(gasPriceGwei).multipliedBy(1e9); // convert Gwei to Wei

      const gasFeeInBaseUnits = gasFeeInWei.toFixed(0);
      return Number(gasFeeInBaseUnits);
    }
    case ChainType.Cosmos:
      if (!cosmosFeeUsed || cosmosFeeUsed?.denom !== sourceAsset?.denom) return 0;
      return Number(cosmosFeeUsed.feeAmount);
    case ChainType.SVM:
    default:
      return 0;
  }
};

export const useMaxAmountTokenMinusFees = () => {
  const { data: sourceBalance } = useGetSourceBalance();
  const gasFeeTokenAmount = useGasFeeTokenAmount();
  const maxTokenAmount = sourceBalance?.amount;

  if (gasFeeTokenAmount && maxTokenAmount) {
    const maxTokenAmountMinusGasFees = BigNumber(maxTokenAmount)
      .minus(gasFeeTokenAmount)
      .toString();
    const maxAmountMinusGasFees = convertTokenAmountToHumanReadableAmount(
      maxTokenAmountMinusGasFees,
      sourceBalance?.decimals,
    );

    if (Number(maxAmountMinusGasFees) > 0) {
      return maxAmountMinusGasFees;
    } else {
      return "0";
    }
  }
  return (
    maxTokenAmount &&
    convertTokenAmountToHumanReadableAmount(String(maxTokenAmount), sourceBalance?.decimals)
  );
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
  const [{ data: chains }] = useAtom(skipChainsAtom);
  const cosmosFeeAssetValidation = useCosmosFeeAssetSourceAmountValidation();

  if (!sourceAsset?.amount) return false;
  if (!maxAmountTokenMinusFees) return true;

  const chain = chains?.find((chain) => chain.chainID === sourceAsset?.chainID);
  if (chain?.chainType === ChainType.Cosmos) {
    return cosmosFeeAssetValidation;
  }

  if (BigNumber(maxAmountTokenMinusFees).isGreaterThanOrEqualTo(BigNumber(sourceAsset?.amount))) {
    return false;
  }
  return true;
};
