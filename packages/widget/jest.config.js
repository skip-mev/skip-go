/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

const config = {
  preset: "ts-jest",
  clearMocks: true,
  testEnvironment: "jsdom",
  transform: {
    "\\.[jt]sx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.jest.json",
        useESM: true,
      },
    ],
  },
  rootDir: ".",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/src/__mocks__/fileMock.js",
    "\\.(woff|woff2|ttf|otf)$": "<rootDir>/src/__mocks__/fileMock.js",
  },
  transformIgnorePatterns: ["/node_modules/", "\\.(woff|woff2|ttf|otf)$"],
  moduleDirectories: ["node_modules", "src"],
  setupFiles: ["<rootDir>/setup.jest.ts"],
  extensionsToTreatAsEsm: [".ts", ".tsx"],
};

export default config;
