import { Decimal } from "@cosmjs/math/build/decimal";
import { GasPrice } from "@cosmjs/stargate/build/fee";
import { getFeeInfoForChain } from "src/public-functions/getFeeInfoForChain";
import { BigNumber } from "bignumber.js";
import { SkipApiOptions } from "src/utils/fetchClient";

export type getRecommendedGasPriceProps = {
  chainId: string;
} & SkipApiOptions;

export const getRecommendedGasPrice = async (props: getRecommendedGasPriceProps) => {
  const feeInfo = await getFeeInfoForChain(props);

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

  return new GasPrice(Decimal.fromUserInput(BigNumber(price).toFixed(), 18), feeInfo.denom);
};
