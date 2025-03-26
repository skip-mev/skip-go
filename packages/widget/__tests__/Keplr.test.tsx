import { Page, test } from "@playwright/test";
import { approveInKeplr } from "./setup/playwright";
import { selectAsset } from "./setup/utils";
import { setupBrowserContext } from "./setup/keplr";

test.describe.serial("Widget tests", async () => {
  let page: Page;

  test("Noble USDC -> Injective INJ", async () => {
    page = await setupBrowserContext();
    await page.waitForTimeout(100);
    await page.screenshot({
      animations: "disabled",
      path: "__tests__/Widget/default-widget.png",
    });

    await selectAsset({ page, asset: "USDC", chain: "Noble" });

    await page.waitForTimeout(100);
    await page.screenshot({
      animations: "disabled",
      path: "__tests__/Widget/usdc-noble-selected.png",
    });

    await selectAsset({ page, asset: "INJ", chain: "Injective" });

    await page.waitForTimeout(100);
    await page.screenshot({
      animations: "disabled",
      path: "__tests__/Widget/both-assets-selected.png",
    });

    await page.getByText("Connect Wallet").click();
    await page.getByText("Keplr").click();

    await approveInKeplr();

    await page.waitForTimeout(100);
    await page.screenshot({
      path: "__tests__/Widget/connect-keplr.png",
    });

    const input = page.getByRole("textbox");
    await input.first().fill("1");
    await page.getByText("Swap").click();
    await page.getByText("Confirm").click();
    await approveInKeplr();
    await page.getByText(/go again/i).click({ timeout: 300_000 });
  });

  test("Injective INJ -> Cosmoshub ATOM", async () => {
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();
    await selectAsset({ page, asset: "INJ", chain: "Injective" });
    await selectAsset({ page, asset: "ATOM", chain: "Cosmos Hub" });
    await page.getByText("Connect Wallet").click();
    await page.getByText("Keplr").click();
    await page.getByText(/Max/i).click();
    await page.getByText("Swap").click();
    await page.getByText("Confirm").click();
    await approveInKeplr();
    await page.getByText(/go again/i).click({ timeout: 300_000 });
  });

  test("Cosmoshub ATOM -> Noble USDC", async () => {
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();
    await selectAsset({ page, asset: "ATOM", chain: "Cosmos Hub" });
    await selectAsset({ page, asset: "USDC", chain: "Noble" });
    await page.getByText("Connect Wallet").click();
    await page.getByText("Keplr").click();
    await page.getByText(/Max/i).click();
    await page.getByText("Swap").click();
    await page.getByText("Confirm").click();
    await approveInKeplr();
    await page.getByText(/go again/i).click({ timeout: 300_000 });
  });
});
