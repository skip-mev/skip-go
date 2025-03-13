import { expect, test, beforeEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { Widget } from "../src/widget/Widget";

beforeEach(() => {
  cleanup(); // Clears previous render before rendering a new instance
  localStorage.clear();
});

test("Two Select assets and please select a source asset is shown by default", async () => {
  render(<Widget disableShadowDom />);
  const selectAsset = await screen.findAllByText("Select asset");

  screen.findByText("Please select a source asset");

  expect(selectAsset.length).toBe(2);
});

test("Select Asset Modal is shown when Select asset is clicked, and user is able to select ATOM on CosmosHub", async (context) => {
  console.log(context);
  render(<Widget disableShadowDom />);
  const selectAsset = await screen.findAllByText("Select asset");

  const searchForAnAsset = screen.queryByPlaceholderText("Search for an asset");
  expect(searchForAnAsset).toBeNull();

  await userEvent.click(selectAsset[0]);

  const searchForAnAsset2 = await screen.findByPlaceholderText("Search for an asset");

  expect(searchForAnAsset2).toBeDefined();

  const atomButton = await screen.findByText("ATOM");

  await userEvent.click(atomButton);

  const cosmosHub = await screen.findByText("Cosmos Hub");

  await userEvent.click(cosmosHub);

  const sourceAssetAtom = await screen.findByText("ATOM");
  const sourceAssetChainId = await screen.findByText("on Cosmos Hub");

  expect(sourceAssetAtom).toBeDefined();
  expect(sourceAssetChainId).toBeDefined();

  const selectDestinationAsset = await screen.findAllByText("Select asset");

  expect(selectDestinationAsset.length).toBe(1);

  const connectWallet = await screen.findByText("Connect Wallet");
  await userEvent.click(connectWallet);
  const keplr = await screen.findByText("Keplr");
  await userEvent.click(keplr);

  // await page.goto(`chrome-extension://${extensionId}/popup.html`);
});
