import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  // Test configuration
  timeout: 1_000_000, // 1000 seconds for long-running cross-chain transactions
  retries: process.env.CI ? 2 : 0, // Retry twice in CI, no retries locally

  // Global setup
  globalSetup: "./__tests__/setup/globalSetup.ts",

  // Reporter configuration
  reporter: [
    ["html", { outputFolder: "__tests__/reports/html" }],
    ["json", { outputFile: "__tests__/reports/results.json" }],
    ["list"],
  ],

  // Test artifacts
  use: {
    // Screenshot settings
    screenshot: "only-on-failure",

    // Video settings
    video: process.env.CI ? "retain-on-failure" : "off",

    // Trace settings for debugging
    trace: process.env.CI ? "retain-on-failure" : "off",

    // Action timeout
    actionTimeout: 30_000, // 30 seconds for individual actions

    // Navigation timeout
    navigationTimeout: 60_000, // 60 seconds for page loads
  },

  // Test match patterns
  testMatch: ["**/__tests__/**/*.test.{ts,tsx}"],

  // Output directory for test artifacts
  outputDir: "__tests__/test-results",

  // Projects configuration
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 800, height: 800 },
      },
    },
  ],

  // Web server configuration
  webServer: {
    command: "yarn dev:visual-test",
    url: "http://localhost:5173/",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000, // 2 minutes to start the server
    stdout: "pipe",
    stderr: "pipe",
  },

  // Fail fast in CI
  maxFailures: process.env.CI ? 3 : undefined,
});
