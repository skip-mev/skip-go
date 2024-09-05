import { BigNumber } from "bignumber.js";
import { formatUnits } from "viem";

export function formatNumberWithCommas(str: string | number) {
  const parts = str.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

export function formatNumberWithoutCommas(str: string | number) {
  return str.toString().replace(/,/g, "");
}

export function getAmountWei(amount?: string, decimals = 6) {
  if (!amount || !amount) return "0";
  try {
    return new BigNumber(formatNumberWithoutCommas(amount)).shiftedBy(decimals ?? 6).toFixed(0);
  } catch (_err) {
    return "0";
  }
}

export function parseAmountWei(amount?: string, decimals = 6) {
  if (!amount) return "0";
  try {
    return formatUnits(BigInt(amount.replace(/,/g, "")), decimals ?? 6);
  } catch (_err) {
    return "0";
  }
}

export function calculatePercentageDifference (numberA: number | string, numberB: number | string, absoluteValue?: boolean) {
  const bigNumberA = BigNumber(numberA);
  const bigNumberB = BigNumber(numberB);

  const percentageDifference = ((bigNumberB.minus(bigNumberA)).dividedBy(bigNumberA)).multipliedBy(100);

  if (absoluteValue) {
    return percentageDifference.absoluteValue().toFixed(0);
  }

  return percentageDifference.toFixed(0);
}