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

export function limitDecimalsDisplayed(input: string | number) {
  const DECIMAL_PLACES_TO_DISPLAY = 6;

  if (typeof input === "string") {
    const [integer, decimal] = input.split(".");

    if (decimal === undefined || decimal.length <= DECIMAL_PLACES_TO_DISPLAY) {
      return input;
    }

    return integer + "." + decimal.slice(0, DECIMAL_PLACES_TO_DISPLAY);
  }

  if (isNaN(input)) return "";

  const decimalScalingFactor = Math.pow(10, DECIMAL_PLACES_TO_DISPLAY);

  const flooredAndLimitedDecimalPlacesNumber =
    Math.floor((input) * decimalScalingFactor) / decimalScalingFactor;

  return flooredAndLimitedDecimalPlacesNumber.toString();
}

export function calculatePercentageChange(
  numberA: number | string,
  numberB: number | string,
  absoluteValue?: boolean
) {
  const bigNumberA = BigNumber(numberA);
  const bigNumberB = BigNumber(numberB);

  const percentageDifference = bigNumberB
    .minus(bigNumberA)
    .dividedBy(bigNumberA)
    .multipliedBy(100);

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
    return `${Math.round(seconds / 60)} ${pluralize(
      "min",
      Math.round(seconds / 60)
    )}`;
  } else {
    return `${Math.round(seconds / 3600)} ${pluralize(
      "hr",
      Math.round(seconds / 3600)
    )}`;
  }
};
