import { DEFAULT_DECIMAL_PLACES } from "@/constants/widget";
import { BigNumber } from "bignumber.js";

export const convertHumanReadableAmountToCryptoAmount = (
  humanReadableAmount: number | string,
  decimals = DEFAULT_DECIMAL_PLACES,
): string => {
  const cryptoAmount = new BigNumber(humanReadableAmount).shiftedBy(decimals);
  return cryptoAmount.toFixed(0);
};

export const convertTokenAmountToHumanReadableAmount = (
  tokenAmount: number | string,
  decimals = DEFAULT_DECIMAL_PLACES,
): string => {
  const humanReadableAmount = new BigNumber(tokenAmount).shiftedBy(-decimals);
  return humanReadableAmount
    .toFixed(decimals, BigNumber.ROUND_DOWN)
    .replace(/(\.\d*?[1-9])(?:0+|\.0*)$/, "$1");
};

export const getTruncatedAddress = (address?: string, extraShort?: boolean): string => {
  if (!address) return "";
  const minLength = extraShort ? 10 : 15;
  if (address.length <= minLength) return address;

  if (extraShort) {
    return `${address.slice(0, 6)}…${address.slice(-3)}`;
  }
  return `${address.slice(0, 9)}…${address.slice(-5)}`;
};

export const hasAmountChanged = (
  newAmount: string,
  oldAmount: string,
  decimals: number = DEFAULT_DECIMAL_PLACES,
) => {
  const newAmountBN = new BigNumber(newAmount).decimalPlaces(decimals, BigNumber.ROUND_DOWN);
  const oldAmountBN = new BigNumber(oldAmount).decimalPlaces(decimals, BigNumber.ROUND_DOWN);
  return !newAmountBN.eq(oldAmountBN);
};
