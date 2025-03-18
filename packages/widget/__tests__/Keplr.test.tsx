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

    // const localHostPage = getBrowser()
    //   .contexts()[0]
    //   ?.pages()
    //   .find((page) => page.url().includes("localhost"));

    // await page.waitForTimeout(5000);

    // await page.screenshot({
    //   path: "__tests__/Widget/connect-keplr.png",
    // });

    // await fillAmount(page, "5");

    // await e2eTest(page);
  });
});
