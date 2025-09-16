// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import path from "path";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { dependencies, peerDependencies } from "./package.json";

const EXTERNAL_BASE = [
  ...Object.keys(dependencies || {}),
  ...Object.keys(peerDependencies || {}),
  "react/jsx-runtime",
].filter((dep) => dep !== "styled-components");

// IMPORTANT: keep polyfill/shim pkgs *internal* (do NOT externalize these)
const POLYFILL_KEEP_INTERNAL = new Set([
  "buffer",
  "process",
  "util",
  "events",
  "stream-browserify",
  "crypto-browserify",
  "readable-stream",
]);

const externalDeps = EXTERNAL_BASE.filter((dep) => !POLYFILL_KEEP_INTERNAL.has(dep));

export default defineConfig({
  define: {
    // keep your flag:
    "process.env.VISUAL_TEST": JSON.stringify(process.env.VISUAL_TEST),
    // add safe defaults:
    "process.env": {},
    global: "globalThis",
  },
  resolve: {
    // keep your existing options...
    preserveSymlinks: true,
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "./src") },
      { find: "buffer", replacement: "buffer" },
      { find: "process", replacement: "process/browser" },
      { find: "util", replacement: "util" },
      { find: "events", replacement: "events" },
      { find: "stream", replacement: "stream-browserify" },
      { find: "crypto", replacement: "crypto-browserify" },

      // ⚠️ critical: collapse every variant of readable-stream to one instance
      { find: /^readable-stream(\/.*)?$/, replacement: "readable-stream" },
    ],
    // ⚠️ ensure rollup/vite don’t allow duplicates via different importers
    dedupe: ["readable-stream"],
  },
  optimizeDeps: {
    include: [
      "buffer",
      "process",
      "util",
      "events",
      "stream-browserify",
      "crypto-browserify",
      "readable-stream",
    ],
  },
  plugins: [
    react(),
    dts({
      rollupTypes: true,
      outDir: "build",
      tsconfigPath: "./tsconfig.json",
      exclude: ["node_modules/**", "build/**", ".storybook/**", "scripts/**"],
    }),
    nodePolyfills({
      protocolImports: true,
      globals: { Buffer: true, process: true },
    }),
  ],
  build: {
    emptyOutDir: false,
    target: "es2020",
    commonjsOptions: {
      include: [/jotai-effect/, /node_modules/],
      transformMixedEsModules: true,
    },
    minify: false,
    lib: {
      entry: resolve(__dirname, "src/index.tsx"),
      formats: ["es"],
      name: "widget",
    },
    sourcemap: false,
    rollupOptions: {
      treeshake: true,
      // NOTE: polyfill packages are *not* in this list anymore
      external: externalDeps,
      output: {
        dir: "build",
        entryFileNames: "[name].js",
      },
    },
  },
});
