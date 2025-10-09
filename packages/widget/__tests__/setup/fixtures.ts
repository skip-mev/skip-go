/* eslint-disable no-console */
import { test as base, Page } from "@playwright/test";
import { setupBrowserContext } from "./keplr";

/**
 * Extended test fixtures for Skip Go Widget e2e tests
 * Provides pre-configured browser context with Keplr wallet
 */
export type TestFixtures = {
  /**
   * Page with Keplr wallet already configured
   */
  widgetPage: Page;
};

/**
 * Extended test with widget-specific fixtures
 * Use this instead of the default `test` import for better reusability
 */
export const test = base.extend<TestFixtures>({
  /**
   * Fixture that sets up a browser with Keplr wallet
   * Automatically initializes before each test and cleans up after
   */
  widgetPage: async ({}, use) => {
    console.log("🔧 Setting up widget page fixture...");

    // Setup: Create browser context with Keplr
    const page = await setupBrowserContext();

    // Use: Provide page to test
    await use(page);

    // Teardown: Cleanup is handled by Playwright automatically
    console.log("✅ Widget page fixture cleanup complete");
  },
});

/**
 * Common test data for widget tests
 */
export const TEST_DATA = {
  /**
   * Asset pairs for testing cross-chain swaps
   */
  ASSET_PAIRS: {
    NOBLE_USDC_TO_ATOM: {
      source: { asset: "USDC", chain: "Noble" },
      destination: { asset: "ATOM", chain: "Cosmos Hub" },
    },
    ATOM_TO_NOBLE_USDC: {
      source: { asset: "ATOM", chain: "Cosmos Hub" },
      destination: { asset: "USDC", chain: "Noble" },
    },
  },

  /**
   * Common test amounts
   */
  AMOUNTS: {
    SMALL: "0.01",
    MEDIUM: "0.1",
    LARGE: "1.0",
  },

  /**
   * Timeout values for different operations
   */
  TIMEOUTS: {
    ASSET_SELECTION: 10_000,
    WALLET_CONNECTION: 10_000,
    TRANSACTION_APPROVAL: 5_000,
    CROSS_CHAIN_COMPLETION: 600_000, // 10 minutes
  },
};

/**
 * Common selectors used across tests
 */
export const SELECTORS = {
  CONNECT_WALLET_BUTTON: "Connect Wallet",
  KEPLR_OPTION: "Keplr",
  SWAP_BUTTON: "Swap",
  CONFIRM_BUTTON: "Confirm",
  GO_AGAIN_BUTTON: /go again/i,
  SELECT_ASSET_BUTTON: "Select asset",
  ASSET_SEARCH_INPUT: "Search for an asset",
  CHAIN_SEARCH_INPUT: "Search networks",
};
