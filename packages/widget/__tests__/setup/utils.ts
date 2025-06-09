/* eslint-disable */
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

export async function saveScreenshots({
  label,
  page,
  expectFn,
}: {
  label: string;
  page: Page;
  expectFn: () => Promise<void>;
}) {
  try {
    await expectFn();
    const screenshotPath = `__tests__/Widget/expected/${label}.png`;
    if (process.env.UPDATE_SCREENSHOTS === "true") {
      console.info(`✅ Updating expected screenshot: ${screenshotPath}`);
      await page.screenshot({ path: screenshotPath, animations: "disabled" });
    } else {
      console.info("✅ Test passed. Expected screenshot not updated");
    }
  } catch (err) {
    const screenshotPath = `__tests__/Widget/new/${label}.png`;
    console.error(`❌ Step failed: ${label}, saving screenshot: ${screenshotPath}`);
    await page.screenshot({ path: screenshotPath, animations: "disabled" });
    throw err;
  }
}
