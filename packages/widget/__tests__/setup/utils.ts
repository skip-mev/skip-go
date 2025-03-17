import { Page } from "@playwright/test";

import { test } from "./fixtures";
import { init, watchKeplrPopupApproveWindow } from "./playwright";

export async function connectDestination(page: Page) {
  await page.getByRole("button", { name: "Connect Destination Wallet" }).click();
  await page.getByRole("button", { name: "Keplr" }).click();
}
export async function connectSource(page: Page) {
  await page.getByText("Connect Wallet").click();
  await page.getByText("Keplr").click();
}
export async function selectDestination(page: Page, chain: string, asset: string) {
  await page.getByTestId("destination").getByTestId("select-chain").click({
    force: true,
  });
  await page.getByPlaceholder("Search for a chain").fill(chain);
  await page.getByTestId("destination").getByTestId("chain-item").first().click({
    force: true,
  });
  await page.getByTestId("destination").getByTestId("select-asset").click({
    force: true,
  });
  await page.getByPlaceholder("Search name or paste address").click();
  await page.getByPlaceholder("Search name or paste address").fill(asset);
  await page.getByTestId("destination").getByTestId("asset-item").first().click({
    force: true,
  });
}

export async function selectAsset({
  page,
  asset,
  chain,
}: {
  page: Page;
  asset: string;
  chain: string;
}) {
  const selectAsset = page.getByText("Select asset").first();
  await selectAsset.click();
  await page.getByPlaceholder("Search for an asset").fill(asset);
  await page
    .getByText(asset, {
      exact: true,
    })
    .click();
  await page.getByPlaceholder("Search networks").fill(chain);
  await page
    .getByText(chain, {
      exact: true,
    })
    .click();
}
export async function initKeplr() {
  await init();
  watchKeplrPopupApproveWindow();
}
export async function expectPageLoaded(page: Page) {
  page.setViewportSize({
    height: 1080,
    width: 1920,
  });
  await page.goto(process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:5173/");
}

export async function e2eTest(page: Page) {
  await test.expect(page.getByTestId("destination").getByTestId("amount")).not.toBeEmpty({
    timeout: 10000,
  });

  await test.expect(page.getByRole("button", { name: "Preview Route" })).toBeEnabled();
  await page.getByRole("button", { name: "Preview Route" }).click();
  await Promise.resolve(setTimeout(() => {}, 5000));
  await test.expect(page.getByRole("button", { name: "Submit" })).toBeVisible({
    timeout: 10000,
  });
  await page.getByRole("button", { name: "Submit" }).click({
    force: true,
    clickCount: 2,
    delay: 3000,
  });

  const txCount = await page.getByTestId("transactions-count").getAttribute("data-test-value");
  const trackedTxHashes = [];
  for (let i = 0; i < Number(txCount); i++) {
    await test.expect(page.getByText(`Transaction ${i + 1}`)).toBeVisible({
      timeout: 300000,
    });
    await test.expect(page.getByTestId(`tx-hash-${i + 1}`)).toBeVisible({
      timeout: 300000,
    });
    const txSignedHash = await page.getByTestId(`tx-hash-${i + 1}`).getAttribute("data-test-value");
    trackedTxHashes.push(txSignedHash);
  }
  console.log("Tracked tx hashes", trackedTxHashes);

  const operations = [];
  await test.expect(page.getByTestId("operations")).toBeVisible({
    timeout: 5000,
  });
  const operationsCount = await page.getByTestId("operations").getAttribute("data-test-value");
  for (let i = 0; i < Number(operationsCount); i++) {
    await test.expect(page.getByTestId(`operation-step-${i}`)).toBeVisible({
      timeout: 5000,
    });
    const data = await page.getByTestId(`operation-step-${i}`).getAttribute("data-test-value");
    await test
      .expect(page.getByTestId(`operation-step-${i}`).getByTestId("explorer-link"))
      .toBeVisible({
        timeout: 30000,
      });
    const _explorerLink = await page
      .getByTestId(`operation-step-${i}`)
      .getByTestId("explorer-link")
      .getAttribute("href");
    if (data) {
      operations.push({ ...JSON.parse(data), explorerLink: _explorerLink });
    }

    await test
      .expect(page.getByTestId(`operation-step-${i}`).getByTestId("state-success"))
      .toBeVisible({
        timeout: 120000,
      });
  }
  console.log(operations);

  await test.expect(page.getByTestId("transaction-success")).toBeVisible({
    timeout: 120000,
  });
  page.close();
  close();
}

export async function fillAmount(page: Page, amount: string) {
  await page.getByTestId("source").getByTestId("amount").click();
  await page.getByTestId("source").getByTestId("amount").fill(amount);
}
