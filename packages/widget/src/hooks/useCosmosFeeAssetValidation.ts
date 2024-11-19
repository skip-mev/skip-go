import { skipChainsAtom } from "@/state/skipClient";
import { convertTokenAmountToHumanReadableAmount } from "@/utils/crypto";
import { Decimal } from "@cosmjs/math";
import { GasPrice, calculateFee } from "@cosmjs/stargate";
import { useAtom } from "jotai";
import { useGetBalance } from "./useGetBalance";
import { useGetAssetDetails } from "./useGetAssetDetails";
import { sourceAssetAtom } from "@/state/swapPage";
import { BigNumber } from "bignumber.js";
import { COSMOS_GAS_FEE } from "@/constants/widget";

export const useCosmosFeeAssetValidation = () => {
  const [sourceAsset] = useAtom(sourceAssetAtom);
  const [{ data: chains }] = useAtom(skipChainsAtom);
  const getBalance = useGetBalance();
  const assetDetail = useGetAssetDetails({
    assetDenom: sourceAsset?.denom,
    amount: sourceAsset?.amount,
    chainId: sourceAsset?.chainID,
  });
  const chain = chains?.find(chain => chain.chainID === sourceAsset?.chainID);
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
