import { BrowserType } from "@playwright/test";

import { init, assignWindows, assignActiveTabName, getKeplrWindow } from "./playwright";

export async function initialSetup(playwrightInstance: BrowserType) {
  if (playwrightInstance) {
    await init(playwrightInstance);
  } else {
    await init();
  }

  await assignWindows();
  await assignActiveTabName("keplr");
  const phrase =
    process.env.WORD_PHRASE_KEY || "test test test test test test test test test test test junk";
  await importWallet(phrase, "Tester@1234");

  // keplrWindow
}

async function importWallet(secretWords: string, password: string) {
  const keplrWindow = getKeplrWindow();

  // await keplrWindow.pause();

  await keplrWindow.getByText(/import an existing wallet/i).click();

  await keplrWindow.getByText(/use recovery phrase or private key/i).click();

  const inputs = await keplrWindow.getByRole("textbox").all();

  for (const [index, word] of secretWords.split(" ").entries()) {
    await inputs[index].waitFor({ state: "visible" });

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

  // await keplrWindow.pause();
}
