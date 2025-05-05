import { Secp256k1HdWallet } from "@cosmjs/amino";
import { FaucetClient } from "@cosmjs/faucet-client";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import {
  GasPrice,
  isDeliverTxFailure,
  isDeliverTxSuccess,
} from "@cosmjs/stargate";

import {
  COSMOSHUB_ENDPOINT,
  COSMOSHUB_FAUCET,
  EVMOS_REST_ENDPOINT,
  EVMOS_RPC_ENDPOINT,
  INJECTIVE_REST_ENDPOINT,
  INJECTIVE_RPC_ENDPOINT,
  OSMOSIS_ENDPOINT,
  OSMOSIS_FAUCET,
} from "./utils";
import { SKIP_API_URL } from "src/constants/constants";
import { executeRoute, ExecuteRouteOptions } from "src/public-functions/executeRoute";
import { setClientOptions } from "src/public-functions/setClientOptions";
import { executeCosmosTransaction } from "src/private-functions/cosmos/executeCosmosTransaction";
import { ClientState } from "src/state";
import { BridgeType, IBCTransferInfo, Operation, RouteResponse, Transfer } from "src/types/swaggerTypes";
import { InjectiveDirectEthSecp256k1Wallet } from "@injectivelabs/sdk-ts/dist/esm/cosmjs";

