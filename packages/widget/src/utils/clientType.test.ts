import { test, expect } from "@playwright/test";
import { getClientOperations, OperationType } from "./clientType";
import type { RouteResponse } from "@skip-go/client";

const route: RouteResponse = {
  sourceAssetDenom: "uosmo",
  sourceAssetChainId: "osmosis-1",
  destAssetDenom: "uatom",
  destAssetChainId: "cosmoshub-4",
  amountIn: "1000000",
  amountOut: "54906",
  requiredChainAddresses: ["osmosis-1", "cosmoshub-4"],
  operations: [
    {
      swap: {
        swapIn: {
          swapVenue: {
            name: "neutron-astroport",
            chainId: "neutron-1",
            logoUri:
              "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
          },
          swapOperations: [
            {
              pool: "pool-0",
              denomIn: "uosmo",
              denomOut: "uatom",
            },
          ],
          swapAmountIn: "1000000",
        },
        estimatedAffiliateFee: "1000000",
        chainId: "neutron-1",
        fromChainId: "neutron-1",
        denomIn: "uosmo",
        denomOut: "uatom",
        swapVenues: [
          {
            name: "neutron-astroport",
            chainId: "neutron-1",
            logoUri:
              "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
          },
        ],
      },
      txIndex: 0,
      amountIn: "100000",
      amountOut: "100000",
    },
    {
      transfer: {
        destDenom: "uatom",
        supportsMemo: true,
        smartRelay: false,
        bridgeId: "IBC",
        denomIn: "uosmo",
        denomOut: "uatom",
        fromChainId: "osmosis-1",
        toChainId: "cosmoshub-4",
      },
      txIndex: 0,
      amountIn: "100000",
      amountOut: "100000",
    },
  ],
  chainIds: ["osmosis-1", "cosmoshub-4"],
  doesSwap: true,
  swapVenues: [
    {
      name: "osmosis-poolmanager",
      chainId: "osmosis-1",
      logoUri:
        "https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmosis-chain-logo.png",
    },
  ],
  estimatedFees: [],
  txsRequired: 1,
  estimatedRouteDurationSeconds: 0,
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

