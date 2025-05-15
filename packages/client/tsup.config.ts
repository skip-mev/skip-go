import type { Options } from "tsup";
import { defineConfig } from "tsup";
import { dependencies, peerDependencies } from "./package.json";
import glob from "fast-glob";

export const autoExportFilesInDirectory = (path: string) => {
  return glob.sync(path).reduce(
    (acc, file) => {
      const name = file.replace(/^src\//, "").replace(/\.ts$/, "");
      acc[name] = file;
      return acc;
    },
    {} as Record<string, string>,
  );
};

const apiEntrypoints = autoExportFilesInDirectory("src/api/*");
const publicFunctions = autoExportFilesInDirectory("src/public-functions/*");

const defaultOptions: Options = {
  cjsInterop: true,
  clean: true,
  dts: true,
  format: ["esm"],
  minify: false,
  shims: true,
  splitting: true,
  bundle: true,
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
        ...publicFunctions,
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
