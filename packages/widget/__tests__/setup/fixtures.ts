import { type BrowserContext, chromium, test as base } from "@playwright/test";

import { initialSetup } from "./keplr";
import { prepareKeplr } from "./helpers";

export const test = base.extend<{ context: BrowserContext }>({
  // eslint-disable-next-line no-empty-pattern
  context: async ({}, use) => {
    // download keplr
    const keplrPath = await prepareKeplr();

    // prepare browser args
    const browserArgs = [
      `--disable-extensions-except=${keplrPath}`,
      `--load-extension=${keplrPath}`,
      "--remote-debugging-port=9222",
    ];

    if (process.env.CI) {
      browserArgs.push("--disable-gpu");
    }

    if (process.env.HEADLESS_MODE) {
      browserArgs.push("--headless=new");
    }

    // launch browser
    const context = await chromium.launchPersistentContext("", {
      headless: false,
      args: browserArgs,
    });

    await context.pages()[0].waitForTimeout(3000);

    await initialSetup(chromium);

    await use(context);

    await context.close();
  },
});
