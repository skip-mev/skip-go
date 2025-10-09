/* eslint-disable no-console */
import { Browser, BrowserType, chromium, Page } from "@playwright/test";

let browser: Browser;

let _mainWindow: Page;

let _keplrPopupWindow: Page | undefined;
let _keplrWindow: Page;
// let metamaskNotificationWindow;

let _activeTabName: string;

const extensionsData: Record<
  string,
  {
    version: string;
    id: string;
  }
> = {};

export function getBrowser() {
  return browser;
}

export function getKeplrWindow() {
  return _keplrWindow;
}

export function keplrPopupWindow() {
  return _keplrPopupWindow;
}

export function close() {
  if (browser) {
    browser.close();
  }
}

export async function init(playwrightInstance?: BrowserType) {
  const chromiumInstance = playwrightInstance ? playwrightInstance : chromium;
  const debuggerDetails = await fetch("http://127.0.0.1:9222/json/version");
  const debuggerDetailsConfig = await debuggerDetails.json();
  const webSocketDebuggerUrl = debuggerDetailsConfig.webSocketDebuggerUrl;
  if (process.env.SLOW_MODE) {
    if (!isNaN(parseInt(process.env.SLOW_MODE))) {
      browser = await chromiumInstance.connectOverCDP(webSocketDebuggerUrl, {
        slowMo: Number(parseInt(process.env.SLOW_MODE)),
      });
    } else {
      browser = await chromiumInstance.connectOverCDP(webSocketDebuggerUrl, {
        slowMo: 50,
      });
    }
  } else {
    browser = await chromiumInstance.connectOverCDP(webSocketDebuggerUrl);
  }
  return browser.isConnected();
}

export async function watchKeplrPopupApproveWindow() {
  while (browser) {
    assignWindows();
    if (_keplrPopupWindow) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await _keplrPopupWindow?.getByRole("button", { name: "Approve" }).click();
      _keplrPopupWindow = undefined;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

/**
 * Polls for Keplr approval popup and clicks the approve button
 * @param timeoutMs - Maximum time to wait for popup (default: 5000ms)
 * @returns "approved" if popup was found and approved, "no-popup-found" if timeout reached
 * @throws Error if approval process fails
 */
export async function approveInKeplr(timeoutMs = 5_000): Promise<"approved" | "no-popup-found"> {
  return new Promise((resolve, reject) => {
    let lastSeenPopupAt = Date.now();
    let isRunning = true;
    let hasApproved = false;

    const poll = async () => {
      if (!isRunning) return;

      try {
        assignWindows();

        if (_keplrPopupWindow && !hasApproved) {
          lastSeenPopupAt = Date.now();
          console.log("   🔍 Keplr popup detected, attempting to approve...");

          try {
            const approveButton = _keplrPopupWindow.getByRole("button", {
              name: /approve/i,
            });

            // Wait for button to be visible and clickable
            await approveButton.waitFor({ state: "visible", timeout: 2_000 });
            await approveButton.click();

            hasApproved = true;
            _keplrPopupWindow = undefined;

            // Bring main window back to front
            if (_mainWindow) {
              await _mainWindow.bringToFront();
            }

            console.log("   ✅ Keplr approval successful");
            isRunning = false;
            resolve("approved");
            return;
          } catch (err) {
            console.warn(
              `   ⚠️ Failed to click approve button: ${err instanceof Error ? err.message : err}`,
            );
            _keplrPopupWindow = undefined;
          }
        }

        const timeSinceLastSeen = Date.now() - lastSeenPopupAt;
        if (timeSinceLastSeen >= timeoutMs) {
          isRunning = false;
          console.warn(`   ⏱️ Keplr popup not found within ${timeoutMs}ms timeout`);
          resolve("no-popup-found");
          return;
        }

        setTimeout(poll, 100);
      } catch (err) {
        isRunning = false;
        const errorMessage = `Keplr approval loop error: ${err instanceof Error ? err.message : err}`;
        console.error(`   ❌ ${errorMessage}`);
        reject(new Error(errorMessage));
      }
    };

    poll();
  });
}

export async function assignActiveTabName(tabName: string) {
  _activeTabName = tabName;
}

export async function assignWindows() {
  const extensionsData = await getExtensionsData();

  const keplrExtensionData = extensionsData.keplr;

  const pages = await browser.contexts()[0]?.pages();

  if (!pages) return;

  for (const page of pages) {
    if (page.url().includes("localhost")) {
      _mainWindow = page;
    } else if (page.url().includes(`chrome-extension://${keplrExtensionData.id}/register.html`)) {
      _keplrWindow = page;
    } else if (
      page.url().includes(`chrome-extension://${keplrExtensionData.id}/notification.html`)
    ) {
      //     metamaskNotificationWindow = page;
    } else if (page.url().includes(`chrome-extension://${keplrExtensionData.id}/popup.html`)) {
      _keplrPopupWindow = page;
    }
  }
}

export async function getExtensionsData() {
  if (Object.keys(extensionsData).length > 0) {
    return extensionsData;
  }

  const context = await browser.contexts()[0];
  const page = await context.newPage();

  await page.goto("chrome://extensions");
  await page.waitForLoadState("load");
  await page.waitForLoadState("domcontentloaded");

  const devModeButton = page.locator("#devMode");
  await devModeButton.waitFor();
  await devModeButton.focus();
  await devModeButton.click();

  const extensionDataItems = await page.locator("extensions-item").all();

  for (const extensionData of extensionDataItems) {
    const extensionName = (
      (await extensionData.locator("#name-and-version").locator("#name").textContent()) as string
    )
      .toLowerCase()
      .replaceAll("\n", "")
      .replaceAll(" ", "");

    const extensionVersion = (
      (await extensionData.locator("#name-and-version").locator("#version").textContent()) as string
    ).replace(/(\n| )/g, "");

    const extensionId = ((await extensionData.locator("#extension-id").textContent()) as string)
      .replace("ID: ", "")
      .replaceAll("\n", "")
      .replaceAll(" ", "");

    extensionsData[extensionName] = {
      version: extensionVersion,
      id: extensionId,
    };
  }

  await page.close();

  return extensionsData;
}