describe("transaction execution", () => {
  it("signs and executes an IBC transfer", async () => {
    setClientOptions({
      apiUrl: SKIP_API_URL,
      endpointOptions: {
        getRpcEndpointForChain: async () => {
          return COSMOSHUB_ENDPOINT;
        },
      },
    });

    ClientState.validateGasResults = [{
      error: null,
      asset: {
        denom: "",
      },
      fee: {
        amount: [{
          denom: "0",
          amount: "0",
        }],
        gas: "0",
      },
    }];

    const signer = await DirectSecp256k1HdWallet.fromMnemonic(
      "opinion knife other balcony surge more bamboo canoe romance ask argue teach anxiety adjust spike mystery wolf alone torch tail six decide wash alley"
    );

    const getCosmosSigner = async () => {
      return signer;
    };

    const getGasPrice = async () => {
      return GasPrice.fromString("0.25uatom");
    };

    const accounts = await signer.getAccounts();

    const signerAddress = accounts[0]?.address ?? "";

    const faucet = new FaucetClient(COSMOSHUB_FAUCET);
    await faucet.credit(signerAddress, "uatom");

    const timeout = BigInt(Date.now()) * BigInt(1000000);

    const cosmosTx = {
      chainId: "gaia-1",
      path: ["gaia-1", "osmosis-1"],
      msgs: [{
        msg: `{"source_port":"transfer","source_channel":"channel-0","token":{"denom":"uatom","amount":"1000000"},"sender":"${signerAddress}","receiver":"osmo1rc6h59ev8m7mdpg584v7m5t24k2ut3dy5nekjw4mdsfjysyjvv3q65m8pj","timeout_height":{},"timeout_timestamp":"${timeout}","memo":"{\\"wasm\\":{\\"contract\\":\\"osmo1rc6h59ev8m7mdpg584v7m5t24k2ut3dy5nekjw4mdsfjysyjvv3q65m8pj\\",\\"msg\\":{\\"swap_and_action\\":{\\"user_swap\\":{\\"swap_exact_coin_in\\":{\\"swap_venue_name\\":\\"osmosis-poolmanager\\",\\"operations\\":[{\\"pool\\":\\"1\\",\\"denom_in\\":\\"ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2\\",\\"denom_out\\":\\"uosmo\\"}]}},\\"min_coin\\":{\\"denom\\":\\"uosmo\\",\\"amount\\":\\"18961936\\"},\\"timeout_timestamp\\":1693222298030492937,\\"post_swap_action\\":{\\"bank_send\\":{\\"to_address\\":\\"osmo1f2f9vryyu53gr8vhsksn66kugnxaa7k8jdpk0e\\"}},\\"affiliates\\":[]}}}}"}`,
        msgTypeUrl: "/ibc.applications.transfer.v1.MsgTransfer",
      }]
    };

    const txResult = await executeCosmosTransaction({
      tx: {
        cosmosTx
      },
      options: {
        route: {} as RouteResponse,
        userAddresses: [{ chainId: "gaia-1", address: signerAddress }],
        getCosmosSigner,
        getGasPrice,
      } as ExecuteRouteOptions,
      index: 0, // or the index into your batched gas results
    });

    expect(isDeliverTxSuccess(txResult.stargateBroadcastTxResponse)).toBe(true);
  });

  it("signs and executes an IBC transfer (amino)", async () => {
    setClientOptions({
      apiUrl: SKIP_API_URL,
      endpointOptions: {
        getRpcEndpointForChain: async () => {
          return COSMOSHUB_ENDPOINT;
        },
      },
    });

    const signer = await Secp256k1HdWallet.fromMnemonic(
      "opinion knife other balcony surge more bamboo canoe romance ask argue teach anxiety adjust spike mystery wolf alone torch tail six decide wash alley"
    );
    const getCosmosSigner = async () => {
      return signer;
    };
    const getGasPrice = async () => {
      return GasPrice.fromString("0.25uatom");
    };

    const accounts = await signer.getAccounts();

    const signerAddress = accounts[0]?.address ?? "";

    const faucet = new FaucetClient(COSMOSHUB_FAUCET);
    await faucet.credit(signerAddress, "uatom");

    const timeout = BigInt(Date.now()) * BigInt(1000000);

    const cosmosTx = {
      chainId: "gaia-1",
      path: ["gaia-1", "osmosis-1"],
      msgs: [{
        msg: `{"source_port":"transfer","source_channel":"channel-0","token":{"denom":"uatom","amount":"1000000"},"sender":"${signerAddress}","receiver":"osmo1rc6h59ev8m7mdpg584v7m5t24k2ut3dy5nekjw4mdsfjysyjvv3q65m8pj","timeout_height":{},"timeout_timestamp":"${timeout}","memo":"{\\"wasm\\":{\\"contract\\":\\"osmo1rc6h59ev8m7mdpg584v7m5t24k2ut3dy5nekjw4mdsfjysyjvv3q65m8pj\\",\\"msg\\":{\\"swap_and_action\\":{\\"user_swap\\":{\\"swap_exact_coin_in\\":{\\"swap_venue_name\\":\\"osmosis-poolmanager\\",\\"operations\\":[{\\"pool\\":\\"1\\",\\"denom_in\\":\\"ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2\\",\\"denom_out\\":\\"uosmo\\"}]}},\\"min_coin\\":{\\"denom\\":\\"uosmo\\",\\"amount\\":\\"18961936\\"},\\"timeout_timestamp\\":1693222298030492937,\\"post_swap_action\\":{\\"bank_send\\":{\\"to_address\\":\\"osmo1f2f9vryyu53gr8vhsksn66kugnxaa7k8jdpk0e\\"}},\\"affiliates\\":[]}}}}"}`,
        msgTypeUrl: "/ibc.applications.transfer.v1.MsgTransfer",
      }]
    };

    const txResult = await executeCosmosTransaction({
      tx: {
        cosmosTx
      },
      options: {
        route: {} as RouteResponse,
        userAddresses: [{ chainId: "gaia-1", address: signerAddress }],
        getCosmosSigner,
        getGasPrice,
      } as ExecuteRouteOptions,
      index: 0, // or the index into your batched gas results
    });

    expect(isDeliverTxSuccess(txResult.stargateBroadcastTxResponse)).toBe(true);
  });

  it("signs and executes an IBC transfer (injective)", async () => {
    setClientOptions({
      apiUrl: SKIP_API_URL,
      endpointOptions: {
        getRpcEndpointForChain: async () => {
          return INJECTIVE_RPC_ENDPOINT;
        },
        getRestEndpointForChain: async () => {
          return INJECTIVE_REST_ENDPOINT;
        },
      },
    });

    const signer = await InjectiveDirectEthSecp256k1Wallet.fromKey(
      Uint8Array.from(
        Buffer.from(
          "408890c2b5eba1664bbd33ced41ec0d1322c48b2f65934142e0d8855b552204c",
          "hex"
        )
      )
    );

    const getCosmosSigner = async () => {
      return signer;
    };

    const accounts = await signer.getAccounts();

    const signerAddress = accounts[0]?.address ?? "";
    const getGasPrice = async () => {
      return GasPrice.fromString("0.25inj");
    };

    const timeout = BigInt(Date.now()) * BigInt(1000000);

    const cosmosTx = {
      chainId: "injective-1",
      path: ["injective-1", "osmosis-1"],
      msgs: [{
        msg: `{"source_port":"transfer","source_channel":"channel-0","token":{"denom":"inj","amount":"1000000000000000000"},"sender":"${signerAddress}","receiver":"osmo1rc6h59ev8m7mdpg584v7m5t24k2ut3dy5nekjw4mdsfjysyjvv3q65m8pj","timeout_height":{},"timeout_timestamp":"${timeout}","memo":"{\\"wasm\\":{\\"contract\\":\\"osmo1rc6h59ev8m7mdpg584v7m5t24k2ut3dy5nekjw4mdsfjysyjvv3q65m8pj\\",\\"msg\\":{\\"swap_and_action\\":{\\"user_swap\\":{\\"swap_exact_coin_in\\":{\\"swap_venue_name\\":\\"osmosis-poolmanager\\",\\"operations\\":[{\\"pool\\":\\"1\\",\\"denom_in\\":\\"ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2\\",\\"denom_out\\":\\"uosmo\\"}]}},\\"min_coin\\":{\\"denom\\":\\"uosmo\\",\\"amount\\":\\"18961936\\"},\\"timeout_timestamp\\":1693222298030492937,\\"post_swap_action\\":{\\"bank_send\\":{\\"to_address\\":\\"osmo1f2f9vryyu53gr8vhsksn66kugnxaa7k8jdpk0e\\"}},\\"affiliates\\":[]}}}}"}`,
        msgTypeUrl: "/ibc.applications.transfer.v1.MsgTransfer",
      }]
    };

    const txResult = await executeCosmosTransaction({
      tx: {
        cosmosTx
      },
      options: {
        route: {} as RouteResponse,
        userAddresses: [{ chainId: "injective-1", address: signerAddress }],
        getCosmosSigner,
        getGasPrice,
      } as ExecuteRouteOptions,
      index: 0, // or the index into your batched gas results
    });

    expect(isDeliverTxSuccess(txResult.stargateBroadcastTxResponse)).toBe(true);
  });

  it("signs and executes an IBC transfer (evmos)", async () => {
    setClientOptions({
      apiUrl: SKIP_API_URL,
      endpointOptions: {
        getRpcEndpointForChain: async () => {
          return EVMOS_RPC_ENDPOINT;
        },
        getRestEndpointForChain: async () => {
          return EVMOS_REST_ENDPOINT;
        },
      },
    });

    const signer = await InjectiveDirectEthSecp256k1Wallet.fromKey(
      Uint8Array.from(
        Buffer.from(
          "408890c2b5eba1664bbd33ced41ec0d1322c48b2f65934142e0d8855b552204c",
          "hex"
        )
      ),
      "evmos"
    );
    const getCosmosSigner = async () => {
      return signer;
    };

    const getGasPrice = async () => {
      return GasPrice.fromString("7aevmos");
    };

    const accounts = await signer.getAccounts();

    const signerAddress = accounts[0]?.address ?? "";

    const timeout = BigInt(Date.now()) * BigInt(1000000);

    const cosmosTx = {
      chainId: "evmos_9000-1",
      path: ["evmos_9000-1", "osmosis-1"],
      msgs: [{
        msg: `{"source_port":"transfer","source_channel":"channel-0","token":{"denom":"aevmos","amount":"1000000000000000000"},"sender":"${signerAddress}","receiver":"osmo1rc6h59ev8m7mdpg584v7m5t24k2ut3dy5nekjw4mdsfjysyjvv3q65m8pj","timeout_height":{},"timeout_timestamp":"${timeout}","memo":"{\\"wasm\\":{\\"contract\\":\\"osmo1rc6h59ev8m7mdpg584v7m5t24k2ut3dy5nekjw4mdsfjysyjvv3q65m8pj\\",\\"msg\\":{\\"swap_and_action\\":{\\"user_swap\\":{\\"swap_exact_coin_in\\":{\\"swap_venue_name\\":\\"osmosis-poolmanager\\",\\"operations\\":[{\\"pool\\":\\"1\\",\\"denom_in\\":\\"ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2\\",\\"denom_out\\":\\"uosmo\\"}]}},\\"min_coin\\":{\\"denom\\":\\"uosmo\\",\\"amount\\":\\"18961936\\"},\\"timeout_timestamp\\":1693222298030492937,\\"post_swap_action\\":{\\"bank_send\\":{\\"to_address\\":\\"osmo1f2f9vryyu53gr8vhsksn66kugnxaa7k8jdpk0e\\"}},\\"affiliates\\":[]}}}}"}`,
        msgTypeUrl: "/ibc.applications.transfer.v1.MsgTransfer",
      }]
    };

    const txResult = await executeCosmosTransaction({
      tx: {
        cosmosTx
      },
      options: {
        route: {} as RouteResponse,
        userAddresses: [{ chainId: "evmos_9000-1", address: signerAddress }],
        getCosmosSigner,
        getGasPrice,
      } as ExecuteRouteOptions,
      index: 0, // or the index into your batched gas results
    });

    expect(isDeliverTxSuccess(txResult.stargateBroadcastTxResponse)).toBe(true);
  });

  it("signs and executes a cosmwasm execute message", async () => {
    const signer = await DirectSecp256k1HdWallet.fromMnemonic(
      "opinion knife other balcony surge more bamboo canoe romance ask argue teach anxiety adjust spike mystery wolf alone torch tail six decide wash alley",
      {
        prefix: "osmo",
      }
    );
    const getCosmosSigner = async () => {
      return signer;
    };

    const getGasPrice = async () => {
      return GasPrice.fromString("0.25uosmo");
    };

    const accounts = await signer.getAccounts();
    const signerAddress = accounts[0]?.address ?? "";

    const faucet = new FaucetClient(OSMOSIS_FAUCET);
    await faucet.credit(signerAddress, "uosmo");

    setClientOptions({
      apiUrl: SKIP_API_URL,
      endpointOptions: {
        getRpcEndpointForChain: async () => {
          return OSMOSIS_ENDPOINT;
        },
      },
    });

    const cosmosTx = {
      chainId: "osmosis-1",
      path: ["osmosis-1", "cosmoshub-4"],
      msgs: [{
        msg: `{"sender":"${signerAddress}","contract":"osmo1rc6h59ev8m7mdpg584v7m5t24k2ut3dy5nekjw4mdsfjysyjvv3q65m8pj","msg":{"swap_and_action":{"user_swap":{"swap_exact_coin_in":{"operations":[{"denom_in":"uosmo","denom_out":"ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2","pool":"1"}],"swap_venue_name":"osmosis-poolmanager"}},"min_coin":{"denom":"ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2","amount":"495"},"timeout_timestamp":1693265108785341058,"post_swap_action":{"ibc_transfer":{"ibc_info":{"memo":"","receiver":"cosmos1f2f9vryyu53gr8vhsksn66kugnxaa7k86kjxet","recover_address":"osmo1f2f9vryyu53gr8vhsksn66kugnxaa7k8jdpk0e","source_channel":"channel-0"}}},"affiliates":[]}},"funds":[{"denom":"uosmo","amount":"10000"}]}`,
        msgTypeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      }]
    };

    const txResult = await executeCosmosTransaction({
      tx: {
        cosmosTx
      },
      options: {
        route: {} as RouteResponse,
        userAddresses: [{ chainId: "osmosis-1", address: signerAddress }],
        getCosmosSigner,
        getGasPrice,
      } as ExecuteRouteOptions,
      index: 0, // or the index into your batched gas results
    });

    expect(isDeliverTxFailure(txResult.stargateBroadcastTxResponse)).toBe(true);
    expect(txResult.stargateBroadcastTxResponse.rawLog).toEqual(
      "failed to execute message; message index: 0: contract: not found"
    );
  });

  it("signs and executes a cosmwasm execute message (amino)", async () => {
    setClientOptions({
      apiUrl: SKIP_API_URL,
      endpointOptions: {
        getRpcEndpointForChain: async () => {
          return OSMOSIS_ENDPOINT;
        },
      },
    });

    const signer = await Secp256k1HdWallet.fromMnemonic(
      "opinion knife other balcony surge more bamboo canoe romance ask argue teach anxiety adjust spike mystery wolf alone torch tail six decide wash alley",
      {
        prefix: "osmo",
      }
    );
    const getCosmosSigner = async () => {
      return signer;
    };

    const getGasPrice = async () => {
      return GasPrice.fromString("0.25uosmo");
    };

    const accounts = await signer.getAccounts();

    const signerAddress = accounts[0]?.address ?? "";

    const faucet = new FaucetClient(OSMOSIS_FAUCET);
    await faucet.credit(signerAddress, "uosmo");

    const cosmosTx = {
      chainId: "osmosis-1",
      path: ["osmosis-1", "cosmoshub-4"],
      msgs: [{
        msg: `{"sender":"${signerAddress}","contract":"osmo1rc6h59ev8m7mdpg584v7m5t24k2ut3dy5nekjw4mdsfjysyjvv3q65m8pj","msg":{"swap_and_action":{"user_swap":{"swap_exact_coin_in":{"operations":[{"denom_in":"uosmo","denom_out":"ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2","pool":"1"}],"swap_venue_name":"osmosis-poolmanager"}},"min_coin":{"denom":"ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2","amount":"495"},"timeout_timestamp":1693265108785341058,"post_swap_action":{"ibc_transfer":{"ibc_info":{"memo":"","receiver":"cosmos1f2f9vryyu53gr8vhsksn66kugnxaa7k86kjxet","recover_address":"osmo1f2f9vryyu53gr8vhsksn66kugnxaa7k8jdpk0e","source_channel":"channel-0"}}},"affiliates":[]}},"funds":[{"denom":"uosmo","amount":"10000"}]}`,
        msgTypeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      }]
    };

    const txResult = await executeCosmosTransaction({
      tx: {
        cosmosTx
      },
      options: {
        route: {} as RouteResponse,
        userAddresses: [{ chainId: "osmosis-1", address: signerAddress }],
        getCosmosSigner,
        getGasPrice,
      } as ExecuteRouteOptions,
      index: 0, // or the index into your batched gas results
    });

    expect(isDeliverTxFailure(txResult.stargateBroadcastTxResponse)).toBe(true);
    expect(txResult.stargateBroadcastTxResponse.rawLog).toEqual(
      "failed to execute message; message index: 0: contract: not found"
    );
  });

  it("executeRoute with undefined getGasPrice", async () => {
    setClientOptions({
      apiUrl: SKIP_API_URL,
      endpointOptions: {
        getRpcEndpointForChain: async () => {
          return OSMOSIS_ENDPOINT;
        },
      },
    });

    const signer = await Secp256k1HdWallet.fromMnemonic(
      "opinion knife other balcony surge more bamboo canoe romance ask argue teach anxiety adjust spike mystery wolf alone torch tail six decide wash alley",
      {
        prefix: "osmo",
      }
    );

    const accounts = await signer.getAccounts();

    const signerAddress = accounts[0]?.address ?? "";

    const faucet = new FaucetClient(OSMOSIS_FAUCET);
    await faucet.credit(signerAddress, "uosmo");

    try {
      await executeRoute({
        route: {
          sourceAssetDenom: "uosmo",
          sourceAssetChainId: "osmosis-1",
          destAssetDenom:
            "ibc/14F9BC3E44B8A9C1BE1FB08980FAB87034C9905EF17CF2F5008FC085218811CC",
          destAssetChainId: "cosmoshub-4",
          amountIn: "1000000",
          amountOut: "1000000",
          operations: [
            {
              transfer: {
                fromChainId: "osmosis-1",
                toChainId: "cosmoshub-4",
                denomIn: "uosmo",
                denomOut:
                  "ibc/14F9BC3E44B8A9C1BE1FB08980FAB87034C9905EF17CF2F5008FC085218811CC",
                bridgeId: BridgeType.IBC,
                destDenom:
                  "ibc/14F9BC3E44B8A9C1BE1FB08980FAB87034C9905EF17CF2F5008FC085218811CC",
                chainId: "osmosis-1",
                smartRelay: true,
              } as Transfer,
            } as Operation,
          ],
          requiredChainAddresses: ["osmosis-1", "cosmoshub-4"],
          chainIds: ["osmosis-1", "cosmoshub-4"],
          doesSwap: false,
          estimatedAmountOut: "1000000",
          txsRequired: 1,
          usdAmountIn: "1.68",
          usdAmountOut: "1.68",
          estimatedFees: [],
        },
        userAddresses: [
          {
            address: signerAddress,
            chainId: "osmosis-1",
          },
          {
            address: "cosmos1g3jjhgkyf36pjhe7u5cw8j9u6cgl8x929ej430",
            chainId: "cosmoshub-4",
          },
        ],
        slippageTolerancePercent: "3",
        onTransactionBroadcast: async (tx) => {
          expect(tx).toBeTruthy();
        },
        getCosmosSigner: async () => {
          return DirectSecp256k1HdWallet.fromMnemonic(
            "opinion knife other balcony surge more bamboo canoe romance ask argue teach anxiety adjust spike mystery wolf alone torch tail six decide wash alley",
            {
              prefix: "osmo",
            }
          );
        },
      });
    } catch (error) {
      // we expect an error here because we are using local rpc endpoint
      console.log(error);
      expect(error).toBeTruthy();
    }
  }, 120000);
});
