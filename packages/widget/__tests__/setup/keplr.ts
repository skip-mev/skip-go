import { BrowserType, chromium } from "@playwright/test";
import dotenv from "dotenv";

import { init, assignWindows, assignActiveTabName, getKeplrWindow } from "./playwright";
import { prepareKeplr } from "./helpers";

export async function setupBrowserContext() {
  dotenv.config();
  const keplrPath = await prepareKeplr();

  // Prepare browser args
  const browserArgs = [
    `--disable-extensions-except=${keplrPath}`,
    `--load-extension=${keplrPath}`,
    "--remote-debugging-port=9222",
    "--disable-gpu",
    "--headless=new",
  ];

  // Launch browser
  const context = await chromium.launchPersistentContext("", {
    headless: false,
    args: browserArgs,
  });

  // Wait for initial setup
  await context.pages()[0]?.waitForTimeout(3000);
  await initialSetup(chromium);

  const page = await context.newPage();
  page.setViewportSize({
    height: 800,
    width: 800,
  });
  await page.goto("http://localhost:5173/");

  return page;
}

export async function initialSetup(playwrightInstance: BrowserType) {
  if (playwrightInstance) {
    await init(playwrightInstance);
  } else {
    await init();
  }

  await assignWindows();
  await assignActiveTabName("keplr");
  const phrase =
    process.env.WORD_PHRASE_KEY ||
    "test test test test test test test test test test test test test test test test test test test test test test test test";
  await importWallet(phrase, "Tester@1234");

  // keplrWindow
}

async function importWallet(secretWords: string, password: string) {
  const keplrWindow = getKeplrWindow();

  await keplrWindow.getByText(/import an existing wallet/i).click();

  await keplrWindow.getByText(/use recovery phrase or private key/i).click();

  await keplrWindow.getByText(/24 words/i).click();

  const inputs = await keplrWindow.getByRole("textbox").all();

  await keplrWindow.waitForTimeout(1000);

  for (const [index, word] of secretWords.split(" ").entries()) {
    await inputs[index].fill(word);
    // keplrWindow.fill()
    // await playwright.waitAndType(
    // firstTimeFlowImportPageElements.secretWordsInput(index),
    // word,
    // );
  }

  await keplrWindow
    .getByRole("button", {
      name: "Import",
      exact: true,
    })
    .click();

  await keplrWindow
    .getByRole("textbox", {
      name: "e.g. Trading, NFT Vault, Investment",
    })
    .fill("Test Wallet");

  const [passwordField, confirmPasswordField] = await keplrWindow
    .getByPlaceholder("At least 8 characters in length")
    .all();

  await passwordField.fill(password);
  await confirmPasswordField.fill(password);

  await keplrWindow
    .getByRole("button", {
      name: "Next",
      exact: true,
    })
    .click();

  await keplrWindow
    .getByRole("button", {
      name: "Save",
      exact: true,
    })
    .click();

  return await keplrWindow
    .getByRole("button", {
      name: "Finish",
      exact: true,
    })
    .click();
}
