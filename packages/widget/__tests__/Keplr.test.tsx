/* eslint-disable no-console */
import { expect, Page, test } from "@playwright/test";
import { approveInKeplr } from "./setup/playwright";
import { saveScreenshots, selectAsset } from "./setup/utils";
import { setupBrowserContext } from "./setup/keplr";

/**
 * Helper function to handle optional UI elements before confirmation
 * Checks for and handles:
 * - "Set intermediary address" button
 * - Wallet approval popups
 */
async function handleOptionalUIElements(page: Page) {
  console.log("🔍 Checking for optional UI elements...");

  // Check for "Set intermediary address" button
  const setIntermediaryButton = page.getByRole("button", {
    name: /set intermediary address/i,
  });
  const isSetIntermediaryVisible = await setIntermediaryButton.isVisible().catch(() => false);

  if (isSetIntermediaryVisible) {
    console.log("   ℹ️ 'Set intermediary address' button found, clicking...");
    await setIntermediaryButton.click();
    await page.waitForTimeout(500);
  } else {
    console.log("   ○ No 'Set intermediary address' button found");
  }

  // Check for any wallet approval popup that might have appeared
  const approvalResult = await approveInKeplr();
  if (approvalResult === "approved") {
    console.log("   ℹ️ Wallet popup approved");
    await page.waitForTimeout(500);
  } else {
    console.log("   ○ No wallet popup found");
  }
}

// Run before swaps: the Keplr helper uses a fixed CDP port.
test("Cosmos approval requests once while pending and after rejection", async () => {
  test.setTimeout(90_000);
  const page = await setupBrowserContext();
  try {
    await selectAsset({ page, asset: "ATOM", chain: "Cosmos Hub" });
    await page.getByText("Connect Wallet", { exact: true }).click();
    await page.getByText("Keplr", { exact: true }).click();
    await approveInKeplr();
    await expect(page.getByText("Connect Wallet", { exact: true })).toBeHidden();

    // Count approval attempts even when Keplr coalesces them into one popup.
    const approvals = await page.evaluateHandle(() => {
      const state = { count: 0 };
      const keplr = window.keplr;
      if (!keplr) throw new Error("Keplr extension is not available");
      const suggestChain = keplr.experimentalSuggestChain.bind(keplr);
      keplr.experimentalSuggestChain = async (chainInfo) => {
        if (chainInfo.chainId === "bbn-1") state.count++;
        return suggestChain(chainInfo);
      };
      return state;
    });
    const popupOpened = page.context().waitForEvent("page");
    await page.evaluate(async () => {
      const modulePath = "/src/state/swapPage.ts";
      const { setAsset } = await import(modulePath);
      setAsset({ type: "source", chainId: "bbn-1", denom: "ubbn" });
    });
    const popup = await popupOpened;
    const reject = popup.getByRole("button", { name: /reject/i });
    await expect(reject).toBeVisible();
    await expect.poll(() => approvals.evaluate((state) => state.count)).toBe(1);

    const amount = page.getByRole("textbox").first();
    await amount.fill("1");
    await amount.pressSequentially("23", { delay: 100 });
    await page.waitForTimeout(500);
    expect(await approvals.evaluate((state) => state.count)).toBe(1);
    await expect(page.getByText("Approving connection...", { exact: true })).toBeVisible();

    await reject.click();
    await expect(page.getByText("Connect Wallet", { exact: true })).toBeVisible();
    await amount.fill("4");
    await amount.pressSequentially("56", { delay: 100 });
    await page.waitForTimeout(500);
    expect(await approvals.evaluate((state) => state.count)).toBe(1);
    await expect(page.getByText("Connect Wallet", { exact: true })).toBeVisible();
  } finally {
    await page.context().close();
  }
});

/**
 * E2E tests for the Skip Go Widget with Keplr wallet integration
 * These tests verify cross-chain swap functionality using real blockchain interactions
 */
