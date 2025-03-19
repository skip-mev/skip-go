import { test } from "./setup/fixtures";
import { approveInKeplr, getBrowser } from "./setup/playwright";
import { expectPageLoaded, initKeplr, selectAsset } from "./setup/utils";

test.describe("Widget tests", () => {
  test("Noble USDC -> Injective INJ", async ({ page }) => {
    await initKeplr();
    await expectPageLoaded(page);

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
    await input.first().blur();

    await page.getByText("Swap").click();

    await page.getByText("Confirm").click();

    await approveInKeplr();
  });
});
