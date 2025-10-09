/* eslint-disable no-console */
import { Page } from "@playwright/test";

/**
 * Selects an asset and chain in the widget
 * @param page - Playwright page instance
 * @param asset - Asset symbol (e.g., "USDC", "ATOM")
 * @param chain - Chain name (e.g., "Noble", "Cosmos Hub")
 * @throws Error if asset or chain selection fails
 */
export async function selectAsset({
  page,
  asset,
  chain,
}: {
  page: Page;
  asset: string;
  chain: string;
}) {
  try {
    // Click "Select asset" button
    const selectAssetButton = page.getByText("Select asset").first();
    await selectAssetButton.waitFor({ state: "visible", timeout: 10_000 });
    await selectAssetButton.click();

    // Wait for modal to open
    await page.waitForTimeout(500);

    // Search and select asset
    const assetSearchInput = page.getByPlaceholder("Search for an asset");
    await assetSearchInput.waitFor({ state: "visible", timeout: 10_000 });
    await assetSearchInput.fill(asset);
    await page.waitForTimeout(300);

    const assetOption = page.getByText(asset, { exact: true });
    await assetOption.waitFor({ state: "visible", timeout: 10_000 });
    await assetOption.click();

    // Wait for chain selection to appear
    await page.waitForTimeout(500);

    // Search and select chain
    const chainSearchInput = page.getByPlaceholder("Search networks");
    await chainSearchInput.waitFor({ state: "visible", timeout: 10_000 });
    await chainSearchInput.fill(chain);
    await page.waitForTimeout(300);

    const chainOption = page.getByText(chain, { exact: true });
    await chainOption.waitFor({ state: "visible", timeout: 10_000 });
    await chainOption.click();

    // Wait for modal to close
    await page.waitForTimeout(500);
  } catch (error) {
    console.error(`❌ Failed to select asset ${asset} on chain ${chain}`);
    console.error(`   Error: ${error instanceof Error ? error.message : error}`);
    throw new Error(`Asset selection failed for ${asset} on ${chain}: ${error}`);
  }
}

/**
 * Loads the widget page and waits for it to be ready
 * @param page - Playwright page instance
 * @throws Error if page fails to load
 */
export async function expectPageLoaded(page: Page) {
  try {
    page.setViewportSize({
      height: 800,
      width: 800,
    });
    await page.goto("http://localhost:5173/", {
      waitUntil: "networkidle",
      timeout: 60_000,
    });
    console.log("✅ Page loaded successfully");
  } catch (error) {
    console.error("❌ Failed to load page");
    console.error(`   Error: ${error instanceof Error ? error.message : error}`);
    throw new Error(`Page load failed: ${error}`);
  }
}

/**
 * Saves screenshots for visual regression testing
 * @param label - Descriptive label for the screenshot
 * @param page - Playwright page instance
 * @param expectFn - Async function containing expectations to verify before screenshot
 * @throws Error if expectations fail
 */
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
    // Run expectations first
    await expectFn();

    const screenshotPath = `__tests__/Widget/expected/${label}.png`;

    if (process.env.UPDATE_SCREENSHOTS === "true") {
      console.log(`📸 Updating expected screenshot: ${screenshotPath}`);
      await page.screenshot({
        path: screenshotPath,
        animations: "disabled",
        fullPage: false,
      });
    } else {
      console.log(`✅ Expectations passed for: ${label}`);
      console.log("   (Set UPDATE_SCREENSHOTS=true to update expected screenshots)");
    }
  } catch (err) {
    const screenshotPath = `__tests__/Widget/new/${label}.png`;
    console.error(`❌ Step failed: ${label}`);
    console.error(`   Error: ${err instanceof Error ? err.message : err}`);
    console.error(`   Saving failure screenshot: ${screenshotPath}`);

    try {
      await page.screenshot({
        path: screenshotPath,
        animations: "disabled",
        fullPage: true,
      });
    } catch (screenshotError) {
      console.error(`   Failed to save screenshot: ${screenshotError}`);
    }

    throw err;
  }
}

/**
 * Retry a function with exponential backoff
 * @param fn - Function to retry
 * @param maxRetries - Maximum number of retry attempts
 * @param delayMs - Initial delay in milliseconds (will be doubled with each retry)
 * @returns Result of the function
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000,
): Promise<T> {
  let lastError: Error | unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt < maxRetries) {
        const waitTime = delayMs * Math.pow(2, attempt);
        console.log(`   ⏳ Retry attempt ${attempt + 1}/${maxRetries} after ${waitTime}ms`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }
  }

  throw lastError;
}
