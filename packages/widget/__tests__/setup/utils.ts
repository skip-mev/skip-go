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
  timeoutMs = 300_000,
}: {
  label: string;
  page: Page;
  expectFn: () => Promise<void>;
  timeoutMs?: number;
}) {
  const screenshotBase = `__tests__/Widget`;
  const screenshotExpected = `${screenshotBase}/expected/${label}.png`;
  const screenshotFailed = `${screenshotBase}/new/${label}.png`;

  const timeoutPromise = new Promise<void>((_, reject) =>
    setTimeout(() => reject(new Error(`Custom timeout of ${timeoutMs}ms reached`)), timeoutMs)
  );

  try {
    await Promise.race([expectFn(), timeoutPromise]);

    if (process.env.UPDATE_EXPECTED === "true") {
      console.error(`✅ Updating expected screenshot: ${screenshotExpected}`);
      await page.screenshot({ path: screenshotExpected, animations: "disabled" });
    } else {
      console.log(`✅ Test passed. Expected screenshot not updated`);
    }
  } catch (err) {
    console.error(`❌ Step failed: ${label}, saving screenshot: ${screenshotFailed}`);
    try {
      await page.screenshot({ path: screenshotFailed });
    } catch (screenshotErr) {
      console.error(`⚠️ Failed to take failure screenshot:`, screenshotErr);
    }
    throw err;
  }
}