import { test, expect } from "@playwright/test";
import { getClientOperations, OperationType } from "./clientType";
import { BridgeType, type RouteResponse } from "@skip-go/client";

const route: RouteResponse = {
  sourceAssetDenom: "uosmo",
  sourceAssetChainId: "osmosis-1",
  destAssetDenom: "uatom",
  destAssetChainId: "cosmoshub-4",
  amountIn: "1000000",
  amountOut: "48500",
  operations: [
    {
      swap: {
        swapIn: {
          swapVenue: {
            name: "osmosis-poolmanager",
            chainId: "osmosis-1",
            logoUri:
              "https://raw.githubusercontent.com/skip-mev/skip-go-registry/main/swap-venues/osmosis/logo.png",
          },
          swapOperations: [
            {
              pool: "1096",
              denomIn: "uosmo",
              denomOut: "ibc/987C17B11ABC2B20019178ACE62929FE9840202CE79498E29FE8E5CB02B7C0A4",
            },
            {
              pool: "611",
              denomIn: "ibc/987C17B11ABC2B20019178ACE62929FE9840202CE79498E29FE8E5CB02B7C0A4",
              denomOut: "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2",
            },
          ],
          swapAmountIn: "1000000",
          priceImpactPercent: "1.1958",
        },
        estimatedAffiliateFee:
          "0ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2",
        fromChainId: "osmosis-1",
        chainId: "osmosis-1",
        denomIn: "uosmo",
        denomOut: "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2",
        swapVenues: [
          {
            name: "osmosis-poolmanager",
            chainId: "osmosis-1",
            logoUri:
              "https://raw.githubusercontent.com/skip-mev/skip-go-registry/main/swap-venues/osmosis/logo.png",
          },
        ],
      },
      txIndex: 0,
      amountIn: "1000000",
      amountOut: "48500",
    },
    {
      transfer: {
        port: "transfer",
        channel: "channel-0",
        fromChainId: "osmosis-1",
        toChainId: "cosmoshub-4",
        pfmEnabled: true,
        supportsMemo: true,
        denomIn: "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2",
        denomOut: "uatom",
        bridgeId: BridgeType.IBC,
        smartRelay: false,
        destDenom: "uatom",
      },
      txIndex: 0,
      amountIn: "48500",
      amountOut: "48500",
    },
  ],
  chainIds: ["osmosis-1", "cosmoshub-4"],
  doesSwap: true,
  estimatedAmountOut: "48500",
  swapVenue: [
    {
      name: "osmosis-poolmanager",
      chainId: "osmosis-1",
      logoUri:
        "https://raw.githubusercontent.com/skip-mev/skip-go-registry/main/swap-venues/osmosis/logo.png",
    },
  ],
  txsRequired: 1,
  usdAmountIn: "0.24",
  usdAmountOut: "0.24",
  swapPriceImpactPercent: "1.1958",
  estimatedFees: [],
  requiredChainAddresses: ["osmosis-1", "cosmoshub-4"],
  estimatedRouteDurationSeconds: 30,
  swapVenues: [
    {
      name: "osmosis-poolmanager",
      chainId: "osmosis-1",
      logoUri:
        "https://raw.githubusercontent.com/skip-mev/skip-go-registry/main/swap-venues/osmosis/logo.png",
    },
  ],
};

const operations = getClientOperations(route.operations);

test.describe("getClientOperations", () => {
  test("parses swap and transfer operations", () => {
    expect(operations).toHaveLength(2);
    expect(operations[0].type).toBe(OperationType.swap);
    expect(operations[0].isSwap).toBe(true);
    expect(operations[1].type).toBe(OperationType.transfer);
    expect(operations[1].isSwap).toBe(false);
  });

  test("does not require additional signatures when txIndex is the same", () => {
    expect(operations[0].signRequired).toBe(false);
    expect(operations[1].signRequired).toBe(false);
  });

  test("increments transfer index only after non-swap operations", () => {
    expect(operations[0].transferIndex).toBe(0);
    expect(operations[1].transferIndex).toBe(0);
  });
});
