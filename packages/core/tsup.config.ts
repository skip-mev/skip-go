import type { Options } from "tsup";
import { defineConfig } from "tsup";

const defaultOptions: Options = {
  cjsInterop: true,
  clean: true,
  dts: true,
  format: ["cjs"],
  minify: false,
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
        parser: "src/parser.ts",
        transactions: "src/transactions.ts",
        types: "src/types/index.ts",
      },
      external: [
        /^@cosmjs\/.*/,
        /^@injectivelabs\/.*/,
        /^@protobufjs\/.*/,
        "long",
        "protobufjs",
        //
      ],
    },
  ];
});
