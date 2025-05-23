import { rest } from "msw";
import { setupServer } from "msw/node";

import {
  chains,
  assets,
  assetsFromSource,
  bridges,
  BridgeType,
  ibcOriginAssets,
  messages,
  recommendAssets,
  route,
  submitTransaction,
  trackTransaction,
  transactionStatus,
  venues,
  getRecommendedGasPrice,
  getFeeInfoForChain,
  setApiOptions,
} from "../index";
import { SKIP_API_URL } from "src/constants/constants";
import { toCamel } from "src/utils/convert";

export const server = setupServer();

describe("client", () => {
  beforeAll(async () => server.listen());

  afterEach(() => server.resetHandlers());

  afterAll(() => server.close());

  describe("/v2/info/chains", () => {
    it("handles 200 OK", async () => {
      server.use(
        rest.get("https://api.skip.build/v2/info/chains", (_, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              chains: [
                {
                  chain_name: "osmosis",
                  chain_id: "osmosis-1",
                  pretty_name: "Osmosis",
                  pfm_enabled: true,
                  chain_type: "cosmos",
                  supports_memo: true,
                  logo_uri:
                    "https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmosis-chain-logo.png",
                  bech32_prefix: "osmo",
                  fee_assets: [
                    {
                      denom: "uosmo",
                      gas_price: {
                        low: "0.0025",
                        average: "0.025",
                        high: "0.04",
                      },
                    },
                  ],
                  is_testnet: false,
                },
              ],
            }),
          );
        }),
      );

      const response = await chains({
        apiUrl: "https://api.skip.build",
      });

      expect(response).toEqual([
        {
          chainName: "osmosis",
          chainId: "osmosis-1",
          prettyName: "Osmosis",
          pfmEnabled: true,
          chainType: "cosmos",
          isTestnet: false,
          supportsMemo: true,
          logoUri:
            "https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmosis-chain-logo.png",
          bech32Prefix: "osmo",
          feeAssets: [
            {
              denom: "uosmo",
              gasPrice: {
                low: "0.0025",
                average: "0.025",
                high: "0.04",
              },
            },
          ],
        },
      ]);
    });
  });

  describe("/v2/fungible/assets", () => {
    it("handles 200 OK", async () => {
      server.use(
        rest.get("https://api.skip.build/v2/fungible/assets", (_, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              chain_to_assets_map: {
                "cosmoshub-4": {
                  assets: [
                    {
                      denom: "ibc/6B8A3F5C2AD51CD6171FA41A7E8C35AD594AB69226438DB94450436EA57B3A89",
                      chain_id: "cosmoshub-4",
                      origin_denom: "ustrd",
                      origin_chain_id: "stride-1",
                      is_cw20: false,
                      trace: "transfer/channel-391",
                      symbol: "STRD",
                      name: "STRD",
                      logo_uri:
                        "https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/stride/asset/strd.png",
                      decimals: 6,
                    },
                    {
                      denom: "uatom",
                      chain_id: "cosmoshub-4",
                      origin_denom: "uatom",
                      origin_chain_id: "cosmoshub-4",
                      is_cw20: false,
                      trace: "",
                      symbol: "ATOM",
                      name: "ATOM",
                      logo_uri:
                        "https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/cosmos/asset/atom.png",
                      decimals: 6,
                    },
                  ],
                },
                "osmosis-1": {
                  assets: [
                    {
                      denom: "uosmo",
                      chain_id: "osmosis-1",
                      origin_denom: "uosmo",
                      origin_chain_id: "osmosis-1",
                      is_cw20: false,
                      trace: "",
                      symbol: "OSMO",
                      name: "OSMO",
                      logo_uri:
                        "https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/osmosis/asset/osmo.png",
                      decimals: 6,
                    },
                  ],
                },
              },
            }),
          );
        }),
      );

      const response = await assets({
        apiUrl: "https://api.skip.build",
      });

      expect(response).toEqual({
        "cosmoshub-4": [
          {
            denom: "ibc/6B8A3F5C2AD51CD6171FA41A7E8C35AD594AB69226438DB94450436EA57B3A89",
            chainId: "cosmoshub-4",
            originDenom: "ustrd",
            originChainId: "stride-1",
            isCw20: false,
            trace: "transfer/channel-391",
            symbol: "STRD",
            name: "STRD",
            logoUri:
              "https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/stride/asset/strd.png",
            decimals: 6,
          },
          {
            denom: "uatom",
            chainId: "cosmoshub-4",
            originDenom: "uatom",
            originChainId: "cosmoshub-4",
            isCw20: false,
            trace: "",
            symbol: "ATOM",
            name: "ATOM",
            logoUri:
              "https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/cosmos/asset/atom.png",
            decimals: 6,
          },
        ],
        "osmosis-1": [
          {
            denom: "uosmo",
            chainId: "osmosis-1",
            originDenom: "uosmo",
            originChainId: "osmosis-1",
            isCw20: false,
            trace: "",
            symbol: "OSMO",
            name: "OSMO",
            logoUri:
              "https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/osmosis/asset/osmo.png",
            decimals: 6,
          },
        ],
      });
    });

    it("handles 200 OK - with parameters", async () => {
      server.use(
        rest.get("https://api.skip.build/v2/fungible/assets", (req, res, ctx) => {
          const chainIds = req.url.searchParams.get("chain_ids");
          const nativeOnly = req.url.searchParams.get("native_only");
          const includeNoMetadataAssets = req.url.searchParams.get("include_no_metadata_assets");

          if (chainIds && nativeOnly && includeNoMetadataAssets) {
            return res(
              ctx.status(200),
              ctx.json({
                chain_to_assets_map: {
                  "osmosis-1": {
                    assets: [
                      {
                        denom: "uosmo",
                        chain_id: "osmosis-1",
                        origin_denom: "uosmo",
                        origin_chain_id: "osmosis-1",
                        is_cw20: false,
                        trace: "",
                        symbol: "OSMO",
                        name: "OSMO",
                        logo_uri:
                          "https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/osmosis/asset/osmo.png",
                        decimals: 6,
                      },
                    ],
                  },
                },
              }),
            );
          }

          return res(ctx.status(500), ctx.json({ message: "should not have reached this" }));
        }),
      );

      const response = await assets({
        chainIds: ["osmosis-1"],
        nativeOnly: true,
        includeNoMetadataAssets: true,
        apiUrl: "https://api.skip.build",
      });

      expect(response).toEqual({
        "osmosis-1": [
          {
            denom: "uosmo",
            chainId: "osmosis-1",
            originDenom: "uosmo",
            originChainId: "osmosis-1",
            trace: "",
            isCw20: false,
            symbol: "OSMO",
            name: "OSMO",
            logoUri:
              "https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/osmosis/asset/osmo.png",
            decimals: 6,
          },
        ],
      });
    });

    it("handles 400 Bad Request", async () => {
      server.use(
        rest.get("https://api.skip.build/v2/fungible/assets", (_, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({
              code: 3,
              message: "Invalid chain_id",
              details: [],
            }),
          );
        }),
      );

      await expect(
        assets({
          apiUrl: "https://api.skip.build",
        }),
      ).rejects.toThrow("Invalid chain_id");
    });

    it("handles 500 Internal Server Error", async () => {
      server.use(
        rest.get("https://api.skip.build/v2/fungible/assets", (_, res, ctx) => {
          return res(
            ctx.status(500),
            ctx.json({
              code: 2,
              message: "internal server error",
              details: [],
            }),
          );
        }),
      );

      await expect(
        assets({
          apiUrl: "https://api.skip.build",
        }),
      ).rejects.toThrow("internal server error");
    });
  });

  describe("/v2/fungible/assets_from_source", () => {
    it("handles 200 OK", async () => {
      server.use(
        rest.post("https://api.skip.build/v2/fungible/assets_from_source", (_, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              dest_assets: {
                "osmosis-1": {
                  assets: [
                    {
                      denom: "ibc/14F9BC3E44B8A9C1BE1FB08980FAB87034C9905EF17CF2F5008FC085218811CC",
                      chain_id: "cosmoshub-4",
                      origin_denom: "uosmo",
                      origin_chain_id: "osmosis-1",
                      trace: "transfer/channel-141",
                      symbol: "OSMO",
                      name: "OSMO",
                      logo_uri:
                        "https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/osmosis/asset/osmo.png",
                      decimals: 6,
                    },
                  ],
                },
                "neutron-1": {
                  assets: [
                    {
                      denom: "ibc/376222D6D9DAE23092E29740E56B758580935A6D77C24C2ABD57A6A78A1F3955",
                      chain_id: "neutron-1",
                      origin_denom: "uosmo",
                      origin_chain_id: "osmosis-1",
                      trace: "transfer/channel-10",
                      symbol: "OSMO",
                      name: "OSMO",
                      logo_uri:
                        "https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/osmosis/asset/osmo.png",
                      decimals: 6,
                    },
                  ],
                },
              },
            }),
          );
        }),
      );

      const response = await assetsFromSource({
        sourceAssetChainId: "osmosis-1",
        sourceAssetDenom: "uosmo",
        includeCw20Assets: true,
        apiUrl: "https://api.skip.build",
      });

      expect(response).toEqual({
        "osmosis-1": [
          {
            denom: "ibc/14F9BC3E44B8A9C1BE1FB08980FAB87034C9905EF17CF2F5008FC085218811CC",
            chainId: "cosmoshub-4",
            originDenom: "uosmo",
            originChainId: "osmosis-1",
            trace: "transfer/channel-141",
            symbol: "OSMO",
            name: "OSMO",
            logoUri:
              "https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/osmosis/asset/osmo.png",
            decimals: 6,
          },
        ],
        "neutron-1": [
          {
            denom: "ibc/376222D6D9DAE23092E29740E56B758580935A6D77C24C2ABD57A6A78A1F3955",
            chainId: "neutron-1",
            originDenom: "uosmo",
            originChainId: "osmosis-1",
            trace: "transfer/channel-10",
            symbol: "OSMO",
            name: "OSMO",
            logoUri:
              "https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/osmosis/asset/osmo.png",
            decimals: 6,
          },
        ],
      });
    });

    it("handles 400 Bad Request", async () => {
      server.use(
        rest.post("https://api.skip.build/v2/fungible/assets_from_source", (_, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({
              code: 3,
              message: "Invalid source_asset_chain_id",
              details: [],
            }),
          );
        }),
      );

      await expect(
        assetsFromSource({
          sourceAssetChainId: "osmosis-1",
          sourceAssetDenom: "uosmo",
          includeCw20Assets: true,
          apiUrl: "https://api.skip.build",
        }),
      ).rejects.toThrow("Invalid source_asset_chain_id");
    });

    it("handles 500 Internal Server Error", async () => {
      server.use(
        rest.post("https://api.skip.build/v2/fungible/assets_from_source", (_, res, ctx) => {
          return res(
            ctx.status(500),
            ctx.json({
              code: 2,
              message: "internal server error",
              details: [],
            }),
          );
        }),
      );

      await expect(
        assetsFromSource({
          sourceAssetChainId: "osmosis-1",
          sourceAssetDenom: "uosmo",
          includeCw20Assets: true,
          apiUrl: "https://api.skip.build",
        }),
      ).rejects.toThrow("internal server error");
    });
  });

  describe("/v2/fungible/recommend_assets", () => {
    it("handles 200 OK", async () => {
      server.use(
        rest.post("https://api.skip.build/v2/fungible/recommend_assets", (_, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              recommendation_entries: [
                {
                  recommendations: [
                    {
                      asset: {
                        denom:
                          "ibc/14F9BC3E44B8A9C1BE1FB08980FAB87034C9905EF17CF2F5008FC085218811CC",
                        chain_id: "cosmoshub-4",
                        origin_denom: "uosmo",
                        origin_chain_id: "osmosis-1",
                        trace: "transfer/channel-141",
                        symbol: "OSMO",
                        name: "OSMO",
                        logo_uri:
                          "https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/osmosis/asset/osmo.png",
                        decimals: 6,
                        is_cw20: true,
                        is_evm: true,
                        is_svm: false,
                      },
                      reason: "MOST_LIQUID",
                    },
                  ],
                },
              ],
            }),
          );
        }),
      );

      const response = await recommendAssets({
        requests: [
          {
            sourceAssetChainId: "osmosis-1",
            sourceAssetDenom: "uosmo",
            destChainId: "cosmoshub-4",
          },
        ],
        apiUrl: "https://api.skip.build",
      });

      const expected = [
        {
          recommendations: [
            {
              asset: {
                denom: "ibc/14F9BC3E44B8A9C1BE1FB08980FAB87034C9905EF17CF2F5008FC085218811CC",
                chainId: "cosmoshub-4",
                originDenom: "uosmo",
                originChainId: "osmosis-1",
                trace: "transfer/channel-141",
                symbol: "OSMO",
                name: "OSMO",
                logoUri:
                  "https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/osmosis/asset/osmo.png",
                decimals: 6,
                isCw20: true,
                isEvm: true,
                isSvm: false,
              },
              reason: "MOST_LIQUID",
            },
          ],
        },
      ];

      expect(response).toEqual(expected);
    });
  });

  describe("/v2/fungible/msgs", () => {
    it("handles 200 OK", async () => {
      server.use(
        rest.post("https://api.skip.build/v2/fungible/msgs", (_, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              msgs: [
                {
                  multi_chain_msg: {
                    chain_id: "osmosis-1",
                    path: ["osmosis-1", "cosmoshub-4"],
                    msg: '{"sender":"osmo1f2f9vryyu53gr8vhsksn66kugnxaa7k8jdpk0e","contract":"osmo1rc6h59ev8m7mdpg584v7m5t24k2ut3dy5nekjw4mdsfjysyjvv3q65m8pj","msg":{"swap_and_action":{"user_swap":{"swap_exact_coin_in":{"operations":[{"denom_in":"uosmo","denom_out":"ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2","pool":"1"}],"swap_venue_name":"osmosis-poolmanager"}},"min_coin":{"denom":"ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2","amount":"54946"},"timeout_timestamp":1693012979767514087,"post_swap_action":{"ibc_transfer":{"ibc_info":{"memo":"","receiver":"cosmos1f2f9vryyu53gr8vhsksn66kugnxaa7k86kjxet","recover_address":"osmo1f2f9vryyu53gr8vhsksn66kugnxaa7k8jdpk0e","source_channel":"channel-0"}}},"affiliates":[]}},"funds":[{"denom":"uosmo","amount":"1000000"}]}',
                    msg_type_url: "/cosmwasm.wasm.v1.MsgExecuteContract",
                  },
                },
              ],
            }),
          );
        }),
      );

      const response = await messages({
        apiUrl: "https://api.skip.build",
        sourceAssetDenom: "uosmo",
        sourceAssetChainId: "osmosis-1",
        destAssetDenom: "uatom",
        destAssetChainId: "cosmoshub-4",
        amountIn: "1000000",
        amountOut: "54906",
        addressList: [
          "cosmos1xv9tklw7d82sezh9haa573wufgy59vmwe6xxe5",
          "cosmos1xv9tklw7d82sezh9haa573wufgy59vmwe6xxe5",
        ],
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
              smartRelay: false,
              bridgeId: BridgeType.IBC,
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
        slippageTolerancePercent: "0.01",
        postRouteHandler: {
          wasmMsg: {
            contractAddress: "cosmos1xv9tklw7d82sezh9haa573wufgy59vmwe6xxe5",
            msg: "cosmwasm message",
          },
        },
        enableGasWarnings: true,
      });

      expect(response?.msgs).toEqual([
        {
          multiChainMsg: {
            chainId: "osmosis-1",
            path: ["osmosis-1", "cosmoshub-4"],
            msg: '{"sender":"osmo1f2f9vryyu53gr8vhsksn66kugnxaa7k8jdpk0e","contract":"osmo1rc6h59ev8m7mdpg584v7m5t24k2ut3dy5nekjw4mdsfjysyjvv3q65m8pj","msg":{"swap_and_action":{"user_swap":{"swap_exact_coin_in":{"operations":[{"denom_in":"uosmo","denom_out":"ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2","pool":"1"}],"swap_venue_name":"osmosis-poolmanager"}},"min_coin":{"denom":"ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2","amount":"54946"},"timeout_timestamp":1693012979767514087,"post_swap_action":{"ibc_transfer":{"ibc_info":{"memo":"","receiver":"cosmos1f2f9vryyu53gr8vhsksn66kugnxaa7k86kjxet","recover_address":"osmo1f2f9vryyu53gr8vhsksn66kugnxaa7k8jdpk0e","source_channel":"channel-0"}}},"affiliates":[]}},"funds":[{"denom":"uosmo","amount":"1000000"}]}',
            msgTypeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
          },
        },
      ]);
    });
  });

  const routeResponseJSON = {
    source_asset_denom: "uosmo",
    source_asset_chain_id: "osmosis-1",
    dest_asset_denom: "uatom",
    dest_asset_chain_id: "cosmoshub-4",
    amount_in: "1000000",
    amount_out: "54906",
    required_chain_addresses: ["osmosis-1", "cosmoshub-4"],
    operations: [
      {
        swap: {
          swap_in: {
            swap_venue: {
              name: "neutron-astroport",
              chain_id: "neutron-1",
              logo_uri:
                "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
            },
            swap_operations: [
              {
                pool: "pool-0",
                denom_in: "uosmo",
                denom_out: "uatom",
              },
            ],
            swap_amount_in: "1000000",
          },
          estimated_affiliate_fee: "1000000",
          chain_id: "neutron-1",
          from_chain_id: "neutron-1",
          denom_in: "uosmo",
          denom_out: "uatom",
          swap_venues: [
            {
              name: "neutron-astroport",
              chain_id: "neutron-1",
              logo_uri:
                "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
            },
          ],
        },
        tx_index: 0,
        amount_in: "100000",
        amount_out: "100000",
      },
      {
        transfer: {
          dest_denom: "uatom",
          supports_memo: true,
          smart_relay: false,
          bridge_id: "IBC",
          denom_in: "uosmo",
          denom_out: "uatom",
          from_chain_id: "osmosis-1",
          to_chain_id: "cosmoshub-4",
        },
        tx_index: 0,
        amount_in: "100000",
        amount_out: "100000",
      },
    ],
    chain_ids: ["osmosis-1", "cosmoshub-4"],
    does_swap: true,
    swap_venues: [
      {
        name: "osmosis-poolmanager",
        chain_id: "osmosis-1",
        logo_uri:
          "https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmosis-chain-logo.png",
      },
    ],
    txs_required: 1,
    estimated_fees: [],
    estimated_route_duration_seconds: 0,
  };

  describe("/v2/fungible/route", () => {
    it("handles 200 OK", async () => {
      server.use(
        rest.post("https://api.skip.build/v2/fungible/route", (_, res, ctx) => {
          return res(ctx.status(200), ctx.json(routeResponseJSON));
        }),
      );

      const response = await route({
        apiUrl: "https://api.skip.build",
        sourceAssetChainId: "osmosis-1",
        sourceAssetDenom: "uosmo",
        destAssetChainId: "cosmoshub-4",
        destAssetDenom: "uatom",
        amountIn: "1000000",
        smartRelay: false,
      });

      const routeResponse = {
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

      expect(response).toEqual(routeResponse);
    });
  });

  describe("/v2/fungible/venues", () => {
    it("handles 200 OK", async () => {
      server.use(
        rest.get("https://api.skip.build/v2/fungible/venues", (_, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              venues: [
                {
                  name: "neutron-astroport",
                  chain_id: "neutron-1",
                },
                {
                  name: "osmosis-poolmanager",
                  chain_id: "osmosis-1",
                },
              ],
            }),
          );
        }),
      );

      const response = await venues({
        apiUrl: "https://api.skip.build",
      });

      expect(response).toEqual([
        {
          name: "neutron-astroport",
          chainId: "neutron-1",
        },
        {
          name: "osmosis-poolmanager",
          chainId: "osmosis-1",
        },
      ]);
    });
  });

  describe("submitTransaction", () => {
    it("handles 200 OK", async () => {
      server.use(
        rest.post("https://api.skip.build/v2/tx/submit", (_, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              tx_hash: "tx_hash123",
              success: true,
            }),
          );
        }),
      );

      const response = await submitTransaction({
        apiUrl: "https://api.skip.build",
        chainId: "cosmoshub-4",
        tx: "txbytes123",
      });

      expect(response).toEqual({
        success: true,
        txHash: "tx_hash123",
      });
    });
  });

  describe("trackTransaction", () => {
    it("handles 200 OK", async () => {
      server.use(
        rest.post("https://api.skip.build/v2/tx/track", (_, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              tx_hash: "tx_hash123",
              success: true,
            }),
          );
        }),
      );

      const response = await trackTransaction({
        chainId: "cosmoshub-4",
        txHash: "tx_hash123",
        apiUrl: "https://api.skip.build",
      });

      expect(response).toEqual({
        success: true,
        txHash: "tx_hash123",
      });
    });
  });

  describe("transactionStatus", () => {
    it("handles 200 OK", async () => {
      server.use(
        rest.get("https://api.skip.build/v2/tx/status", (_, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              transfers: [
                {
                  state: "STATE_COMPLETED_SUCCESS",
                  transfer_sequence: [
                    {
                      ibc_transfer: {
                        from_chain_id: "noble-1",
                        to_chain_id: "neutron-1",
                        state: "TRANSFER_SUCCESS",
                        packet_txs: {
                          send_tx: {
                            chain_id: "noble-1",
                            tx_hash:
                              "D3E245917290FF55EED7B1908E77EE2FDCA2E35323E35F2BC63280E9D7D320B8",
                            explorer_link:
                              "https://www.mintscan.io/noble/txs/D3E245917290FF55EED7B1908E77EE2FDCA2E35323E35F2BC63280E9D7D320B8",
                          },
                          receive_tx: {
                            chain_id: "neutron-1",
                            tx_hash:
                              "ED80AE09392ECA61026255C873714C31A94A5CB975B8CCE05056300D26FC656C",
                            explorer_link:
                              "https://www.mintscan.io/neutron/transactions/ED80AE09392ECA61026255C873714C31A94A5CB975B8CCE05056300D26FC656C",
                          },
                          acknowledge_tx: {
                            chain_id: "noble-1",
                            tx_hash:
                              "9808346F9CD566F867B5313E2E8B800BFDA3D34C42D95665296049CAB745E2D1",
                            explorer_link:
                              "https://www.mintscan.io/noble/txs/9808346F9CD566F867B5313E2E8B800BFDA3D34C42D95665296049CAB745E2D1",
                          },
                          timeout_tx: null,
                          error: null,
                        },
                        src_chain_id: "noble-1",
                        dst_chain_id: "neutron-1",
                      },
                    },
                  ],
                  next_blocking_transfer: null,
                  transfer_asset_release: {
                    chain_id: "neutron-1",
                    denom: "ibc/B559A80D62249C8AA07A380E2A2BEA6E5CA9A6F079C912C3A9E9B494105E4F81",
                    released: true,
                  },
                  error: null,
                },
              ],
              state: "STATE_COMPLETED_SUCCESS",
              transfer_sequence: [
                {
                  ibc_transfer: {
                    from_chain_id: "noble-1",
                    to_chain_id: "neutron-1",
                    state: "TRANSFER_SUCCESS",
                    packet_txs: {
                      send_tx: {
                        chain_id: "noble-1",
                        tx_hash: "D3E245917290FF55EED7B1908E77EE2FDCA2E35323E35F2BC63280E9D7D320B8",
                        explorer_link:
                          "https://www.mintscan.io/noble/txs/D3E245917290FF55EED7B1908E77EE2FDCA2E35323E35F2BC63280E9D7D320B8",
                      },
                      receive_tx: {
                        chain_id: "neutron-1",
                        tx_hash: "ED80AE09392ECA61026255C873714C31A94A5CB975B8CCE05056300D26FC656C",
                        explorer_link:
                          "https://www.mintscan.io/neutron/transactions/ED80AE09392ECA61026255C873714C31A94A5CB975B8CCE05056300D26FC656C",
                      },
                      acknowledge_tx: {
                        chain_id: "noble-1",
                        tx_hash: "9808346F9CD566F867B5313E2E8B800BFDA3D34C42D95665296049CAB745E2D1",
                        explorer_link:
                          "https://www.mintscan.io/noble/txs/9808346F9CD566F867B5313E2E8B800BFDA3D34C42D95665296049CAB745E2D1",
                      },
                      timeout_tx: null,
                      error: null,
                    },
                    src_chain_id: "noble-1",
                    dst_chain_id: "neutron-1",
                  },
                },
              ],
              next_blocking_transfer: null,
              transfer_asset_release: {
                chain_id: "neutron-1",
                denom: "ibc/B559A80D62249C8AA07A380E2A2BEA6E5CA9A6F079C912C3A9E9B494105E4F81",
                released: true,
              },
              error: null,
              status: "STATE_COMPLETED",
            }),
          );
        }),
      );

      const response = await transactionStatus({
        chainId: "cosmoshub-4",
        txHash: "tx_hash123",
        apiUrl: "https://api.skip.build",
      });

      expect(response).toEqual({
        status: "STATE_COMPLETED",
        nextBlockingTransfer: null,
        transferSequence: [
          {
            ibcTransfer: {
              fromChainId: "noble-1",
              toChainId: "neutron-1",
              state: "TRANSFER_SUCCESS",
              packetTxs: {
                sendTx: {
                  txHash: "D3E245917290FF55EED7B1908E77EE2FDCA2E35323E35F2BC63280E9D7D320B8",
                  chainId: "noble-1",
                  explorerLink:
                    "https://www.mintscan.io/noble/txs/D3E245917290FF55EED7B1908E77EE2FDCA2E35323E35F2BC63280E9D7D320B8",
                },
                receiveTx: {
                  txHash: "ED80AE09392ECA61026255C873714C31A94A5CB975B8CCE05056300D26FC656C",
                  chainId: "neutron-1",
                  explorerLink:
                    "https://www.mintscan.io/neutron/transactions/ED80AE09392ECA61026255C873714C31A94A5CB975B8CCE05056300D26FC656C",
                },
                acknowledgeTx: {
                  txHash: "9808346F9CD566F867B5313E2E8B800BFDA3D34C42D95665296049CAB745E2D1",
                  chainId: "noble-1",
                  explorerLink:
                    "https://www.mintscan.io/noble/txs/9808346F9CD566F867B5313E2E8B800BFDA3D34C42D95665296049CAB745E2D1",
                },
                timeoutTx: null,
                error: null,
              },
              srcChainId: "noble-1",
              dstChainId: "neutron-1",
            },
          },
        ],
        transferAssetRelease: {
          chainId: "neutron-1",
          denom: "ibc/B559A80D62249C8AA07A380E2A2BEA6E5CA9A6F079C912C3A9E9B494105E4F81",
          released: true,
        },
        error: null,
        state: "STATE_COMPLETED_SUCCESS",
        transfers: [
          {
            transferSequence: [
              {
                ibcTransfer: {
                  fromChainId: "noble-1",
                  toChainId: "neutron-1",
                  state: "TRANSFER_SUCCESS",
                  packetTxs: {
                    sendTx: {
                      txHash: "D3E245917290FF55EED7B1908E77EE2FDCA2E35323E35F2BC63280E9D7D320B8",
                      chainId: "noble-1",
                      explorerLink:
                        "https://www.mintscan.io/noble/txs/D3E245917290FF55EED7B1908E77EE2FDCA2E35323E35F2BC63280E9D7D320B8",
                    },
                    receiveTx: {
                      txHash: "ED80AE09392ECA61026255C873714C31A94A5CB975B8CCE05056300D26FC656C",
                      chainId: "neutron-1",
                      explorerLink:
                        "https://www.mintscan.io/neutron/transactions/ED80AE09392ECA61026255C873714C31A94A5CB975B8CCE05056300D26FC656C",
                    },
                    acknowledgeTx: {
                      txHash: "9808346F9CD566F867B5313E2E8B800BFDA3D34C42D95665296049CAB745E2D1",
                      chainId: "noble-1",
                      explorerLink:
                        "https://www.mintscan.io/noble/txs/9808346F9CD566F867B5313E2E8B800BFDA3D34C42D95665296049CAB745E2D1",
                    },
                    timeoutTx: null,
                    error: null,
                  },
                  srcChainId: "noble-1",
                  dstChainId: "neutron-1",
                },
              },
            ],
            transferAssetRelease: {
              chainId: "neutron-1",
              denom: "ibc/B559A80D62249C8AA07A380E2A2BEA6E5CA9A6F079C912C3A9E9B494105E4F81",
              released: true,
            },
            error: null,
            state: "STATE_COMPLETED_SUCCESS",
            nextBlockingTransfer: null,
          },
        ],
      });
    });

    it("handle 200 OK error with retry options", async () => {
      let retryCount = 0;
      const maxRetries = 3;
      server.use(
        rest.get("https://api.skip.build/v2/tx/status", (_, res, ctx) => {
          retryCount++;
          if (retryCount >= maxRetries) {
            return res(
              ctx.status(200),
              ctx.json({
                transfers: [
                  {
                    state: "STATE_COMPLETED_SUCCESS",
                    transfer_sequence: [
                      {
                        ibc_transfer: {
                          from_chain_id: "noble-1",
                          to_chain_id: "neutron-1",
                          state: "TRANSFER_SUCCESS",
                          packet_txs: {
                            send_tx: {
                              chain_id: "noble-1",
                              tx_hash:
                                "D3E245917290FF55EED7B1908E77EE2FDCA2E35323E35F2BC63280E9D7D320B8",
                              explorer_link:
                                "https://www.mintscan.io/noble/txs/D3E245917290FF55EED7B1908E77EE2FDCA2E35323E35F2BC63280E9D7D320B8",
                            },
                            receive_tx: {
                              chain_id: "neutron-1",
                              tx_hash:
                                "ED80AE09392ECA61026255C873714C31A94A5CB975B8CCE05056300D26FC656C",
                              explorer_link:
                                "https://www.mintscan.io/neutron/transactions/ED80AE09392ECA61026255C873714C31A94A5CB975B8CCE05056300D26FC656C",
                            },
                            acknowledge_tx: {
                              chain_id: "noble-1",
                              tx_hash:
                                "9808346F9CD566F867B5313E2E8B800BFDA3D34C42D95665296049CAB745E2D1",
                              explorer_link:
                                "https://www.mintscan.io/noble/txs/9808346F9CD566F867B5313E2E8B800BFDA3D34C42D95665296049CAB745E2D1",
                            },
                            timeout_tx: null,
                            error: null,
                          },
                          src_chain_id: "noble-1",
                          dst_chain_id: "neutron-1",
                        },
                      },
                    ],
                    next_blocking_transfer: null,
                    transfer_asset_release: {
                      chain_id: "neutron-1",
                      denom: "ibc/B559A80D62249C8AA07A380E2A2BEA6E5CA9A6F079C912C3A9E9B494105E4F81",
                      released: true,
                    },
                    error: null,
                  },
                ],
                state: "STATE_COMPLETED_SUCCESS",
                transfer_sequence: [
                  {
                    ibc_transfer: {
                      from_chain_id: "noble-1",
                      to_chain_id: "neutron-1",
                      state: "TRANSFER_SUCCESS",
                      packet_txs: {
                        send_tx: {
                          chain_id: "noble-1",
                          tx_hash:
                            "D3E245917290FF55EED7B1908E77EE2FDCA2E35323E35F2BC63280E9D7D320B8",
                          explorer_link:
                            "https://www.mintscan.io/noble/txs/D3E245917290FF55EED7B1908E77EE2FDCA2E35323E35F2BC63280E9D7D320B8",
                        },
                        receive_tx: {
                          chain_id: "neutron-1",
                          tx_hash:
                            "ED80AE09392ECA61026255C873714C31A94A5CB975B8CCE05056300D26FC656C",
                          explorer_link:
                            "https://www.mintscan.io/neutron/transactions/ED80AE09392ECA61026255C873714C31A94A5CB975B8CCE05056300D26FC656C",
                        },
                        acknowledge_tx: {
                          chain_id: "noble-1",
                          tx_hash:
                            "9808346F9CD566F867B5313E2E8B800BFDA3D34C42D95665296049CAB745E2D1",
                          explorer_link:
                            "https://www.mintscan.io/noble/txs/9808346F9CD566F867B5313E2E8B800BFDA3D34C42D95665296049CAB745E2D1",
                        },
                        timeout_tx: null,
                        error: null,
                      },
                      src_chain_id: "noble-1",
                      dst_chain_id: "neutron-1",
                    },
                  },
                ],
                next_blocking_transfer: null,
                transfer_asset_release: {
                  chain_id: "neutron-1",
                  denom: "ibc/B559A80D62249C8AA07A380E2A2BEA6E5CA9A6F079C912C3A9E9B494105E4F81",
                  released: true,
                },
                error: null,
                status: "STATE_COMPLETED",
              }),
            );
          }
          return res(
            ctx.status(500),
            ctx.json({
              code: 2,
              message: "internal server error",
              details: [],
            }),
          );
        }),
      );

      const response = await transactionStatus({
        chainId: "cosmoshub-4",
        txHash: "tx_hash123",
        apiUrl: "https://api.skip.build",
      });

      expect(response).toEqual({
        status: "STATE_COMPLETED",
        nextBlockingTransfer: null,
        transferSequence: [
          {
            ibcTransfer: {
              fromChainId: "noble-1",
              toChainId: "neutron-1",
              state: "TRANSFER_SUCCESS",
              packetTxs: {
                sendTx: {
                  txHash: "D3E245917290FF55EED7B1908E77EE2FDCA2E35323E35F2BC63280E9D7D320B8",
                  chainId: "noble-1",
                  explorerLink:
                    "https://www.mintscan.io/noble/txs/D3E245917290FF55EED7B1908E77EE2FDCA2E35323E35F2BC63280E9D7D320B8",
                },
                receiveTx: {
                  txHash: "ED80AE09392ECA61026255C873714C31A94A5CB975B8CCE05056300D26FC656C",
                  chainId: "neutron-1",
                  explorerLink:
                    "https://www.mintscan.io/neutron/transactions/ED80AE09392ECA61026255C873714C31A94A5CB975B8CCE05056300D26FC656C",
                },
                acknowledgeTx: {
                  txHash: "9808346F9CD566F867B5313E2E8B800BFDA3D34C42D95665296049CAB745E2D1",
                  chainId: "noble-1",
                  explorerLink:
                    "https://www.mintscan.io/noble/txs/9808346F9CD566F867B5313E2E8B800BFDA3D34C42D95665296049CAB745E2D1",
                },
                timeoutTx: null,
                error: null,
              },
              srcChainId: "noble-1",
              dstChainId: "neutron-1",
            },
          },
        ],
        transferAssetRelease: {
          chainId: "neutron-1",
          denom: "ibc/B559A80D62249C8AA07A380E2A2BEA6E5CA9A6F079C912C3A9E9B494105E4F81",
          released: true,
        },
        error: null,
        state: "STATE_COMPLETED_SUCCESS",
        transfers: [
          {
            transferSequence: [
              {
                ibcTransfer: {
                  fromChainId: "noble-1",
                  toChainId: "neutron-1",
                  state: "TRANSFER_SUCCESS",
                  packetTxs: {
                    sendTx: {
                      txHash: "D3E245917290FF55EED7B1908E77EE2FDCA2E35323E35F2BC63280E9D7D320B8",
                      chainId: "noble-1",
                      explorerLink:
                        "https://www.mintscan.io/noble/txs/D3E245917290FF55EED7B1908E77EE2FDCA2E35323E35F2BC63280E9D7D320B8",
                    },
                    receiveTx: {
                      txHash: "ED80AE09392ECA61026255C873714C31A94A5CB975B8CCE05056300D26FC656C",
                      chainId: "neutron-1",
                      explorerLink:
                        "https://www.mintscan.io/neutron/transactions/ED80AE09392ECA61026255C873714C31A94A5CB975B8CCE05056300D26FC656C",
                    },
                    acknowledgeTx: {
                      txHash: "9808346F9CD566F867B5313E2E8B800BFDA3D34C42D95665296049CAB745E2D1",
                      chainId: "noble-1",
                      explorerLink:
                        "https://www.mintscan.io/noble/txs/9808346F9CD566F867B5313E2E8B800BFDA3D34C42D95665296049CAB745E2D1",
                    },
                    timeoutTx: null,
                    error: null,
                  },
                  srcChainId: "noble-1",
                  dstChainId: "neutron-1",
                },
              },
            ],
            transferAssetRelease: {
              chainId: "neutron-1",
              denom: "ibc/B559A80D62249C8AA07A380E2A2BEA6E5CA9A6F079C912C3A9E9B494105E4F81",
              released: true,
            },
            error: null,
            state: "STATE_COMPLETED_SUCCESS",
            nextBlockingTransfer: null,
          },
        ],
      });
    });

    it("handle 500 error with retry options", async () => {
      let retryCount = 0;
      const maxRetries = 2;
      server.use(
        rest.get("https://api.skip.build/v2/tx/status", (_, res, ctx) => {
          retryCount++;
          if (retryCount >= maxRetries) {
            return res(
              ctx.status(200),
              ctx.json({
                status: "STATE_COMPLETED",
                transfer_sequence: [
                  {
                    ibc_transfer: {
                      from_chain_id: "axelar-dojo-1",
                      to_chain_id: "osmosis-1",
                      src_chain_id: "axelar-dojo-1",
                      dst_chain_id: "osmosis-1",
                      state: "TRANSFER_SUCCESS",
                      packet_txs: {
                        send_tx: {
                          chain_id: "axelar-dojo-1",
                          tx_hash:
                            "AAEA76709215A808AF6D7FC2B8FBB8746BC1F196E46FFAE84B79C6F6CD0A79C9",
                        },
                        receive_tx: {
                          chain_id: "osmosis-1",
                          tx_hash:
                            "082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D",
                        },
                        acknowledge_tx: {
                          chain_id: "axelar-dojo-1",
                          tx_hash:
                            "C9A36F94A5B2CA9C7ABF20402561E46FD8B80EBAC4F0D5B7C01F978E34285CCA",
                        },
                        timeout_tx: null,
                        error: null,
                      },
                    },
                  },
                  {
                    ibc_transfer: {
                      from_chain_id: "osmosis-1",
                      to_chain_id: "cosmoshub-4",
                      src_chain_id: "osmosis-1",
                      dst_chain_id: "cosmoshub-4",
                      state: "TRANSFER_SUCCESS",
                      packet_txs: {
                        send_tx: {
                          chain_id: "osmosis-1",
                          tx_hash:
                            "082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D",
                        },
                        receive_tx: {
                          chain_id: "cosmoshub-4",
                          tx_hash:
                            "913E2542EBFEF2E885C19DD9C4F8ECB6ADAFFE59D60BB108FAD94FBABF9C5671",
                        },
                        acknowledge_tx: {
                          chain_id: "osmosis-1",
                          tx_hash:
                            "1EDB2886E6FD59D6B9C096FBADB1A52585745694F4DFEE3A3CD3FF0153307EBC",
                        },
                        timeout_tx: null,
                        error: null,
                      },
                    },
                  },
                ],
                next_blocking_transfer: null,
                transfer_asset_release: {
                  chain_id: "cosmoshub-4",
                  denom: "uatom",
                  amount: "999",
                  released: true,
                },
                error: null,
                state: "STATE_COMPLETED",
                transfers: [
                  {
                    state: "STATE_COMPLETED_SUCCESS",
                    transfer_sequence: [
                      {
                        ibc_transfer: {
                          from_chain_id: "src-chain",
                          to_chain_id: "dest-chain",
                          src_chain_id: "src-chain",
                          dst_chain_id: "dest-chain",
                          state: "TRANSFER_SUCCESS",
                          packet_txs: {
                            send_tx: null,
                            receive_tx: null,
                            acknowledge_tx: null,
                            timeout_tx: null,
                            error: null,
                          },
                        },
                      },
                    ],
                    next_blocking_transfer: {
                      transfer_sequence_index: 1,
                    },
                    transfer_asset_release: {
                      chain_id: "cosmoshub-4",
                      denom: "uatom",
                      amount: "999",
                      released: true,
                    },
                    error: null,
                  },
                ],
              }),
            );
          }
          return res(
            ctx.status(500),
            ctx.json({
              code: 2,
              message: "internal server error",
              details: [],
            }),
          );
        }),
      );

      try {
        await transactionStatus({
          chainId: "cosmoshub-4",
          txHash: "tx_hash123",
          apiUrl: "https://api.skip.build",
        });
      } catch (error) {
        expect(error).toEqual(new Error("internal server error"));
      }
    });
  });

  describe("ibcOriginAssets", () => {
    it("returns a list of origin assets", async () => {
      const expectedResult = {
        origin_assets: [
          {
            asset: {
              denom: "uosmo",
              chain_id: "osmosis-1",
              origin_denom: "uosmo",
              origin_chain_id: "osmosis-1",
              trace: "",
              is_cw20: false,
              is_evm: false,
              is_svm: false,
              token_contract: "token-contract-value",
              symbol: "OSMO",
              name: "OSMO",
              logo_uri:
                "https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmo.png",
              decimals: 6,
              description: "The native token of Osmosis",
              coingecko_id: "osmosis",
              recommended_symbol: "OSMO",
            },
          },
          {
            asset: {
              denom: "uusdc",
              chain_id: "axelar-dojo-1",
              origin_denom: "uusdc",
              origin_chain_id: "axelar-dojo-1",
              trace: "",
              is_cw20: false,
              is_evm: false,
              is_svm: false,
              token_contract: "token-contract-value",
              symbol: "USDC",
              name: "USDC",
              logo_uri:
                "https://raw.githubusercontent.com/cosmos/chain-registry/master/axelar/images/usdc.png",
              decimals: 6,
              description: "Circle's stablecoin on Axelar",
              coingecko_id: "axlusdc",
              recommended_symbol: "USDC.axl",
            },
          },
        ],
      };

      server.use(
        rest.post("https://api.skip.build/v2/fungible/ibc_origin_assets", (_, res, ctx) => {
          return res(ctx.status(200), ctx.json(expectedResult));
        }),
      );

      const params = {
        assets: [
          {
            denom: "ibc/14F9BC3E44B8A9C1BE1FB08980FAB87034C9905EF17CF2F5008FC085218811CC",
            chainId: "cosmoshub-4",
          },
        ],
        apiUrl: "https://api.skip.build",
      };

      const result = await ibcOriginAssets(params);

      expect(result).toEqual(toCamel(expectedResult)?.originAssets);
    });
  });

  describe("getRecommendedGasPrice", () => {
    it("returns the recommended gas price for a chain", async () => {
      const result = await getRecommendedGasPrice({
        chainId: "osmosis-1",
        apiUrl: "https://api.skip.build",
      });

      expect(result?.denom).toEqual("uosmo");
    }, 30000);

    it("returns the recommended gas price for Noble (no staking token)", async () => {
      const result = await getRecommendedGasPrice({
        chainId: "noble-1",
        apiUrl: "https://api.skip.build",
      });

      expect(result?.denom).toEqual("uusdc");
    }, 30000);
  });

  describe("getFeeInfoForChain", () => {
    it("returns the fee info for dymension", async () => {
      const feeInfo = await getFeeInfoForChain({
        chainId: "dymension_1100-1",
        apiUrl: "https://api.skip.build",
      });
      expect(feeInfo?.denom).toEqual("adym");
    });
  });

  describe("bridges", () => {
    it("returns a list of bridges", async () => {
      server.use(
        rest.get(`${SKIP_API_URL}/v2/info/bridges`, (_, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              bridges: [
                {
                  id: "IBC",
                  name: "IBC",
                  logo_uri:
                    "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/bridges/ibc/logo.svg",
                },
                {
                  id: "AXELAR",
                  name: "Axelar",
                  logo_uri:
                    "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/bridges/axelar/logo.svg",
                },
                {
                  id: "CCTP",
                  name: "CCTP",
                  logo_uri:
                    "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/bridges/cctp/logo.svg",
                },
              ],
            }),
          );
        }),
      );

      const result = await bridges({
        apiUrl: "https://api.skip.build",
      });

      expect(result).toEqual([
        {
          id: "IBC",
          name: "IBC",
          logoUri:
            "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/bridges/ibc/logo.svg",
        },
        {
          id: "AXELAR",
          name: "Axelar",
          logoUri:
            "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/bridges/axelar/logo.svg",
        },
        {
          id: "CCTP",
          name: "CCTP",
          logoUri:
            "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/bridges/cctp/logo.svg",
        },
      ]);
    });
  });

  describe("validateChainIdsToAffiliates", () => {
    it("returns an error when basisPointsFee is not included in one of the affiliates", async () => {
      try {
        setApiOptions({
          chainIdsToAffiliates: {
            chain1: {
              affiliates: [
                {
                  basisPointsFee: "100",
                  address: "address",
                },
              ],
            },
            chain2: {
              affiliates: [
                {
                  address: "address",
                } as never,
              ],
            },
          },
        });
      } catch (error) {
        expect(error).toEqual(new Error("basisPointFee must exist in each affiliate"));
      }
    });

    it("returns an error when address is not included in one of the affiliates", async () => {
      try {
        setApiOptions({
          chainIdsToAffiliates: {
            chain1: {
              affiliates: [
                {
                  basisPointsFee: "100",
                  address: "address",
                },
              ],
            },
            chain2: {
              affiliates: [
                {
                  address: "",
                } as never,
              ],
            },
          },
        });
      } catch (error) {
        expect(error).toEqual(new Error("basisPointFee must exist in each affiliate"));
      }
    });

    it("returns an error when affiliate bps differs (only comparing 2 bps)", async () => {
      try {
        setApiOptions({
          chainIdsToAffiliates: {
            chain1: {
              affiliates: [
                {
                  basisPointsFee: "50",
                  address: "address",
                },
              ],
            },
            chain2: {
              affiliates: [
                {
                  basisPointsFee: "100",
                  address: "address",
                },
              ],
            },
          },
        });
      } catch (error) {
        expect(error).toEqual(
          new Error(
            "basisPointFee does not add up to the same number for each chain in chainIdsToAffiliates",
          ),
        );
      }
    });

    it("returns an error when first affiliate bps are the same but total differs", async () => {
      try {
        setApiOptions({
          chainIdsToAffiliates: {
            chain1: {
              affiliates: [
                {
                  basisPointsFee: "100",
                  address: "address",
                },
              ],
            },
            chain2: {
              affiliates: [
                {
                  basisPointsFee: "100",
                  address: "address",
                },
                {
                  basisPointsFee: "50",
                  address: "address",
                },
              ],
            },
          },
        });
      } catch (error) {
        expect(error).toEqual(
          new Error(
            "basisPointFee does not add up to the same number for each chain in chainIdsToAffiliates",
          ),
        );
      }
    });

    it("returns an error when first and last affiliates bps are the same but total bps differs", async () => {
      try {
        setApiOptions({
          chainIdsToAffiliates: {
            chain1: {
              affiliates: [
                {
                  basisPointsFee: "100",
                  address: "address",
                },
                {
                  basisPointsFee: "10",
                  address: "address",
                },
                {
                  basisPointsFee: "50",
                  address: "address",
                },
              ],
            },
            chain2: {
              affiliates: [
                {
                  basisPointsFee: "100",
                  address: "address",
                },
                {
                  basisPointsFee: "50",
                  address: "address",
                },
              ],
            },
          },
        });
      } catch (error) {
        expect(error).toEqual(
          new Error(
            "basisPointFee does not add up to the same number for each chain in chainIdsToAffiliates",
          ),
        );
      }
    });

    it("does not return an error when affiliate bps are exactly the same", async () => {
      let errorOccurred = false;
      try {
        setApiOptions({
          chainIdsToAffiliates: {
            chain1: {
              affiliates: [
                {
                  basisPointsFee: "100",
                  address: "address",
                },
              ],
            },
            chain2: {
              affiliates: [
                {
                  basisPointsFee: "100",
                  address: "address",
                },
              ],
            },
          },
        });
      } catch (_error) {
        errorOccurred = true;
      }
      expect(errorOccurred).toBe(false);
    });

    it("does not return an error if 2 bps on first chain adds up to 2nd chains first bps", async () => {
      let errorOccurred = false;
      try {
        setApiOptions({
          chainIdsToAffiliates: {
            chain1: {
              affiliates: [
                {
                  basisPointsFee: "50",
                  address: "address",
                },
                {
                  basisPointsFee: "50",
                  address: "address",
                },
              ],
            },
            chain2: {
              affiliates: [
                {
                  basisPointsFee: "100",
                  address: "address",
                },
              ],
            },
          },
        });
      } catch (_error) {
        errorOccurred = true;
      }
      expect(errorOccurred).toBe(false);
    });

    it("does not return an error if 3 chains are passed and each have different number of affiliates but still add up to the same total", async () => {
      let errorOccurred = false;
      try {
        setApiOptions({
          chainIdsToAffiliates: {
            chain1: {
              affiliates: [
                {
                  basisPointsFee: "50",
                  address: "address",
                },
                {
                  basisPointsFee: "100",
                  address: "address",
                },
                {
                  basisPointsFee: "150",
                  address: "address",
                },
              ],
            },
            chain2: {
              affiliates: [
                {
                  basisPointsFee: "100",
                  address: "address",
                },
                {
                  basisPointsFee: "52",
                  address: "address",
                },
                {
                  basisPointsFee: "38",
                  address: "address",
                },
                {
                  basisPointsFee: "110",
                  address: "address",
                },
              ],
            },
            chain3: {
              affiliates: [
                {
                  basisPointsFee: "300",
                  address: "address",
                },
              ],
            },
          },
        });
      } catch (_error) {
        errorOccurred = true;
      }
      expect(errorOccurred).toBe(false);
    });
  });
});
