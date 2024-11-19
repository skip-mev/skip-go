import { skipAssetsAtom, skipChainsAtom } from "@/state/skipClient";
import { convertTokenAmountToHumanReadableAmount } from "@/utils/crypto";
import { Decimal } from "@cosmjs/math";
import { GasPrice, calculateFee } from "@cosmjs/stargate";
import { useAtom } from "jotai";
import { useGetBalance } from "./useGetBalance";
import { sourceAssetAtom } from "@/state/swapPage";
import { BigNumber } from "bignumber.js";
import { COSMOS_GAS_FEE } from "@/constants/widget";
import { useMemo } from "react";
import { useMaxAmountTokenMinusFees } from "@/pages/SwapPage/useSetMaxAmount";

/** feeAmount is in crypto amount */
export const useCosmosFeeAssetsBalanceValidation = (chainId?: string) => {
  const getBalance = useGetBalance();
  const [{ data: chains }] = useAtom(skipChainsAtom);

  const feeAssetsState = useMemo(() => {
    if (!chainId) return undefined;
    const feeAssets = chains?.find(chain => chain.chainID === chainId)?.feeAssets;
    return feeAssets?.map(a => {
      const balance = getBalance(chainId, a.denom)?.amount;
      if (!balance) return undefined;
      const gasPrice = (() => {
        if (!a.gasPrice) return undefined;
        let price = a.gasPrice.average;
        if (price === '') {
          price = a.gasPrice.high;
        }
        if (price === '') {
          price = a.gasPrice.low;
        }
        return new GasPrice(Decimal.fromUserInput(price, 18), a.denom);
      })();
      if (!gasPrice) return undefined;
      const fee = calculateFee(Math.ceil(parseFloat(String(COSMOS_GAS_FEE))), gasPrice);
      const feeAmount = fee.amount[0].amount

      return {
        feeAmount,
        denom: a.denom,
        balanceWithFees: BigNumber(balance).minus(feeAmount).toString(),
        isSufficient: balance ? BigNumber(balance).isGreaterThanOrEqualTo(BigNumber(feeAmount)) : false,
      }
    }).filter((asset) => asset) as { feeAmount: string, denom: string, balanceWithFees: string, isSufficient: boolean }[];
  }, [chainId, chains, getBalance]);

  return feeAssetsState;
}

export const useCosmosFeeAssetSourceAmountValidation = () => {
  const [sourceAsset] = useAtom(sourceAssetAtom);
  const [{ data: assets }] = useAtom(skipAssetsAtom);
  const cosmosFees = useCosmosFeeAssetsBalanceValidation(sourceAsset?.chainID);
  const maxAmountTokenMinusFees = useMaxAmountTokenMinusFees();

  const cosmosFeeUsed = cosmosFees?.find(fee => fee?.isSufficient);
  if (cosmosFeeUsed?.denom !== sourceAsset?.denom) {
    if (!sourceAsset?.amount) return false;
    if (BigNumber(maxAmountTokenMinusFees).isGreaterThanOrEqualTo(BigNumber(sourceAsset?.amount))) {
      return false;
    }
    return true;
  }

  const asset = assets?.find((asset) => asset.denom === cosmosFeeUsed?.denom);
  if (!cosmosFeeUsed?.balanceWithFees) return false;

  const balanceWithFees = convertTokenAmountToHumanReadableAmount(cosmosFeeUsed?.balanceWithFees, asset?.decimals);
  const isSufficient = sourceAsset?.amount ? BigNumber(balanceWithFees).isGreaterThanOrEqualTo(BigNumber(sourceAsset?.amount)) : false;

  if (isSufficient) return false;
  return true;
}
