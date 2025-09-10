import {
  convertHumanReadableAmountToCryptoAmount,
  convertTokenAmountToHumanReadableAmount,
} from "@/utils/crypto";
import { useGetAssetDetails } from "@/hooks/useGetAssetDetails";
import { EVM_GAS_AMOUNT, sourceAssetAmountAtom, sourceAssetAtom } from "@/state/swapPage";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { skipAssetsAtom, skipChainsAtom } from "@/state/skipClient";
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
    transport: fallback([
      http("https://ethereum.publicnode.com"),
      http("https://rpc.ankr.com/eth"),
      http("https://cloudflare-eth.com"),
    ]),
  });

  const fees = await client.estimateFeesPerGas();

  return fees.maxFeePerGas.toString();
};
export const useGasFeeTokenAmount = () => {
  const [sourceAsset] = useAtom(sourceAssetAtom);
  const { data: skipAssets } = useAtomValue(skipAssetsAtom);

  const sourceDetails = useGetAssetDetails({
    assetDenom: sourceAsset?.denom,
    amount: sourceAsset?.amount,
    chainId: sourceAsset?.chainId,
  });

  const cosmosFees = useCosmosFeeAssetsBalanceValidation(sourceAsset?.chainId);
  const cosmosFeeUsed = cosmosFees?.find((fee) => fee?.isSufficient);
  const chainType = sourceDetails?.chain?.chainType;

  const getGasFeeTokenAmount = useCallback(async () => {
    switch (chainType) {
      case ChainType.Evm: {
        const isFeeAsset =
          (sourceAsset?.denom?.includes("-native") ||
            sourceAsset?.denom?.includes("0x0000000000000000000000000000000000000000")) &&
          sourceAsset?.originChainId === sourceAsset?.chainId;

        if (isFeeAsset) {
          const nativeAsset = skipAssets?.find(
            (asset) =>
              sourceAsset?.originChainId === sourceAsset?.chainId &&
              asset.denom?.includes("-native"),
          );

          const gasPriceEstimate = await getEvmGasPriceEstimate(sourceAsset?.chainId ?? "");
          if (!gasPriceEstimate) {
            return convertHumanReadableAmountToCryptoAmount(0.0008, nativeAsset?.decimals);
          }

          const gasFeeTokenAmount = BigNumber(EVM_GAS_AMOUNT).multipliedBy(gasPriceEstimate);

          if (gasFeeTokenAmount.isGreaterThan(0)) {
            return gasFeeTokenAmount.toString();
          }
        }

        return 0;
      }
      case ChainType.Cosmos:
        if (!cosmosFeeUsed || cosmosFeeUsed?.denom !== sourceAsset?.denom) return 0;
        return cosmosFeeUsed?.feeAmount;
      case ChainType.Svm:
      default:
        return 0;
    }
  }, [
    chainType,
    cosmosFeeUsed,
    skipAssets,
    sourceAsset?.chainId,
    sourceAsset?.denom,
    sourceAsset?.originChainId,
  ]);

  const { data: gasFeeTokenAmount } = useQuery({
    queryKey: [
      "gasFeeTokenAmount",
      {
        chainType,
        cosmosFeeUsed,
        sourceAsset,
        sourceDetails,
      },
    ],
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

  const chain = chains?.find((chain) => chain.chainId === sourceAsset?.chainId);
  if (chain?.chainType === ChainType.Cosmos) {
    return cosmosFeeAssetValidation;
  }

  if (BigNumber(maxAmountTokenMinusFees).isGreaterThanOrEqualTo(BigNumber(sourceAsset?.amount))) {
    return false;
  }
  return true;
};
