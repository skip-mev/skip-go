import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    deps: {
      optimizer: {
        web: {
          enabled: true,
        },
        ssr: {
          enabled: true,
        },
      },
    },
    globals: true,
  },
});
