import { expect, Page, test } from "@playwright/test";
import { approveInKeplr } from "./setup/playwright";
import { saveScreenshots, selectAsset } from "./setup/utils";
import { setupBrowserContext } from "./setup/keplr";

test.describe.serial("Widget tests", async () => {
  let page: Page;

  test("Noble USDC -> Cosmoshub ATOM", async () => {
    page = await setupBrowserContext();
    await page.waitForTimeout(100);

    await selectAsset({ page, asset: "USDC", chain: "Noble" });

    await page.waitForTimeout(500);

    await selectAsset({ page, asset: "ATOM", chain: "Cosmos Hub" });

    await page.waitForTimeout(500);

    await saveScreenshots({
      page,
      label: "usdc-on-noble-to-atom-on-cosmoshub",
      expectFn: async () => {
        await expect(page.getByRole("button", { name: "USDC logo USDC" })).toBeVisible();
        await expect(page.getByRole("button", { name: "on Noble" })).toBeVisible();
        await expect(page.getByRole("button", { name: "ATOM logo ATOM" })).toBeVisible();
        await expect(page.getByRole("button", { name: "on Cosmos Hub" })).toBeVisible();
      },
    });

    await page.getByText("Connect Wallet").click();
    await page.getByText("Keplr").click();
    await approveInKeplr();

    const input = page.getByRole("textbox");
    await input.first().fill("0.01");
    await page.getByText("Swap").click();
    await page.getByText("Confirm").click();
    await approveInKeplr();

    await saveScreenshots({
      page,
      label: "noble-usdc-to-atom-cosmoshub-complete",
      expectFn: async () => {
        await expect(page.getByRole("button", { name: /go again/i })).toBeVisible({
          timeout: 600_000,
        });
      },
    });
  });

  test("Cosmoshub ATOM -> Noble USDC", async () => {
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();

    await page.waitForTimeout(500);
    await selectAsset({ page, asset: "ATOM", chain: "Cosmos Hub" });
    await page.waitForTimeout(500);
    await selectAsset({ page, asset: "USDC", chain: "Noble" });

    await saveScreenshots({
      page,
      label: "atom-on-cosmoshub-to-usdc-on-noble",
      expectFn: async () => {
        await expect(page.getByRole("button", { name: "ATOM logo ATOM" })).toBeVisible();
        await expect(page.getByRole("button", { name: "on Cosmos Hub" })).toBeVisible();

        await expect(page.getByRole("button", { name: "USDC logo USDC" })).toBeVisible();
        await expect(page.getByRole("button", { name: "on Noble" })).toBeVisible();
      },
    });

    await page.getByText("Connect Wallet").click();
    await page.getByText("Keplr").click();
    await approveInKeplr();
    const input = page.getByRole("textbox");
    await input.first().fill("0.01");

    await page.getByText("Swap").click();
    await page.getByText("Confirm").click();
    await approveInKeplr();

    await saveScreenshots({
      page,
      label: "atom-cosmoshub-to-usdc-noble-complete",
      expectFn: async () => {
        await expect(page.getByRole("button", { name: /go again/i })).toBeVisible({
          timeout: 600_000,
        });
      },
    });
  });
});
