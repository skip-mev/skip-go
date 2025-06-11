import { test, expect } from "@playwright/test";
import {
  limitDecimalsDisplayed,
  convertSecondsToMinutesOrHours,
  removeTrailingZeros,
} from "./number";


test.describe("limitDecimalsDisplayed", () => {
  test("returns empty string for undefined", () => {
    expect(limitDecimalsDisplayed(undefined)).toBe("");
  });

  test("leaves string shorter than limit", () => {
    expect(limitDecimalsDisplayed("123.45", 6)).toBe("123.45");
  });

  test("truncates string with extra decimals", () => {
    expect(limitDecimalsDisplayed("1.1234567", 4)).toBe("1.1234");
  });

  test("truncates number input", () => {
    expect(limitDecimalsDisplayed(1.987654321, 2)).toBe("1.98");
  });
});

test.describe("convertSecondsToMinutesOrHours", () => {
  test("formats seconds under a minute", () => {
    expect(convertSecondsToMinutesOrHours(30)).toBe("30 secs");
  });

  test("formats seconds under an hour", () => {
    expect(convertSecondsToMinutesOrHours(90)).toBe("2 mins");
  });

  test("formats seconds to hours", () => {
    expect(convertSecondsToMinutesOrHours(3600)).toBe("1 hr");
  });

  test("returns undefined for falsy input", () => {
    expect(convertSecondsToMinutesOrHours()).toBeUndefined();
  });
});

test.describe("removeTrailingZeros", () => {
  test("handles undefined input", () => {
    expect(removeTrailingZeros(undefined)).toBe("");
  });

  test("removes trailing zeros from decimal string", () => {
    expect(removeTrailingZeros("1.2300")).toBe("1.23");
  });

  test("removes trailing zeros leaving integer", () => {
    expect(removeTrailingZeros("1.000")).toBe("1");
  });

  test("returns original integer string", () => {
    expect(removeTrailingZeros(100)).toBe("100");
  });
});
