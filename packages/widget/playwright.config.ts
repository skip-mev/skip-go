import { defineConfig } from "@playwright/test";

export default defineConfig({
  timeout: 180_000,
  use: {
    headless: true,
  },
});
