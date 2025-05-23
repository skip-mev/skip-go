import { test, expect } from "@playwright/test";
import { getMobileDateFormat } from "./date";

test.describe("getMobileDateFormat", () => {
  test("formats date in UTC with zero padding", () => {
    const date = new Date("2024-03-02T09:05:00Z");
    const formatted = getMobileDateFormat(date, "UTC");
    expect(formatted).toBe("09:05 UTC 03/02/24");
  });

  test("formats date in Asia/Jakarta timezone correctly", () => {
    const date = new Date("2024-03-02T09:05:00Z");
    const formatted = getMobileDateFormat(date, "Asia/Jakarta");
    expect(formatted).toBe("16:05 GMT+7 03/02/24");
  });

  test("formats date in local timezone if timezone is not provided", () => {
    const date = new Date("2024-03-02T09:05:00Z");
    const formatted = getMobileDateFormat(date, ""); // Local time fallback
    expect(formatted).toMatch(/\d{2}:\d{2} .+ \d{2}\/\d{2}\/\d{2}/);
  });
});
