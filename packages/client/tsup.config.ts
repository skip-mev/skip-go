import type { Options } from "tsup";
import { defineConfig } from "tsup";
import { dependencies, peerDependencies } from "./package.json";
import glob from "fast-glob";

const apiEntrypoints = glob.sync("src/client-v2/api/*.ts").reduce(
  (acc, file) => {
    const name = file.replace(/^src\//, "").replace(/\.ts$/, "");
    acc[name] = file;
    return acc;
  },
  {} as Record<string, string>,
);

const defaultOptions: Options = {
  cjsInterop: true,
  clean: true,
  dts: true,
  format: ["cjs", "esm"],
  minify: true,
  shims: true,
  splitting: true,
  treeshake: true,
  tsconfig: "./tsconfig.build.json",
};

export default defineConfig(async ({ watch }) => {
  return [
    {
      ...defaultOptions,
      clean: !watch,
      entry: {
        index: "src/index.ts",
        ...apiEntrypoints,
      },
      external: [
        ...Object.keys(dependencies || {}),
        ...Object.keys(peerDependencies || {}),
        /^@cosmjs\/.*/,
        /^@injectivelabs\/.*/,
        /^@protobufjs\/.*/,
        /^@solana\/.*/,
        "kujira.js",
        "chain-registry",
        "@initia/initia-registry",
        "viem",
        "long",
        "protobufjs",
      ],
    },
  ];
});
