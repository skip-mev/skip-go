# Skip Go Widget E2E Tests

This directory contains end-to-end (e2e) tests for the Skip Go Widget, focusing on cross-chain swap functionality with real wallet integrations.

## Overview

The e2e tests verify the complete user flow of:
1. Selecting source and destination assets
2. Connecting a wallet (Keplr)
3. Approving transactions
4. Completing cross-chain swaps
5. Verifying transaction completion

## Test Structure

```
__tests__/
├── Keplr.test.tsx          # Main test file with swap scenarios
├── setup/                   # Test utilities and configuration
│   ├── fixtures.ts         # Reusable test fixtures and constants
│   ├── globalSetup.ts      # Global test setup and env validation
│   ├── helpers.ts          # Keplr extension download/setup helpers
│   ├── keplr.ts           # Keplr wallet initialization
│   ├── playwright.ts      # Browser automation utilities
│   ├── types.ts           # TypeScript type definitions
│   └── utils.ts           # Common test utilities
├── Widget/
│   ├── expected/          # Expected screenshots for visual regression
│   └── new/              # New screenshots on test failures
└── test-results/         # Test execution artifacts
    ├── screenshots/      # Failure screenshots
    └── reports/         # Test reports (HTML, JSON)
```

## Prerequisites

1. **Node.js**: Version 18 or higher
2. **Dependencies**: Run `yarn install` in the workspace root
3. **Widget Dev Server**: Tests automatically start the dev server, or you can run it manually with `yarn dev:visual-test`

## Running Tests

### Basic Commands

```bash
# Run all e2e tests
yarn test

# Run tests in headed mode (visible browser)
yarn playwright test --headed

# Run specific test file
yarn playwright test Keplr.test.tsx

# Update expected screenshots
yarn update-screenshots

# Run with debugging
yarn playwright test --debug
```

### Environment Variables

Create a `.env` file in the widget package directory:

```env
# Optional: Custom wallet mnemonic (24 words)
WORD_PHRASE_KEY="your twenty four word mnemonic phrase here..."

# Optional: Update expected screenshots
UPDATE_SCREENSHOTS=true

# Optional: Slow down actions for debugging (milliseconds)
SLOW_MODE=1000
```

## Test Configuration

Configuration is in `playwright.config.ts`:

- **Timeout**: 1000 seconds (for long cross-chain transactions)
- **Retries**: 2 in CI, 0 locally
- **Reporters**: HTML, JSON, and list
- **Artifacts**: Screenshots on failure, videos in CI
- **Browser**: Chromium with Keplr extension

## Test Scenarios

### 1. Noble USDC → Cosmos Hub ATOM

Tests a cross-chain swap from USDC on Noble to ATOM on Cosmos Hub.

**Steps:**
1. Select USDC on Noble as source
2. Select ATOM on Cosmos Hub as destination
3. Connect Keplr wallet
4. Enter swap amount (0.01)
5. Approve transaction in Keplr
6. Wait for cross-chain completion (up to 10 minutes)

### 2. Cosmos Hub ATOM → Noble USDC

Tests the reverse swap from ATOM to USDC.

**Steps:**
1. Clear previous state
2. Select ATOM on Cosmos Hub as source
3. Select USDC on Noble as destination
4. Connect Keplr wallet
5. Enter swap amount (0.01)
6. Approve transaction in Keplr
7. Wait for cross-chain completion

## How It Works

### Keplr Extension Setup

1. **Download**: Automatically downloads latest Keplr extension from GitHub
2. **Cache**: Extensions are cached in `__tests__/downloads/`
3. **Installation**: Loads extension into Chromium browser
4. **Import Wallet**: Programmatically imports a test wallet with mnemonic

### Browser Automation

- **Headless Mode**: Tests run in headless Chromium by default
- **Remote Debugging**: Port 9222 for inspector protocol
- **Window Management**: Tracks main window, Keplr popup, and extension pages
- **Approval Polling**: Continuously polls for Keplr approval popups

