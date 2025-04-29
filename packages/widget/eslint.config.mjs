import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import { fixupPluginRules } from "@eslint/compat";
import prettier from "eslint-plugin-prettier";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  {
    plugins: {
      "react-hooks": fixupPluginRules(reactHooks),
      prettier: prettier,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      semi: ["error", "always"],
      "no-console": ["error", { allow: ["warn", "error"] }],
      quotes: ["error", "double", { avoidEscape: true }],
      "@typescript-eslint/no-unsafe-function-type": "off",
    },
    ignores: ["scripts/prepublish.cjs", "scripts/generate-chains.cjs", "build/*"],
  },
);
