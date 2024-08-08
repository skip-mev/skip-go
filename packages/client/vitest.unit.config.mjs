import { defineConfig } from "vitest/config";

import config from "./vitest.config.mjs";

export default defineConfig({
  ...config,
  test: {
    ...config.test,
    exclude: ["**/e2e/**"],
  },
});
