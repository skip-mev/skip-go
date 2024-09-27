import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    preserveSymlinks: true,
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    react(),
    dts({
      outDir: "build",
      tsconfigPath: "./tsconfig.app.json",
      exclude: ["**/*.stories.ts", "src/test", "**/*.test.tsx"]
    }),
    nodePolyfills({
      globals: {
        Buffer: true,
      },
      exclude: [""]
    }),
  ],
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "@r2wc/react-to-web-component",
      ],
      output: {
        dir: "build",
        entryFileNames: "[name].js",
      },
    },
    esbuild: {
      minify: true
    }
  },
});
