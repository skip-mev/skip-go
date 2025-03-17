import { test } from "./setup/fixtures";
import {
  connectDestination,
  connectSource,
  e2eTest,
  expectPageLoaded,
  fillAmount,
  initKeplr,
  selectAsset,
} from "./setup/utils";
// import { page } from "@vitest/browser/context";

test("Noble USDC -> Injective INJ", async ({ page }) => {
  await initKeplr();
  await expectPageLoaded(page);

  await selectAsset({ page, asset: "USDC", chain: "Noble" });
  await selectAsset({ page, asset: "INJ", chain: "Injective" });

  await page.waitForTimeout(70000000);

  await connectSource(page);

  // await fillAmount(page, "5");

  // await connectDestination(page);

  // await e2eTest(page);
});
