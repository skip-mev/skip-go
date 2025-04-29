import { skipAssetsAtom, skipChainsAtom, skipSwapVenuesAtom } from "@/state/skipClient";
import { convertTokenAmountToHumanReadableAmount } from "@/utils/crypto";
import { Decimal } from "@cosmjs/math";
import { GasPrice, calculateFee } from "@cosmjs/stargate";
import { useAtomValue } from "jotai";
import { useGetBalance } from "./useGetBalance";
import { COSMOS_GAS_AMOUNT, sourceAssetAtom } from "@/state/swapPage";
import { BigNumber } from "bignumber.js";
import { useMemo } from "react";
import { useMaxAmountTokenMinusFees } from "@/pages/SwapPage/useSetMaxAmount";

/** feeAmount is in crypto amount */
export const useCosmosFeeAssetsBalanceValidation = (chainId?: string) => {
  const getBalance = useGetBalance();
  const { data: chains } = useAtomValue(skipChainsAtom);
  const { data: swapVenues } = useAtomValue(skipSwapVenuesAtom);

  const feeAssetsState = useMemo(() => {
    if (!chainId) return undefined;
    const feeAssets = chains?.find((chain) => chain.chainId === chainId)?.feeAssets;
    return feeAssets
      ?.map((a) => {
        const balance = getBalance(chainId, a.denom)?.amount;
        if (!balance) return undefined;
        const gasPrice = (() => {
          const price = a.gasPrice?.average || a.gasPrice?.high || a.gasPrice?.low;
          if (!price) return undefined;
          return new GasPrice(Decimal.fromUserInput(BigNumber(price).toFixed(), 18), a.denom);
        })();
        if (!gasPrice) return undefined;
        const isSwapChain = swapVenues?.map((venue) => venue.chainId).includes(chainId);
        const gasAmount = Math.ceil(
          isSwapChain ? COSMOS_GAS_AMOUNT.SWAP : COSMOS_GAS_AMOUNT.DEFAULT,
        );
        const fee = calculateFee(gasAmount, gasPrice);
        const feeAmount = fee.amount[0].amount;

        return {
          feeAmount,
          denom: a.denom,
          balanceWithFees: BigNumber(balance).minus(feeAmount).toString(),
          isSufficient: balance
            ? BigNumber(balance).isGreaterThanOrEqualTo(BigNumber(feeAmount))
            : false,
        };
      })
      .filter((asset) => asset) as {
        feeAmount: string;
        denom: string;
        balanceWithFees: string;
        isSufficient: boolean;
      }[];
  }, [chainId, chains, getBalance, swapVenues]);

  return feeAssetsState;
};

export const useCosmosFeeAssetSourceAmountValidation = () => {
  const sourceAsset = useAtomValue(sourceAssetAtom);
  const { data: assets } = useAtomValue(skipAssetsAtom);
  const cosmosFees = useCosmosFeeAssetsBalanceValidation(sourceAsset?.chainId);
  const maxAmountTokenMinusFees = useMaxAmountTokenMinusFees();

  const cosmosFeeUsed = cosmosFees?.find((fee) => fee?.isSufficient);
  if (cosmosFeeUsed?.denom !== sourceAsset?.denom) {
    if (!sourceAsset?.amount) return false;
    if (BigNumber(maxAmountTokenMinusFees).isGreaterThanOrEqualTo(BigNumber(sourceAsset?.amount))) {
      return false;
    }
    return true;
  }

  const asset = assets?.find((asset) => asset.denom === cosmosFeeUsed?.denom);
  if (!cosmosFeeUsed?.balanceWithFees) return false;

  const balanceWithFees = convertTokenAmountToHumanReadableAmount(
    cosmosFeeUsed?.balanceWithFees,
    asset?.decimals,
  );
  const isSufficient = sourceAsset?.amount
    ? BigNumber(balanceWithFees).isGreaterThanOrEqualTo(BigNumber(sourceAsset?.amount))
    : false;

  if (isSufficient) return false;
  return true;
};
