import { test } from "./setup/fixtures";
import { connectSource, expectPageLoaded, initKeplr, selectAsset } from "./setup/utils";

test.describe("Widget tests", () => {
  test("Noble USDC -> Injective INJ", async ({ page }) => {
    await initKeplr();
    await expectPageLoaded(page);

    await selectAsset({ page, asset: "USDC", chain: "Noble" });
    await selectAsset({ page, asset: "INJ", chain: "Injective" });

    await connectSource(page);

    await page.waitForTimeout(5_000);

    await page.screenshot({
      path: "__tests__/Widget/connect-keplr.png",
    });

    // await fillAmount(page, "5");

    // await e2eTest(page);
  });
});
