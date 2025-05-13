/** @type {import("eslint").Linter.Config} */
const eslintConfig = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "prettier"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/strict",
    "plugin:@typescript-eslint/stylistic",
  ],
  ignorePatterns: [
    "dist/",
    "build/",
    "node_modules/",
    "src/codegen/",
    "scripts/prepublish.cjs",
    "scripts/generate-chains.cjs",
  ],
  rules: {
    "prettier/prettier": [
      "error",
      {
        singleQuote: false,
        trailingComma: "all",
        tabWidth: 2,
        semi: true,
        printWidth: 100,
        bracketSpacing: true,
        endOfLine: "auto",
      },
    ],
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
    "@typescript-eslint/no-unsafe-function-type": "off",
    "no-console": ["error", { allow: ["warn", "error"] }],
    quotes: ["error", "double", { avoidEscape: true }],
    semi: ["error", "always"],
  },
};

module.exports = eslintConfig;
