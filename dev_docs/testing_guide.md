# Testing Guide — Skip Go

## Overview

The project uses two testing frameworks across its packages:

| Package | Framework | Test Types |
|---------|-----------|------------|
| `@skip-go/client` | Vitest | Unit tests, E2E tests (local devnet) |
| `@skip-go/widget` | Playwright | E2E tests (browser), visual regression, unit tests |

---

## Quick Reference

```bash
# Client unit tests
yarn test

# Widget E2E tests (starts dev server automatically)
yarn test-widget

# Update widget visual regression screenshots
cd packages/widget && UPDATE_SCREENSHOTS=true yarn playwright test Keplr.test.tsx

# Client E2E (requires local devnet — see below)
cd packages/client && yarn e2e:test
```

---

## Client Package Testing

### Unit Tests

**Config:** `packages/client/vitest.unit.config.mjs`

```bash
cd packages/client && yarn test
# or from root:
yarn test
```

| Setting | Value |
|---------|-------|
| Framework | Vitest |
| Globals | Enabled (`describe`, `it`, `expect` available without import) |
| Threads | Disabled |
| Exclusions | `**/e2e/**` |

#### Test Files

| File | Focus |
|------|-------|
| `src/__test__/client.test.ts` | API endpoint wrappers (chains, assets, route, msgs, submit, track, status) |
| `src/__test__/convert.test.ts` | `toCamel` / `toSnake` case conversion |

#### Mocking Pattern