### Visual Regression

- **Screenshots**: Captured at key points in the flow
- **Comparison**: Compare against expected screenshots (when implemented)
- **Failure Capture**: Automatically captures full-page screenshots on failure

## Debugging

### View Test Results

```bash
# Open HTML report
yarn playwright show-report __tests__/reports/html

# View specific failure screenshots
ls __tests__/test-results/screenshots/
```

### Common Issues

#### Tests Timeout
- **Cause**: Cross-chain transactions can be slow
- **Solution**: Timeout is set to 10 minutes; check blockchain status

#### Keplr Extension Fails to Load
- **Cause**: Download failure or corrupted cache
- **Solution**: Delete `__tests__/downloads/` and re-run tests

#### Wallet Connection Fails
- **Cause**: Keplr popup not detected
- **Solution**: Run in headed mode to see what's happening: `yarn playwright test --headed`

#### Element Not Found
- **Cause**: UI changed or element loading is slow
- **Solution**: Check selectors in test and add appropriate waits

### Running in Debug Mode

```bash
# Opens Playwright Inspector
yarn playwright test --debug

# Slow down actions
SLOW_MODE=1000 yarn playwright test --headed
```

## CI/CD Integration

The tests are configured to run in CI with:
- 2 retry attempts for flaky tests
- Video recording on failure
- Trace recording on failure
- HTML and JSON reports
- Fail-fast after 3 failures

### GitHub Actions Example

```yaml
- name: Install dependencies
  run: yarn install

- name: Install Playwright browsers
  run: yarn playwright install --with-deps chromium

- name: Run e2e tests
  run: yarn test
  env:
    CI: true

- name: Upload test artifacts
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-results
    path: packages/widget/__tests__/test-results/
```

## Best Practices

1. **Use Fixtures**: Import test fixtures for better reusability
2. **Add Logging**: Use `console.log` to track test progress
3. **Wait for Network**: Use `waitForLoadState('networkidle')` after navigation
4. **Descriptive Assertions**: Add messages to `expect()` calls
5. **Clean State**: Clear localStorage between tests
6. **Handle Failures**: Tests automatically capture screenshots on failure

## Extending Tests

### Adding New Test Scenarios

```typescript
test("New swap scenario", async () => {
  page = await setupBrowserContext();

  // Your test steps here
  await selectAsset({ page, asset: "TOKEN", chain: "CHAIN" });

  // Add assertions
  await expect(page.getByText("Expected Text")).toBeVisible();
});
```

### Using Fixtures

```typescript
import { test, TEST_DATA, SELECTORS } from "./setup/fixtures";

test("Using fixtures", async ({ widgetPage }) => {
  // widgetPage comes pre-configured with Keplr
  const { source, destination } = TEST_DATA.ASSET_PAIRS.NOBLE_USDC_TO_ATOM;

  await selectAsset({ page: widgetPage, ...source });
  await selectAsset({ page: widgetPage, ...destination });
});
```

## Troubleshooting

### Enable Verbose Logging

```bash
DEBUG=pw:api yarn playwright test
```

### Check Browser Console

Add this to your test to see browser console logs:

```typescript
page.on('console', msg => console.log('BROWSER:', msg.text()));
```

### Inspect Network Requests

```typescript
page.on('request', request =>
  console.log('→', request.method(), request.url())
);
page.on('response', response =>
  console.log('←', response.status(), response.url())
);
```

## Contributing

When adding or modifying tests:

1. Follow the existing test structure and naming conventions
2. Add comprehensive documentation with JSDoc comments
3. Include proper error handling and logging
4. Update this README if adding new features or test scenarios
5. Ensure tests pass locally before committing
6. Run `yarn update-screenshots` if intentionally changing UI

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Skip Go Widget Docs](https://docs.skip.build/widget/)
- [Keplr Wallet Docs](https://docs.keplr.app/)
