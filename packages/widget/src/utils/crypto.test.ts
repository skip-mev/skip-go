import { test, expect } from "@playwright/test";
import {
  convertHumanReadableAmountToCryptoAmount,
  convertTokenAmountToHumanReadableAmount,
  getTruncatedAddress,
  hasAmountChanged,
} from "./crypto";

test.describe("convertHumanReadableAmountToCryptoAmount", () => {
  test("converts string amount with default decimals", () => {
    expect(convertHumanReadableAmountToCryptoAmount("1.234567")).toBe("1234567");
  });

  test("converts number input", () => {
    expect(convertHumanReadableAmountToCryptoAmount(0.5)).toBe("500000");
  });

  test("honors custom decimal places", () => {
    expect(convertHumanReadableAmountToCryptoAmount("1.23", 2)).toBe("123");
  });
});

test.describe("convertTokenAmountToHumanReadableAmount", () => {
  test("converts token amount using decimals", () => {
    expect(convertTokenAmountToHumanReadableAmount("1234567", 6)).toBe("1.234567");
  });

  test("retains trailing zeros when no decimals present", () => {
    expect(convertTokenAmountToHumanReadableAmount("1000000", 6)).toBe("1.000000");
  });

  test("uses provided decimal places", () => {
    expect(convertTokenAmountToHumanReadableAmount("1234", 2)).toBe("12.34");
  });
});

test.describe("getTruncatedAddress", () => {
  test("returns empty string when address is undefined", () => {
    expect(getTruncatedAddress()).toBe("");
  });

  test("truncates address normally", () => {
    expect(getTruncatedAddress("1234567890abcdef")).toBe("123456789…bcdef");
  });

  test("truncates address extra short", () => {
    expect(getTruncatedAddress("1234567890abcdef", true)).toBe("123456…def");
  });
});

test.describe("hasAmountChanged", () => {
  test("detects no change after rounding", () => {
    expect(hasAmountChanged("1.2345678", "1.2345671", 6)).toBe(false);
  });

  test("detects change with higher precision", () => {
    expect(hasAmountChanged("1.2345678", "1.2345671", 7)).toBe(true);
  });

  test("returns false for equal values", () => {
    expect(hasAmountChanged("0.123456", "0.123456")).toBe(false);
  });

  test("detects change with default decimals", () => {
    expect(hasAmountChanged("0.123456", "0.123457")).toBe(true);
  });
});
