import { expect, test, beforeEach, describe } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { Widget } from "../src/widget/Widget";
import { page } from "@vitest/browser/context";

beforeEach(() => {
  cleanup(); // Clears previous render before rendering a new instance
});

describe("Widget tests", async () => {
  localStorage.clear();
  test("Two Select assets and please select a source asset is shown by default", async () => {
    render(<Widget disableShadowDom />);
    const selectAsset = await screen.findAllByText("Select asset");

    screen.findByText("Please select a source asset");

    await page.screenshot({
      path: "./Widget/default-widget.png",
    });

    expect(selectAsset.length).toBe(2);
  });

  test("Select Asset Modal is shown when Select asset is clicked, and user is able to select ATOM on CosmosHub", async () => {
    render(<Widget disableShadowDom />);
    const selectAsset = await screen.findAllByText("Select asset");
    await userEvent.click(selectAsset[0]);

    const searchForAnAsset2 = await screen.findByPlaceholderText("Search for an asset");

    expect(searchForAnAsset2).toBeDefined();

    const atomButton = await screen.findByText("ATOM", undefined, { timeout: 5000 });

    await userEvent.click(atomButton);

    const cosmosHub = await screen.findByText("Cosmos Hub", undefined, { timeout: 5000 });

    await userEvent.click(cosmosHub);

    const sourceAssetAtom = await screen.findByText("ATOM");
    const sourceAssetChainId = await screen.findByText("on Cosmos Hub");

    expect(sourceAssetAtom).toBeDefined();
    expect(sourceAssetChainId).toBeDefined();

    const selectDestinationAsset = await screen.findAllByText("Select asset");

    expect(selectDestinationAsset.length).toBe(1);

    await page.screenshot({
      path: "./Widget/select-atom.png",
    });
  });

  test("Is able to select osmo on osmosis as destination asset", async () => {
    render(<Widget disableShadowDom />);

    const selectDestinationAsset = await screen.findAllByText("Select asset");

    expect(selectDestinationAsset.length).toBe(1);

    await userEvent.click(selectDestinationAsset[0]);

    const osmoButton = await screen.findByText("OSMO", undefined, { timeout: 5000 });

    await userEvent.click(osmoButton);

    const osmosis = await screen.findByText("Osmosis", undefined, { timeout: 5000 });

    await userEvent.click(osmosis);

    const sourceAssetAtom = await screen.findByText("ATOM", undefined, { timeout: 5000 });
    const sourceAssetChainId = await screen.findByText("on Cosmos Hub", undefined, {
      timeout: 5000,
    });

    const destinationAssetAtom = await screen.findByText("OSMO", undefined, { timeout: 5000 });
    const destinationAssetChainId = await screen.findByText("on Osmosis", undefined, {
      timeout: 5000,
    });

    await page.screenshot({
      path: "./Widget/both-assets-selected.png",
    });

    expect(sourceAssetAtom).toBeDefined();
    expect(sourceAssetChainId).toBeDefined();
    expect(destinationAssetAtom).toBeDefined();
    expect(destinationAssetChainId).toBeDefined();
  });

  test("Selected Assets persists across re-mounting / reloading", async () => {
    render(<Widget disableShadowDom />);
    const sourceAssetAtom = await screen.findByText("ATOM", undefined, { timeout: 5000 });
    const sourceAssetChainId = await screen.findByText("on Cosmos Hub", undefined, {
      timeout: 5000,
    });
    const destinationAssetAtom = await screen.findByText("OSMO", undefined, { timeout: 5000 });
    const destinationAssetChainId = await screen.findByText("on Osmosis", undefined, {
      timeout: 5000,
    });

    expect(sourceAssetAtom).toBeDefined();
    expect(sourceAssetChainId).toBeDefined();
    expect(destinationAssetAtom).toBeDefined();
    expect(destinationAssetChainId).toBeDefined();
  });

  test("Selected Assets are cleared once localStorage is cleared", async () => {
    localStorage.clear();
    render(<Widget disableShadowDom />);
    const selectAsset = await screen.findAllByText("Select asset");

    screen.findByText("Please select a source asset");

    expect(selectAsset.length).toBe(2);
  });
});
