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
  } catch (err) {
    return "0";
  }
}

export function parseAmountWei(amount?: string, decimals = 6) {
  if (!amount) return "0";
  try {
    return formatUnits(BigInt(amount.replace(/,/g, "")), decimals ?? 6);
  } catch (err) {
    return "0";
  }
}
