/** @type {import("eslint").Linter.Config} */
const eslintConfig = {
  plugins: ["@typescript-eslint", "prettier", "import", "esm"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/strict",
    "plugin:@typescript-eslint/stylistic",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:import/errors",
    "plugin:import/warnings",
  ],
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  settings: {
    "import/extensions": [".js", ".jsx", ".ts", ".tsx"],
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  ignorePatterns: [
    "dist/",
    "build/",
    "node_modules/",
    "src/codegen/",
    "scripts/prepublish.cjs",
    "scripts/generate-chains.cjs",
  ],
  rules: {
    "@typescript-eslint/consistent-type-imports": ["error", {
      prefer: "type-imports",
      disallowTypeAnnotations: false,
    }],

    'import/no-unresolved': 'error',

    "@typescript-eslint/no-import-type-side-effects": "error",

    // Enforce file extensions in imports (especially useful for ESM)
    "import/extensions": ["error", "ignorePackages", {
      "ts": "never",
      "tsx": "never",
      "js": "always",
      "jsx": "always",
    }],

    "esm/no-commonjs": "warn",
    "import/no-unresolved": ["error", {
      ignoreExtension: false,
      caseSensitive: true,
    }],
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