Uses [MSW (Mock Service Worker)](https://mswjs.io/) for HTTP mocking:

```typescript
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

const server = setupServer(
  http.get("*/v2/info/chains", () => {
    return HttpResponse.json({ chains: mockChains });
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### E2E Tests

**Config:** `packages/client/vitest.e2e.config.mjs`

```bash
# One-time setup
cd packages/client && yarn e2e:setup

# Start local devnet
yarn e2e:start

# Run E2E tests
yarn e2e:test

# Stop devnet
yarn e2e:stop

# Clean up
yarn e2e:clean
```

| Setting | Value |
|---------|-------|
| Includes | `**/e2e/*.test.ts` |
| Timeout | 30 seconds |
| Infrastructure | Kind (Kubernetes) + Helm (Starship devnet) |

The `e2e/utils.ts` file defines local RPC and faucet endpoints for Cosmos Hub, Osmosis, Evmos, and Injective test chains.

---

## Widget Package Testing

### Playwright E2E

**Config:** `packages/widget/playwright.config.ts`

```bash
cd packages/widget && yarn test
# or from root:
yarn test-widget
```

| Setting | Value |
|---------|-------|
| Browser | Chromium only |
| Viewport | 800 × 800 |
| Timeout | 1,000,000 ms (~16.7 min, for cross-chain flows) |
| Retries | 2 in CI, 0 locally |
| Web server | `yarn dev:visual-test` on `http://localhost:5173/` |
| Artifacts | Screenshots on failure; video/trace on failure in CI |
| Max failures (CI) | 3 (fail fast) |

#### Setup Infrastructure

**Directory:** `packages/widget/__tests__/setup/`

| File | Purpose |
|------|---------|
| `globalSetup.ts` | Loads `.env`, validates env vars (`WORD_PHRASE_KEY`, `UPDATE_SCREENSHOTS`, `SLOW_MODE`) |
| `fixtures.ts` | Extends Playwright `test` with `widgetPage` fixture, shared `TEST_DATA` and `SELECTORS` |
| `helpers.ts` | Downloads Keplr browser extension from GitHub releases, caches in `__tests__/downloads/` |
| `keplr.ts` | `setupBrowserContext` (launch with extension), `initialSetup` (wallet import via mnemonic) |
| `playwright.ts` | CDP connection to Keplr, `approveInKeplr()` for approval popups |
| `utils.ts` | `selectAsset`, `expectPageLoaded`, `saveScreenshots`, `retryWithBackoff` |
| `types.ts` | TypeScript types for GitHub API responses |

#### Test Flow

A typical E2E test follows this pattern:

```typescript
test.describe.serial("Cross-chain swap", () => {
  test("select source asset", async ({ widgetPage }) => {
    await selectAsset(widgetPage, "source", "ATOM");
  });

  test("connect wallet", async ({ widgetPage }) => {
    // Keplr extension interaction
  });

  test("enter amount and swap", async ({ widgetPage }) => {
    // Amount input → swap button → Keplr approval
  });

  test("wait for completion", async ({ widgetPage }) => {
    // Poll for transaction completion
  });
});
```

Tests run serially (`test.describe.serial`) because each step depends on the previous one.

#### Failure Handling

```typescript
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status === "failed") {
    await page.screenshot({
      path: `test-results/screenshots/${testInfo.title}.png`,
    });
    // Also logs browser console errors
  }
});
```

### Visual Regression

Screenshots are captured during E2E runs and compared against baselines:

| Directory | Purpose |
|-----------|---------|
| `__tests__/Widget/expected/` | Baseline (expected) screenshots |
| `__tests__/Widget/new/` | Screenshots from current run |

```bash
# Update baselines after intentional UI changes
UPDATE_SCREENSHOTS=true yarn playwright test Keplr.test.tsx

# Combine expected/new/diff images for review
yarn combine-images
```

### Widget Unit Tests

Widget utility functions have unit tests that run under Playwright's test runner:

| File | Tests |
|------|-------|
| `src/utils/clientType.test.ts` | `getClientOperations` transformation |
| `src/utils/crypto.test.ts` | Crypto amount helpers |
| `src/utils/number.test.ts` | Number formatting |
| `src/utils/date.test.ts` | Date formatting |

---

## Environment Variables

| Variable | Package | Required | Purpose |
|----------|---------|----------|---------|
| `WORD_PHRASE_KEY` | Widget | No | 24-word mnemonic for Keplr (default test phrase if unset) |
| `UPDATE_SCREENSHOTS` | Widget | No | Set to `"true"` to update visual regression baselines |
| `SLOW_MODE` | Widget | No | Delay (ms) between actions for debugging |
| `CI` | Both | Auto | Enables retries, video/trace capture, fail-fast |

For widget tests, copy `.env.example` to `.env`:

```bash
cp packages/widget/.env.example packages/widget/.env
```

---

## CI Workflows

| Workflow | File | Trigger | Tests |
|----------|------|---------|-------|
| Client tests | `.github/workflows/tests.yml` | PR, push to main/staging | `yarn test` (Vitest) |
| Widget tests | `.github/workflows/widget-tests.yml` | PR, push to main/staging | `yarn test-widget` (Playwright) |
| Linting | `.github/workflows/eslint.yml` | PR | ESLint on `packages/widget/**` |

---

## Writing New Tests

### Client Unit Test

```typescript
import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("myFunction", () => {
  it("should handle success case", async () => {
    server.use(
      http.post("*/v2/fungible/route", () => {
        return HttpResponse.json({ /* mock response */ });
      }),
    );
    const result = await myFunction();
    expect(result).toEqual(/* expected */);
  });

  it("should handle error case", async () => {
    server.use(
      http.post("*/v2/fungible/route", () => {
        return HttpResponse.json({ message: "error" }, { status: 400 });
      }),
    );
    await expect(myFunction()).rejects.toThrow();
  });
});
```

### Widget Utility Test

```typescript
import { test, expect } from "@playwright/test";

test.describe("myUtil", () => {
  test("should format correctly", () => {
    expect(myUtil("input")).toBe("expected output");
  });
});
```

---

## Key Source Files

| File | Purpose |
|------|---------|
| `packages/client/vitest.unit.config.mjs` | Client unit test config |
| `packages/client/vitest.e2e.config.mjs` | Client E2E test config |
| `packages/client/src/__test__/` | Client test files |
| `packages/widget/playwright.config.ts` | Widget Playwright config |
| `packages/widget/__tests__/` | Widget E2E tests and setup |
| `packages/widget/src/utils/*.test.ts` | Widget unit tests |
| `.github/workflows/tests.yml` | Client CI |
| `.github/workflows/widget-tests.yml` | Widget CI |
