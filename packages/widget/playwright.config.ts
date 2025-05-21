import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  timeout: 300_000,
  retries: 0,
  globalSetup: "./__tests__/setup/globalSetup.ts",
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "yarn run dev",
    url: "http://localhost:5173/",
    reuseExistingServer: !process.env.CI,
  },
});
