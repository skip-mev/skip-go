import { DEFAULT_DECIMAL_PLACES } from "@/constants/widget";
import { BigNumber } from "bignumber.js";
import pluralize from "pluralize";

export function formatNumberWithCommas(str: string | number) {
  const parts = str.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

export function formatNumberWithoutCommas(str: string | number) {
  return str.toString().replace(/,/g, "");
}

export const removeTrailingZeros = (input: string | undefined) => {
  if (input === "0") return input;
  return input?.replace(/0+$/, "").replace(/\.$/, "");
};

export function limitDecimalsDisplayed(
  input: string | number | undefined,
  decimalPlaces = DEFAULT_DECIMAL_PLACES,
) {
  if (input === undefined) return "";

  if (typeof input === "string") {
    const [integer, decimal] = input.split(".");

    if (decimal === undefined || decimal.length <= decimalPlaces) {
      return input;
    }

    return integer + "." + decimal.slice(0, decimalPlaces);
  }

  if (isNaN(input)) return "";

  const decimalScalingFactor = Math.pow(10, decimalPlaces);

  const flooredAndLimitedDecimalPlacesNumber =
    Math.floor(input * decimalScalingFactor) / decimalScalingFactor;

  return flooredAndLimitedDecimalPlacesNumber.toString();
}

export function calculatePercentageChange(
  numberA: number | string,
  numberB: number | string,
  absoluteValue?: boolean,
) {
  const bigNumberA = BigNumber(numberA);
  const bigNumberB = BigNumber(numberB);

  const percentageDifference = bigNumberB.minus(bigNumberA).dividedBy(bigNumberA).multipliedBy(100);

  if (absoluteValue) {
    return percentageDifference.absoluteValue().toFixed(0);
  }

  return percentageDifference.toFixed(0);
}

export const convertSecondsToMinutesOrHours = (seconds?: number) => {
  if (!seconds) {
    return;
  }
  if (seconds < 60) {
    return `${seconds} ${pluralize("sec", seconds)}`;
  } else if (seconds < 3600) {
    return `${Math.round(seconds / 60)} ${pluralize("min", Math.round(seconds / 60))}`;
  } else {
    return `${Math.round(seconds / 3600)} ${pluralize("hr", Math.round(seconds / 3600))}`;
  }
};
