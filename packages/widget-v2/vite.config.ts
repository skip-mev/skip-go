import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import path from "path";
// import VitePluginLinaria from "vite-plugin-linaria";
import wyw from "@wyw-in-js/vite";
// import VitePluginLinaria from "@linaria/vite";

import { dependencies, peerDependencies } from "./package.json";

const externalDeps = [
  ...Object.keys(dependencies || {}),
  ...Object.keys(peerDependencies || {}),
];

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
    wyw({
      include: ["**/*.{ts,tsx}"],
      babelOptions: {
        presets: ["@babel/preset-typescript", "@babel/preset-react"],
      },
    }),
    dts({
      rollupTypes: true,
      outDir: "build",
      tsconfigPath: "./tsconfig.app.json",
      exclude: ["node_modules/**", "build/**", ".storybook/**"],
    }),
  ],
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "src/index.tsx"),
      formats: ["es"],
      name: "widget-v2",
    },
    sourcemap: true,
    rollupOptions: {
      external: externalDeps,
      output: {
        dir: "build",
        entryFileNames: "[name].js",
      },
    },
  },
});
