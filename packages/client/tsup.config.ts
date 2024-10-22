import type { Options } from "tsup";
import { defineConfig } from "tsup";
import { dependencies, peerDependencies } from "./package.json";

const defaultOptions: Options = {
  cjsInterop: true,
  clean: true,
  dts: true,
  format: ["cjs"],
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
        types: "src/types/index.ts",
      },
      external: [
        ...Object.keys(peerDependencies || {}),
        /^@cosmjs\/.*/,
        /^@injectivelabs\/.*/,
        /^@protobufjs\/.*/,
        "viem",
        "cosmjs-types",
        "long",
        "protobufjs",
        //
      ],
    },
  ];
});
