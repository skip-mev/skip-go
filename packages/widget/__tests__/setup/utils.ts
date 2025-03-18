import { Page } from "@playwright/test";

import { init, watchKeplrPopupApproveWindow } from "./playwright";

export async function selectAsset({
  page,
  asset,
  chain,
}: {
  page: Page;
  asset: string;
  chain: string;
}) {
  const selectAsset = page.getByText("Select asset").first();
  await selectAsset.click();
  await page.getByPlaceholder("Search for an asset").fill(asset);
  await page
    .getByText(asset, {
      exact: true,
    })
    .click();
  await page.getByPlaceholder("Search networks").fill(chain);
  await page
    .getByText(chain, {
      exact: true,
    })
    .click();
}
export async function initKeplr() {
  await init();
  watchKeplrPopupApproveWindow();
}
export async function expectPageLoaded(page: Page) {
  page.setViewportSize({
    height: 800,
    width: 800,
  });
  await page.goto(process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:5173/");
}
