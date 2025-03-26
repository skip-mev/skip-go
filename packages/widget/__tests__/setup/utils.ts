import { Page } from "@playwright/test";

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

export async function expectPageLoaded(page: Page) {
  page.setViewportSize({
    height: 800,
    width: 800,
  });
  await page.goto("http://localhost:5173/");
}
