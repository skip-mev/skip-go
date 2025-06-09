import { BigNumber } from "bignumber.js";
import pluralize from "pluralize";
import { DEFAULT_DECIMAL_PLACES } from "@/constants/widget";

export function formatNumberWithCommas(str: string | number) {
  const parts = str.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

export function formatNumberWithoutCommas(str: string | number) {
  return str.toString().replace(/,/g, "");
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

/**
 * Determines if a number needs size reduction based on its length
 * Returns true if the number has 14 or more characters (including decimal point)
 */
export function shouldReduceFontSize(value: string | number | undefined): boolean {
  if (!value) return false;
  
  // Convert to string and remove commas
  const valueWithoutCommas = value.toString().replace(/,/g, "");
  
  // Return true if character count is 14 or more
  return valueWithoutCommas.length >= 14;
}

type FormatAmountOptions = {
  showLessThanSign?: boolean;
  decimals?: number;
  /** If true, large numbers will be abbreviated to K/M notation */
  abbreviate?: boolean;
};

export const formatDisplayAmount = (
  input: number | string | undefined,
  options: FormatAmountOptions = {}
): string => {
  const {
    showLessThanSign = true,
    decimals = DEFAULT_DECIMAL_PLACES,
    abbreviate = true,
  } = options;

  if (input === undefined) {
    return '';
  }

  let num: number;
  if (typeof input === 'string') {
    num = Number(input);
    if (isNaN(num)) {
      return input;
    }
  } else {
    num = input;
  }

  const abs = Math.abs(num);
  const THRESHOLD = 10 ** -decimals;

  if (abs > 0 && abs < THRESHOLD) {
    const thresholdStr = THRESHOLD.toFixed(decimals);
    return showLessThanSign ? `< ${thresholdStr}` : thresholdStr;
  }

  if (abbreviate) {
    const scales = [
      { value: 1e6, symbol: 'M' },
      { value: 1e3, symbol: 'K' },
    ];

    for (const { value, symbol } of scales) {
      if (abs >= value) {
        const formatted = (num / value)
          .toFixed(2)
          .replace(/\.?0+$/, '');
        return `${formatted}${symbol}`;
      }
    }
  }

  return num
    .toFixed(decimals)
    .replace(/\.?0+$/, '');
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