test.describe.serial("Widget tests", async () => {
  let page: Page;

  /**
   * Capture screenshots on test failure for debugging
   */
  test.afterEach(async ({ page: _page }, testInfo) => {
    if (testInfo.status === "failed" && page) {
      const screenshotPath = `__tests__/test-results/screenshots/${testInfo.title.replace(/\s+/g, "-")}-failure.png`;
      await page.screenshot({
        path: screenshotPath,
        fullPage: true,
      });
      console.error(`❌ Test failed: ${testInfo.title}`);
      console.error(`   Screenshot saved to: ${screenshotPath}`);

      // Log console errors from the browser
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          console.error(`   Browser error: ${msg.text()}`);
        }
      });
    }
  });

  /**
   * Test Case: Cross-chain swap from Noble USDC to Cosmos Hub ATOM
   * This test verifies the complete swap flow including:
   * 1. Asset selection
   * 2. Wallet connection
   * 3. Transaction approval
   * 4. Cross-chain execution
   */
  test("Noble USDC -> Cosmoshub ATOM", async () => {
    console.log("🚀 Starting test: Noble USDC -> Cosmoshub ATOM");

    // Setup browser context with Keplr extension
    page = await setupBrowserContext();
    await page.waitForLoadState("networkidle");

    // Step 1: Select source asset (USDC on Noble)
    console.log("📝 Step 1: Selecting source asset USDC on Noble");
    await selectAsset({ page, asset: "USDC", chain: "Noble" });
    await page.waitForLoadState("networkidle");

    // Step 2: Select destination asset (ATOM on Cosmos Hub)
    console.log("📝 Step 2: Selecting destination asset ATOM on Cosmos Hub");
    await selectAsset({ page, asset: "ATOM", chain: "Cosmos Hub" });
    await page.waitForLoadState("networkidle");

    // Verify asset selection
    console.log("✅ Step 3: Verifying asset selection");
    await saveScreenshots({
      page,
      label: "usdc-on-noble-to-atom-on-cosmoshub",
      expectFn: async () => {
        await expect(
          page.getByRole("button", { name: "USDC logo USDC" }),
          "Source asset USDC should be visible",
        ).toBeVisible({ timeout: 10_000 });

        await expect(
          page.getByRole("button", { name: "on Noble" }),
          "Source chain Noble should be visible",
        ).toBeVisible({ timeout: 10_000 });

        await expect(
          page.getByRole("button", { name: "ATOM logo ATOM" }),
          "Destination asset ATOM should be visible",
        ).toBeVisible({ timeout: 10_000 });

        await expect(
          page.getByRole("button", { name: "on Cosmos Hub" }),
          "Destination chain Cosmos Hub should be visible",
        ).toBeVisible({ timeout: 10_000 });
      },
    });

    // Step 4: Connect wallet (if not already connected)
    console.log("🔗 Step 4: Checking wallet connection");
    const connectWalletButton = page.getByText("Connect Wallet");
    const isConnectButtonVisible = await connectWalletButton.isVisible().catch(() => false);

    if (isConnectButtonVisible) {
      console.log("   ℹ️ Wallet not connected, connecting now...");
      await connectWalletButton.click();
      await page.waitForTimeout(500);
      await page.getByText("Keplr").click();
      await approveInKeplr();
      console.log("✅ Wallet connected successfully");
    } else {
      console.log("✅ Wallet already connected, skipping connection step");
    }

    // Step 5: Enter swap amount
    console.log("💰 Step 5: Entering swap amount");
    const input = page.getByRole("textbox");
    await input.first().fill("0.01");
    await page.waitForTimeout(500);

    // Step 6: Initiate swap
    console.log("🔄 Step 6: Initiating swap");
    await page.getByText("Swap").click();
    await page.waitForTimeout(1000);

    // Step 6.5: Handle optional UI elements (intermediary address, wallet popups)
    await handleOptionalUIElements(page);

    // Step 7: Confirm transaction
    console.log("✍️ Step 7: Confirming transaction");
    await page.getByText("Confirm").click();
    await approveInKeplr();
    console.log("✅ Transaction approved in Keplr");

    // Step 8: Wait for transaction completion
    console.log("⏳ Step 8: Waiting for transaction to complete (may take up to 10 minutes)");
    await saveScreenshots({
      page,
      label: "noble-usdc-to-atom-cosmoshub-complete",
      expectFn: async () => {
        await expect(
          page.getByRole("button", { name: /go again/i }),
          "Transaction should complete and show 'Go Again' button",
        ).toBeVisible({
          timeout: 600_000, // 10 minutes for cross-chain transaction
        });
      },
    });

    console.log("✅ Test completed successfully: Noble USDC -> Cosmoshub ATOM");
  });

  /**
   * Test Case: Cross-chain swap from Cosmos Hub ATOM to Noble USDC
   * This test verifies the reverse swap flow from the first test
   * It also tests state cleanup between tests
   */
  test("Cosmoshub ATOM -> Noble USDC", async () => {
    console.log("🚀 Starting test: Cosmoshub ATOM -> Noble USDC");

    // Clear state from previous test
    console.log("🧹 Cleaning up previous test state");
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();
    await page.waitForLoadState("networkidle");

    // Step 1: Select source asset (ATOM on Cosmos Hub)
    console.log("📝 Step 1: Selecting source asset ATOM on Cosmos Hub");
    await selectAsset({ page, asset: "ATOM", chain: "Cosmos Hub" });
    await page.waitForLoadState("networkidle");

    // Step 2: Select destination asset (USDC on Noble)
    console.log("📝 Step 2: Selecting destination asset USDC on Noble");
    await selectAsset({ page, asset: "USDC", chain: "Noble" });
    await page.waitForLoadState("networkidle");

    // Verify asset selection
    console.log("✅ Step 3: Verifying asset selection");
    await saveScreenshots({
      page,
      label: "atom-on-cosmoshub-to-usdc-on-noble",
      expectFn: async () => {
        await expect(
          page.getByRole("button", { name: "ATOM logo ATOM" }),
          "Source asset ATOM should be visible",
        ).toBeVisible({ timeout: 10_000 });

        await expect(
          page.getByRole("button", { name: "on Cosmos Hub" }),
          "Source chain Cosmos Hub should be visible",
        ).toBeVisible({ timeout: 10_000 });

        await expect(
          page.getByRole("button", { name: "USDC logo USDC" }),
          "Destination asset USDC should be visible",
        ).toBeVisible({ timeout: 10_000 });

        await expect(
          page.getByRole("button", { name: "on Noble" }),
          "Destination chain Noble should be visible",
        ).toBeVisible({ timeout: 10_000 });
      },
    });

    // Step 4: Connect wallet (if not already connected)
    console.log("🔗 Step 4: Checking wallet connection");
    const connectWalletButton2 = page.getByText("Connect Wallet");
    const isConnectButtonVisible2 = await connectWalletButton2.isVisible().catch(() => false);

    if (isConnectButtonVisible2) {
      console.log("   ℹ️ Wallet not connected, connecting now...");
      await connectWalletButton2.click();
      await page.waitForTimeout(500);
      await page.getByText("Keplr").click();
      await approveInKeplr();
      console.log("✅ Wallet connected successfully");
    } else {
      console.log("✅ Wallet already connected, skipping connection step");
    }

    // Step 5: Enter swap amount
    console.log("💰 Step 5: Entering swap amount");
    const input = page.getByRole("textbox");
    await input.first().fill("0.0024");
    await page.waitForTimeout(500);

    // Step 6: Initiate swap
    console.log("🔄 Step 6: Initiating swap");
    await page.getByText("Swap").click();
    await page.waitForTimeout(1000);

    // Step 6.5: Handle optional UI elements (intermediary address, wallet popups)
    await handleOptionalUIElements(page);

    // Step 7: Confirm transaction
    console.log("✍️ Step 7: Confirming transaction");
    await page.getByText("Confirm").click();
    await approveInKeplr();
    console.log("✅ Transaction approved in Keplr");

    // Step 8: Wait for transaction completion
    console.log("⏳ Step 8: Waiting for transaction to complete (may take up to 10 minutes)");
    await saveScreenshots({
      page,
      label: "atom-cosmoshub-to-usdc-noble-complete",
      expectFn: async () => {
        await expect(
          page.getByRole("button", { name: /go again/i }),
          "Transaction should complete and show 'Go Again' button",
        ).toBeVisible({
          timeout: 600_000, // 10 minutes for cross-chain transaction
        });
      },
    });

    console.log("✅ Test completed successfully: Cosmoshub ATOM -> Noble USDC");
  });
});
