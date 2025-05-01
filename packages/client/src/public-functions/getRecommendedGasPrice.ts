import { Decimal } from "@cosmjs/math/build/decimal";
import { GasPrice } from "@cosmjs/stargate/build/fee";
import { getFeeInfoForChain } from "src/private-functions/getFeeInfoForChain";
import { BigNumber } from "bignumber.js";

export const getRecommendedGasPrice = async (chainId: string) => {
  const feeInfo = await getFeeInfoForChain(chainId);

  if (!feeInfo || !feeInfo.gasPrice) {
    return undefined;
  }

  let price = feeInfo.gasPrice.average;
  if (price === "") {
    price = feeInfo.gasPrice.high;
  }
  if (price === "") {
    price = feeInfo.gasPrice.low;
  }

  if (!price) return;

  return new GasPrice(
    Decimal.fromUserInput(BigNumber(price).toFixed(), 18),
    feeInfo.denom,
  );
};