import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import { fixupPluginRules } from "@eslint/compat";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  {
    plugins: {
      "react-hooks": fixupPluginRules(reactHooks),
    },
    rules: {
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "no-console": ["error", { allow: ["warn", "error"] }],
      "quotes": ["error", "double", { "avoidEscape": true }],
      ...reactHooks.configs.recommended.rules,
    },
  }
);
