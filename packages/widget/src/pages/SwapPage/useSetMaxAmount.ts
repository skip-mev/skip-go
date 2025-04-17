import {
  convertHumanReadableAmountToCryptoAmount,
  convertTokenAmountToHumanReadableAmount,
} from "@/utils/crypto";
import { useGetAssetDetails } from "@/hooks/useGetAssetDetails";
import { EVM_GAS_AMOUNT, sourceAssetAmountAtom, sourceAssetAtom } from "@/state/swapPage";
import { useAtom, useSetAtom } from "jotai";
import { skipChainsAtom } from "@/state/skipClient";
import { useGetSourceBalance } from "@/hooks/useGetSourceBalance";
import { BigNumber } from "bignumber.js";
import {
  useCosmosFeeAssetSourceAmountValidation,
  useCosmosFeeAssetsBalanceValidation,
} from "@/hooks/useCosmosFeeAssetValidation";
import { ChainType } from "@skip-go/client";

import { config } from "@/constants/wagmi";
import { createPublicClient, fallback, http } from "viem";
import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";

export const getEvmGasPriceEstimate = async (chainId?: string) => {
  if (!chainId) return;
  const chain = config.chains.find((chain) => chain.id === Number(chainId));

  if (!chain) return null;

  const client = createPublicClient({
    chain,
    transport: http(),
  });

  const fees = await client.estimateFeesPerGas();

  return fees.maxFeePerGas.toString();
};
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

  const getGasFeeTokenAmount = useCallback(async () => {
    switch (chainType) {
      case ChainType.EVM: {
        const isFeeAsset =
          sourceAsset?.denom?.includes("-native") &&
          sourceAsset?.originChainID === sourceAsset?.chainID;

        if (isFeeAsset) {
          const result = await getEvmGasPriceEstimate(sourceAsset?.chainID ?? "");

          if (!result) {
            return convertHumanReadableAmountToCryptoAmount(0.0008, sourceDetails?.asset?.decimals);
          }

          return BigNumber(EVM_GAS_AMOUNT).multipliedBy(result).multipliedBy(1.5).toString();
        }
        return "0";
      }
      case ChainType.Cosmos:
        return cosmosFeeUsed?.feeAmount;
      case ChainType.SVM:
      default:
        return "0";
    }
  }, [
    chainType,
    cosmosFeeUsed?.feeAmount,
    sourceAsset?.chainID,
    sourceAsset?.denom,
    sourceAsset?.originChainID,
    sourceDetails?.asset?.decimals,
  ]);

  const { data: gasFeeTokenAmount } = useQuery({
    queryKey: ["gasFeeTokenAmount", sourceAsset?.chainID, sourceAsset?.denom],
    queryFn: async () => {
      return await getGasFeeTokenAmount();
    },
  });

  return gasFeeTokenAmount;
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
