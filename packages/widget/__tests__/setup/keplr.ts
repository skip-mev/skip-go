/* eslint-disable no-console */
import { BrowserType, chromium } from "@playwright/test";
import dotenv from "dotenv";

import { init, assignWindows, assignActiveTabName, getKeplrWindow } from "./playwright";
import { prepareKeplr } from "./helpers";

/**
 * Sets up a browser context with Keplr extension installed
 * @returns Page instance ready for testing
 * @throws Error if browser setup fails
 */
export async function setupBrowserContext() {
  try {
    console.log("🔧 Setting up browser context with Keplr extension...");

    dotenv.config();

    // Download and prepare Keplr extension
    console.log("📦 Downloading Keplr extension...");
    const keplrPath = await prepareKeplr();
    console.log(`✅ Keplr extension ready at: ${keplrPath}`);

    // Prepare browser args
    const browserArgs = [
      `--disable-extensions-except=${keplrPath}`,
      `--load-extension=${keplrPath}`,
      "--remote-debugging-port=9222",
      "--disable-gpu",
      "--headless=new",
    ];

    // Launch browser
    console.log("🚀 Launching browser with Keplr extension...");
    const context = await chromium.launchPersistentContext("", {
      headless: false,
      args: browserArgs,
      timeout: 60_000, // 60 seconds to launch browser
    });

    // Wait for initial setup
    const initialPage = context.pages()[0];
    if (initialPage) {
      await initialPage.waitForTimeout(3000);
    }

    console.log("🔑 Initializing Keplr wallet...");
    await initialSetup(chromium);

    // Create new page for the widget
    const page = await context.newPage();
    page.setViewportSize({
      height: 800,
      width: 800,
    });

    console.log("🌐 Navigating to widget...");
    await page.goto("http://localhost:5173/", {
      waitUntil: "networkidle",
      timeout: 60_000,
    });

    console.log("✅ Browser context setup complete");
    return page;
  } catch (error) {
    console.error("❌ Failed to setup browser context");
    console.error(`   Error: ${error instanceof Error ? error.message : error}`);
    throw new Error(`Browser setup failed: ${error}`);
  }
}

/**
 * Performs initial setup of Keplr wallet
 * @param playwrightInstance - Playwright browser type instance
 * @throws Error if wallet setup fails
 */
export async function initialSetup(playwrightInstance: BrowserType) {
  try {
    // Initialize browser connection
    if (playwrightInstance) {
      await init(playwrightInstance);
    } else {
      await init();
    }

    // Assign window references
    await assignWindows();
    await assignActiveTabName("keplr");

    // Get mnemonic from env or use default test mnemonic
    const phrase =
      process.env.WORD_PHRASE_KEY ||
      "test test test test test test test test test test test test test test test test test test test test test test test test";

    console.log("🔐 Importing wallet into Keplr...");
    await importWallet(phrase, "Tester@1234");
    console.log("✅ Wallet imported successfully");
  } catch (error) {
    console.error("❌ Failed to setup Keplr wallet");
    console.error(`   Error: ${error instanceof Error ? error.message : error}`);
    throw new Error(`Keplr setup failed: ${error}`);
  }
}

/**
 * Helper to safely wait without using page.waitForTimeout
 * This avoids "page closed" errors when the page state changes
 */
async function safeWait(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Imports a wallet into Keplr using a mnemonic phrase
 * @param secretWords - 24-word mnemonic phrase
 * @param password - Wallet password
 * @throws Error if import fails
 */
async function importWallet(secretWords: string, password: string) {
  try {
    const keplrWindow = getKeplrWindow();

    // Step 1: Click "Import an existing wallet"
    await keplrWindow.getByText(/import an existing wallet/i).click();
    await safeWait(500);

    // Step 2: Select "Use recovery phrase or private key"
    await keplrWindow.getByText(/use recovery phrase or private key/i).click();
    await safeWait(500);

    // Step 3: Select 24 words option
    await keplrWindow.getByText(/24 words/i).click();
    await safeWait(1000);

    // Step 4: Fill in mnemonic words
    const inputs = await keplrWindow.getByRole("textbox").all();
    const words = secretWords.split(" ");

    if (words.length !== 24) {
      throw new Error(`Expected 24 words in mnemonic, got ${words.length}`);
    }

    for (const [index, word] of words.entries()) {
      if (index >= inputs.length) {
        throw new Error(`Not enough input fields. Expected 24, found ${inputs.length}`);
      }
      await inputs[index].fill(word);
    }

    // Step 5: Click Import button
    await keplrWindow
      .getByRole("button", {
        name: "Import",
        exact: true,
      })
      .click();
    await safeWait(1000);

    // Step 6: Set wallet name
    await keplrWindow
      .getByRole("textbox", {
        name: "e.g. Trading, NFT Vault, Investment",
      })
      .fill("Test Wallet");

    // Step 7: Set password
    const [passwordField, confirmPasswordField] = await keplrWindow
      .getByPlaceholder("At least 8 characters in length")
      .all();

    if (!passwordField || !confirmPasswordField) {
      throw new Error("Password fields not found");
    }

    await passwordField.fill(password);
    await confirmPasswordField.fill(password);

    // Step 8: Click Next
    await keplrWindow
      .getByRole("button", {
        name: "Next",
        exact: true,
      })
      .click();
    await safeWait(1000);

    // Step 9: Click Save
    await keplrWindow
      .getByRole("button", {
        name: "Save",
        exact: true,
      })
      .click();
    await safeWait(1000);

    // Step 10: Click Finish (this closes the Keplr window)
    await keplrWindow
      .getByRole("button", {
        name: "Finish",
        exact: true,
      })
      .click();

    // Don't wait after clicking Finish as the window closes
    // Just give a small moment for the click to register
    await safeWait(500);
  } catch (error) {
    // Check if it's a "page closed" error which might be expected
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes("Target page, context or browser has been closed")) {
      console.log("   ℹ️ Keplr window closed (expected after Finish)");
      return; // This is expected, wallet import succeeded
    }

    console.error("❌ Failed to import wallet");
    console.error(`   Error: ${errorMessage}`);
    throw new Error(`Wallet import failed: ${error}`);
  }
}
