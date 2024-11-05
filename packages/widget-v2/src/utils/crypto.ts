import { DEFAULT_DECIMAL_PLACES } from "@/constants/widget";
import { BigNumber } from "bignumber.js";

export const convertHumanReadableAmountToCryptoAmount = (
  humanReadableAmount: number | string,
  decimals = DEFAULT_DECIMAL_PLACES
): string => {
  if (typeof humanReadableAmount === "string") {
    humanReadableAmount = parseFloat(humanReadableAmount);
  }
  const cryptoAmount = new BigNumber(humanReadableAmount).shiftedBy(decimals);
  return cryptoAmount.toFixed(0);
};

export const convertTokenAmountToHumanReadableAmount = (
  tokenAmount: number | string,
  decimals = DEFAULT_DECIMAL_PLACES
): string => {
  if (tokenAmount === "") return "";
  if (typeof tokenAmount === "string") {
    tokenAmount = parseFloat(tokenAmount);
  }
  const humanReadableAmount = new BigNumber(tokenAmount).shiftedBy(-decimals);
  return humanReadableAmount.toFixed(decimals).replace(/(\.\d*?[1-9])(?:0+|\.0*)$/, "$1");
};

export const getTruncatedAddress = (address?: string): string => {
  if (!address) return "";
  return `${address.slice(
    0,
    9
  )}…${address.slice(-5)}`;
};
