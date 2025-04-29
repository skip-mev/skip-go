import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import path from "path";
import { nodePolyfills } from "vite-plugin-node-polyfills";

import { dependencies, peerDependencies } from "./package.json";

const externalDeps = [
  ...Object.keys(dependencies || {}),
  ...Object.keys(peerDependencies || {}),
  "react/jsx-runtime",
].filter((dep) => dep !== "styled-components");

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: [
      "vite-plugin-node-polyfills/shims/buffer",
      "vite-plugin-node-polyfills/shims/global",
      "vite-plugin-node-polyfills/shims/process",
    ],
  },
  resolve: {
    preserveSymlinks: true,
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    react(),
    dts({
      rollupTypes: true,
      outDir: "build",
      tsconfigPath: "./tsconfig.json",
      exclude: ["node_modules/**", "build/**", ".storybook/**", "scripts/**"],
    }),
    nodePolyfills(),
  ],
  build: {
    commonjsOptions: {
      include: [/jotai-effect/, /node_modules/],
      transformMixedEsModules: true,
    },
    minify: false,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "src/index.tsx"),
      formats: ["es"],
      name: "widget",
    },
    sourcemap: false,
    rollupOptions: {
      treeshake: true,
      external: externalDeps,
      output: {
        dir: "build",
        entryFileNames: "[name].js",
      },
    },
  },
});
