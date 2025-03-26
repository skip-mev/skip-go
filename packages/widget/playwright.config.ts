import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  timeout: 180_000,
  use: {
    headless: true,
  },
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
