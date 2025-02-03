import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { SKIP_API_URL, SkipClient } from '../client';
import {
  Chain,
  ChainJSON,
  DenomWithChainID,
  originAssetsResponseFromJSON,
  OriginAssetsResponseJSON,
  RecommendationEntry,
  RouteResponse,
  RouteResponseJSON,
} from '../types';
import createHash from 'create-hash';
import { createCachingMiddleware, CustomCache } from 'src/cache';
import { vi, Mock } from 'vitest';

export const server = setupServer();


describe('Caching Middleware', () => {
  let cache: CustomCache;
  let cacheDurationMs: number;
  let cachingMiddleware: ReturnType<typeof createCachingMiddleware>;
  let fn: Mock<[string], Promise<string>>;

  // Setup before each test
  beforeEach(() => {
    cache = CustomCache.getInstance();
    cache.clear();

    cacheDurationMs = 1000; // 1 second
    cachingMiddleware = createCachingMiddleware(cache, { cacheDurationMs });

    fn = vi.fn(async (arg: string) => {
      return `result for ${arg}`;
    });
  });

  // Clean up after each test
  afterEach(() => {
    vi.useRealTimers();
  });

  it('should cache results and return cached data if within cache duration', async () => {
    const key = 'testKey';
    const args = ['testArg'];

    const result1 = await cachingMiddleware(key, fn, args as any);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(result1).toEqual('result for testArg');

    const result2 = await cachingMiddleware(key, fn, args as any);

    expect(fn).toHaveBeenCalledTimes(1); // Should not be called again
    expect(result2).toEqual('result for testArg');
  });

  it('should call function again and update cache if cache is expired', async () => {
    vi.useFakeTimers();

    const key = 'testKey';
    const args = ['testArg'];

    const result1 = await cachingMiddleware(key, fn, args as any);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(result1).toEqual('result for testArg');

    // Advance time by cacheDurationMs + 1 to expire the cache
    vi.advanceTimersByTime(cacheDurationMs + 1);

    const result2 = await cachingMiddleware(key, fn, args as any);

    expect(fn).toHaveBeenCalledTimes(2); // Function should be called again
    expect(result2).toEqual('result for testArg');
  });

  it('should cache different results for different arguments', async () => {
    const key = 'testKey';

    const args1 = ['testArg1'];
    const args2 = ['testArg2'];

    const result1 = await cachingMiddleware(key, fn, args1 as any);
    const result2 = await cachingMiddleware(key, fn, args2 as any);

    expect(fn).toHaveBeenCalledTimes(2);
    expect(result1).toEqual('result for testArg1');
    expect(result2).toEqual('result for testArg2');

    // Subsequent calls with the same arguments should return cached results
    const result3 = await cachingMiddleware(key, fn, args1 as any);
    const result4 = await cachingMiddleware(key, fn, args2 as any);

    expect(fn).toHaveBeenCalledTimes(2); // Function should not be called again
    expect(result3).toEqual('result for testArg1');
    expect(result4).toEqual('result for testArg2');
  });

  it('should cache different results for different keys even with same arguments', async () => {
    const key1 = 'testKey1';
    const key2 = 'testKey2';
    const args = ['testArg'];

    const result1 = await cachingMiddleware(key1, fn, args as any);
    const result2 = await cachingMiddleware(key2, fn, args as any);

    expect(fn).toHaveBeenCalledTimes(2);
    expect(result1).toEqual('result for testArg');
    expect(result2).toEqual('result for testArg');
  });

  it('should generate correct cache key based on key and arguments', async () => {
    const key = 'testKey';
    const args = ['testArg'];

    const argsHash = createHash('md5').update(JSON.stringify(args as any)).digest('hex');
    const expectedCacheKey = `${key}:${argsHash}`;

    await cachingMiddleware(key, fn, args as any);

    expect(cache.get(expectedCacheKey)).toBeDefined();
  });

  it('should not cache failed requests', async () => {
    const errorFn = vi.fn(async () => {
      throw new Error('Test error');
    });

    const key = 'errorKey';
    const args = ['errorArg'];

    await expect(cachingMiddleware(key, errorFn, args as any)).rejects.toThrow('Test error');
    expect(errorFn).toHaveBeenCalledTimes(1);

    // Retry the function to ensure it gets called again since it failed previously
    await expect(cachingMiddleware(key, errorFn, args as any)).rejects.toThrow('Test error');
    expect(errorFn).toHaveBeenCalledTimes(2);
  });

  it('should cache resolved promises even if they take time to resolve', async () => {
    const slowFn = vi.fn(
      (arg: string) =>
        new Promise((resolve) => setTimeout(() => resolve(`slow result for ${arg}`), 500))
    );

    const key = 'slowKey';
    const args = ['slowArg'];

    const result1 = await cachingMiddleware(key, slowFn, args as any);
    expect(slowFn).toHaveBeenCalledTimes(1);
    expect(result1).toEqual('slow result for slowArg');

    const result2 = await cachingMiddleware(key, slowFn, args as any);
    expect(slowFn).toHaveBeenCalledTimes(1); // Should not be called again
    expect(result2).toEqual('slow result for slowArg');
  });

  it('should correctly handle functions with multiple arguments', async () => {
    const multiArgFn = vi.fn(async (arg1: string, arg2: number) => {
      return `result for ${arg1} and ${arg2}`;
    });

    const key = 'multiArgKey';
    const args = ['arg1', 42];

    const result1 = await cachingMiddleware(key, multiArgFn, args as any);
    expect(multiArgFn).toHaveBeenCalledTimes(1);
    expect(result1).toEqual('result for arg1 and 42');

    const result2 = await cachingMiddleware(key, multiArgFn, args as any);
    expect(multiArgFn).toHaveBeenCalledTimes(1); // Should not be called again
    expect(result2).toEqual('result for arg1 and 42');
  });
});

describe('client', () => {
  beforeAll(() => server.listen());

  afterEach(() => server.resetHandlers());

  afterAll(() => server.close());

  describe('/v2/info/chains', () => {
    it('handles 200 OK', async () => {
      server.use(
        rest.get('https://api.skip.build/v2/info/chains', (_, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              chains: [
                {
                  chain_name: 'osmosis',
                  chain_id: 'osmosis-1',
                  pfm_enabled: true,
                  cosmos_sdk_version: 'v0.47.3',
                  chain_type: 'cosmos',
                  modules: {
                    'github.com/cosmos/ibc-go': {
                      path: 'github.com/cosmos/ibc-go/v4',
                      version: 'v4.3.1',
                      sum: 'h1:xbg0CaCdxK3lvgGvSaI91ROOLd7s30UqEcexH6Ba4Ys=',
                    },
                    'github.com/osmosis-labs/osmosis/x/ibc-hooks': {
                      path: 'github.com/osmosis-labs/osmosis/x/ibc-hooks',
                      version: 'v0.0.7',
                      sum: 'h1:rd5guXn/SF6i66PO5rlGaDK0AT81kCpiLixyQ5EJ6Yg=',
                    },
                    'github.com/strangelove-ventures/packet-forward-middleware':
                    {
                      path: 'github.com/strangelove-ventures/packet-forward-middleware/v4',
                      version: 'v4.0.5',
                      sum: 'h1:KKUqeGhVBK38+1LwThC8IeIcsJZ6COX5kvhiJroFqCM=',
                    },
                  },
                  cosmos_module_support: {
                    authz: true,
                    feegrant: false,
                  },
                  supports_memo: true,
                  logo_uri:
                    'https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmosis-chain-logo.png',
                  bech32_prefix: 'osmo',
                  ibc_capabilities: {
                    cosmos_pfm: true,
                    cosmos_ibc_hooks: true,
                    cosmos_memo: true,
                    cosmos_autopilot: false,
                  },
                  fee_assets: [
                    {
                      denom: 'uosmo',
                      gas_price: {
                        low: '0.0025',
                        average: '0.025',
                        high: '0.04',
                      },
                    },
                  ],
                  is_testnet: false,
                },
              ] as ChainJSON[],
            })
          );
        })
      );

      const client = new SkipClient({
        apiURL: SKIP_API_URL,
        cacheDurationMs: 0
      });
      const response = await client.chains();

      expect(response).toEqual([
        {
          chainName: 'osmosis',
          chainID: 'osmosis-1',
          pfmEnabled: true,
          cosmosSDKVersion: 'v0.47.3',
          chainType: 'cosmos',
          isTestnet: false,
          modules: {
            'github.com/cosmos/ibc-go': {
              path: 'github.com/cosmos/ibc-go/v4',
              version: 'v4.3.1',
              sum: 'h1:xbg0CaCdxK3lvgGvSaI91ROOLd7s30UqEcexH6Ba4Ys=',
            },
            'github.com/osmosis-labs/osmosis/x/ibc-hooks': {
              path: 'github.com/osmosis-labs/osmosis/x/ibc-hooks',
              version: 'v0.0.7',
              sum: 'h1:rd5guXn/SF6i66PO5rlGaDK0AT81kCpiLixyQ5EJ6Yg=',
            },
            'github.com/strangelove-ventures/packet-forward-middleware': {
              path: 'github.com/strangelove-ventures/packet-forward-middleware/v4',
              version: 'v4.0.5',
              sum: 'h1:KKUqeGhVBK38+1LwThC8IeIcsJZ6COX5kvhiJroFqCM=',
            },
          },
          cosmosModuleSupport: {
            authz: true,
            feegrant: false,
          },
          supportsMemo: true,
          logoURI:
            'https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmosis-chain-logo.png',
          bech32Prefix: 'osmo',
          ibcCapabilities: {
            cosmosPfm: true,
            cosmosIbcHooks: true,
            cosmosMemo: true,
            cosmosAutopilot: false,
          },
          feeAssets: [
            {
              denom: 'uosmo',
              gasPrice: {
                low: '0.0025',
                average: '0.025',
                high: '0.04',
              },
            },
          ],
        },
      ] as Chain[]);
    });
  });

  describe('/v2/fungible/assets', () => {
    it('handles 200 OK', async () => {
      server.use(
        rest.get('https://api.skip.build/v2/fungible/assets', (_, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              chain_to_assets_map: {
                'cosmoshub-4': {
                  assets: [
                    {
                      denom:
                        'ibc/6B8A3F5C2AD51CD6171FA41A7E8C35AD594AB69226438DB94450436EA57B3A89',
                      chain_id: 'cosmoshub-4',
                      origin_denom: 'ustrd',
                      origin_chain_id: 'stride-1',
                      is_cw20: false,
                      trace: 'transfer/channel-391',
                      symbol: 'STRD',
                      name: 'STRD',
                      logo_uri:
                        'https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/stride/asset/strd.png',
                      decimals: 6,
                    },
                    {
                      denom: 'uatom',
                      chain_id: 'cosmoshub-4',
                      origin_denom: 'uatom',
                      origin_chain_id: 'cosmoshub-4',
                      is_cw20: false,
                      trace: '',
                      symbol: 'ATOM',
                      name: 'ATOM',
                      logo_uri:
                        'https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/cosmos/asset/atom.png',
                      decimals: 6,
                    },
                  ],
                },
                'osmosis-1': {
                  assets: [
                    {
                      denom: 'uosmo',
                      chain_id: 'osmosis-1',
                      origin_denom: 'uosmo',
                      origin_chain_id: 'osmosis-1',
                      is_cw20: false,
                      trace: '',
                      symbol: 'OSMO',
                      name: 'OSMO',
                      logo_uri:
                        'https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/osmosis/asset/osmo.png',
                      decimals: 6,
                    },
                  ],
                },
              },
            })
          );
        })
      );

      const client = new SkipClient({
        apiURL: SKIP_API_URL,
        cacheDurationMs: 0

      });

      const assets = await client.assets();

      expect(assets).toEqual({
        'cosmoshub-4': [
          {
            denom:
              'ibc/6B8A3F5C2AD51CD6171FA41A7E8C35AD594AB69226438DB94450436EA57B3A89',
            chainID: 'cosmoshub-4',
            originDenom: 'ustrd',
            originChainID: 'stride-1',
            isCW20: false,
            trace: 'transfer/channel-391',
            symbol: 'STRD',
            name: 'STRD',
            logoURI:
              'https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/stride/asset/strd.png',
            decimals: 6,
          },
          {
            denom: 'uatom',
            chainID: 'cosmoshub-4',
            originDenom: 'uatom',
            originChainID: 'cosmoshub-4',
            isCW20: false,
            trace: '',
            symbol: 'ATOM',
            name: 'ATOM',
            logoURI:
              'https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/cosmos/asset/atom.png',
            decimals: 6,
          },
        ],
        'osmosis-1': [
          {
            denom: 'uosmo',
            chainID: 'osmosis-1',
            originDenom: 'uosmo',
            originChainID: 'osmosis-1',
            isCW20: false,
            trace: '',
            symbol: 'OSMO',
            name: 'OSMO',
            logoURI:
              'https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/osmosis/asset/osmo.png',
            decimals: 6,
          },
        ],
      });
    });

    it('handles 200 OK - with parameters', async () => {
      server.use(
        rest.get(
          'https://api.skip.build/v2/fungible/assets',
          (req, res, ctx) => {
            const chainID = req.url.searchParams.get('chain_id');
            const nativeOnly = req.url.searchParams.get('native_only');
            const includeNoMetadataAssets = req.url.searchParams.get(
              'include_no_metadata_assets'
            );

            if (chainID && nativeOnly && includeNoMetadataAssets) {
              return res(
                ctx.status(200),
                ctx.json({
                  chain_to_assets_map: {
                    'osmosis-1': {
                      assets: [
                        {
                          denom: 'uosmo',
                          chain_id: 'osmosis-1',
                          origin_denom: 'uosmo',
                          origin_chain_id: 'osmosis-1',
                          is_cw20: false,
                          trace: '',
                          symbol: 'OSMO',
                          name: 'OSMO',
                          logo_uri:
                            'https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/osmosis/asset/osmo.png',
                          decimals: 6,
                        },
                      ],
                    },
                  },
                })
              );
            }

            return res(
              ctx.status(500),
              ctx.json({ message: 'should not have reached this' })
            );
          }
        )
      );

      const client = new SkipClient({
        apiURL: SKIP_API_URL,
      });

      const assets = await client.assets({
        chainID: 'osmosis-1',
        nativeOnly: true,
        includeNoMetadataAssets: true,
      });

      expect(assets).toEqual({
        'osmosis-1': [
          {
            denom: 'uosmo',
            chainID: 'osmosis-1',
            originDenom: 'uosmo',
            originChainID: 'osmosis-1',
            trace: '',
            isCW20: false,
            symbol: 'OSMO',
            name: 'OSMO',
            logoURI:
              'https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/osmosis/asset/osmo.png',
            decimals: 6,
          },
        ],
      });
    });

    it('handles 400 Bad Request', async () => {
      server.use(
        rest.get('https://api.skip.build/v2/fungible/assets', (_, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({
              code: 3,
              message: 'Invalid chain_id',
              details: [],
            })
          );
        })
      );

      const client = new SkipClient({
        apiURL: SKIP_API_URL,
        cacheDurationMs: 0
      });

      await expect(client.assets()).rejects.toThrow('Invalid chain_id');
    });

    it('handles 500 Internal Server Error', async () => {
      server.use(
        rest.get('https://api.skip.build/v2/fungible/assets', (_, res, ctx) => {
          return res(
            ctx.status(500),
            ctx.json({
              code: 2,
              message: 'internal server error',
              details: [],
            })
          );
        })
      );

      const client = new SkipClient({
        apiURL: SKIP_API_URL,
        cacheDurationMs: 0
      });

      await expect(client.assets()).rejects.toThrow('internal server error');
    });
  });

  describe('/v2/fungible/assets_from_source', () => {
    it('handles 200 OK', async () => {
      server.use(
        rest.post(
          'https://api.skip.build/v2/fungible/assets_from_source',
          (_, res, ctx) => {
            return res(
              ctx.status(200),
              ctx.json({
                dest_assets: {
                  'osmosis-1': {
                    assets: [
                      {
                        denom:
                          'ibc/14F9BC3E44B8A9C1BE1FB08980FAB87034C9905EF17CF2F5008FC085218811CC',
                        chain_id: 'cosmoshub-4',
                        origin_denom: 'uosmo',
                        origin_chain_id: 'osmosis-1',
                        trace: 'transfer/channel-141',
                        symbol: 'OSMO',
                        name: 'OSMO',
                        logo_uri:
                          'https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/osmosis/asset/osmo.png',
                        decimals: 6,
                      },
                    ],
                  },
                  'neutron-1': {
                    assets: [
                      {
                        denom:
                          'ibc/376222D6D9DAE23092E29740E56B758580935A6D77C24C2ABD57A6A78A1F3955',
                        chain_id: 'neutron-1',
                        origin_denom: 'uosmo',
                        origin_chain_id: 'osmosis-1',
                        trace: 'transfer/channel-10',
                        symbol: 'OSMO',
                        name: 'OSMO',
                        logo_uri:
                          'https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/osmosis/asset/osmo.png',
                        decimals: 6,
                      },
                    ],
                  },
                },
              })
            );
          }
        )
      );

      const client = new SkipClient({
        apiURL: SKIP_API_URL,
      });

      const assetsFromSource = await client.assetsFromSource({
        sourceAssetChainID: 'osmosis-1',
        sourceAssetDenom: 'uosmo',
        includeCW20Assets: true,
      });

      expect(assetsFromSource).toEqual({
        'osmosis-1': [
          {
            denom:
              'ibc/14F9BC3E44B8A9C1BE1FB08980FAB87034C9905EF17CF2F5008FC085218811CC',
            chainID: 'cosmoshub-4',
            originDenom: 'uosmo',
            originChainID: 'osmosis-1',
            trace: 'transfer/channel-141',
            symbol: 'OSMO',
            name: 'OSMO',
            logoURI:
              'https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/osmosis/asset/osmo.png',
            decimals: 6,
          },
        ],
        'neutron-1': [
          {
            denom:
              'ibc/376222D6D9DAE23092E29740E56B758580935A6D77C24C2ABD57A6A78A1F3955',
            chainID: 'neutron-1',
            originDenom: 'uosmo',
            originChainID: 'osmosis-1',
            trace: 'transfer/channel-10',
            symbol: 'OSMO',
            name: 'OSMO',
            logoURI:
              'https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/osmosis/asset/osmo.png',
            decimals: 6,
          },
        ],
      });
    });

    it('handles 400 Bad Request', async () => {
      server.use(
        rest.post(
          'https://api.skip.build/v2/fungible/assets_from_source',
          (_, res, ctx) => {
            return res(
              ctx.status(400),
              ctx.json({
                code: 3,
                message: 'Invalid source_asset_chain_id',
                details: [],
              })
            );
          }
        )
      );

      const client = new SkipClient({
        apiURL: SKIP_API_URL,
      });

      await expect(
        client.assetsFromSource({
          sourceAssetChainID: 'osmosis-1',
          sourceAssetDenom: 'uosmo',
          includeCW20Assets: true,
        })
      ).rejects.toThrow('Invalid source_asset_chain_id');
    });

    it('handles 500 Internal Server Error', async () => {
      server.use(
        rest.post(
          'https://api.skip.build/v2/fungible/assets_from_source',
          (_, res, ctx) => {
            return res(
              ctx.status(500),
              ctx.json({
                code: 2,
                message: 'internal server error',
                details: [],
              })
            );
          }
        )
      );

      const client = new SkipClient({
        apiURL: SKIP_API_URL,
      });

      await expect(
        client.assetsFromSource({
          sourceAssetChainID: 'osmosis-1',
          sourceAssetDenom: 'uosmo',
          includeCW20Assets: true,
        })
      ).rejects.toThrow('internal server error');
    });
  });

  describe('/v2/fungible/recommend_assets', () => {
    it('handles 200 OK', async () => {
      server.use(
        rest.post(
          'https://api.skip.build/v2/fungible/recommend_assets',
          (_, res, ctx) => {
            return res(
              ctx.status(200),
              ctx.json({
                recommendations: [],
                recommendation_entries: [
                  {
                    recommendations: [
                      {
                        asset: {
                          denom:
                            'ibc/14F9BC3E44B8A9C1BE1FB08980FAB87034C9905EF17CF2F5008FC085218811CC',
                          chain_id: 'cosmoshub-4',
                          origin_denom: 'uosmo',
                          origin_chain_id: 'osmosis-1',
                          trace: 'transfer/channel-141',
                          symbol: 'OSMO',
                          name: 'OSMO',
                          logo_uri:
                            'https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/osmosis/asset/osmo.png',
                          decimals: 6,
                          is_cw20: true,
                          is_evm: true,
                          is_svm: false,
                        },
                        reason: 'MOST_LIQUID',
                      },
                    ],
                  },
                ],
              })
            );
          }
        )
      );

      const client = new SkipClient({
        apiURL: SKIP_API_URL,
      });

      const response = await client.recommendAssets([
        {
          sourceAssetChainID: 'osmosis-1',
          sourceAssetDenom: 'uosmo',
          destChainID: 'cosmoshub-4',
        },
      ]);

      const expected: RecommendationEntry[] = [
        {
          recommendations: [
            {
              asset: {
                denom:
                  'ibc/14F9BC3E44B8A9C1BE1FB08980FAB87034C9905EF17CF2F5008FC085218811CC',
                chainID: 'cosmoshub-4',
                originDenom: 'uosmo',
                originChainID: 'osmosis-1',
                trace: 'transfer/channel-141',
                symbol: 'OSMO',
                name: 'OSMO',
                logoURI:
                  'https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/osmosis/asset/osmo.png',
                decimals: 6,
                isCW20: true,
                isEVM: true,
                isSVM: false,
                tokenContract: undefined,
                description: undefined,
                coingeckoID: undefined,
                recommendedSymbol: undefined,
              },
              reason: 'MOST_LIQUID',
            },
          ],
        },
      ];

      expect(response).toEqual(expected);
    });
  });

  describe('/v2/fungible/msgs', () => {
    it('handles 200 OK', async () => {
      server.use(
        rest.post('https://api.skip.build/v2/fungible/msgs', (_, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              msgs: [
                {
                  multi_chain_msg: {
                    chain_id: 'osmosis-1',
                    path: ['osmosis-1', 'cosmoshub-4'],
                    msg: '{"sender":"osmo1f2f9vryyu53gr8vhsksn66kugnxaa7k8jdpk0e","contract":"osmo1rc6h59ev8m7mdpg584v7m5t24k2ut3dy5nekjw4mdsfjysyjvv3q65m8pj","msg":{"swap_and_action":{"user_swap":{"swap_exact_coin_in":{"operations":[{"denom_in":"uosmo","denom_out":"ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2","pool":"1"}],"swap_venue_name":"osmosis-poolmanager"}},"min_coin":{"denom":"ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2","amount":"54946"},"timeout_timestamp":1693012979767514087,"post_swap_action":{"ibc_transfer":{"ibc_info":{"memo":"","receiver":"cosmos1f2f9vryyu53gr8vhsksn66kugnxaa7k86kjxet","recover_address":"osmo1f2f9vryyu53gr8vhsksn66kugnxaa7k8jdpk0e","source_channel":"channel-0"}}},"affiliates":[]}},"funds":[{"denom":"uosmo","amount":"1000000"}]}',
                    msg_type_url: '/cosmwasm.wasm.v1.MsgExecuteContract',
                  },
                },
              ],
            })
          );
        })
      );

      const client = new SkipClient({
        apiURL: SKIP_API_URL,
      });

      const response = await client.messages({
        sourceAssetDenom: 'uosmo',
        sourceAssetChainID: 'osmosis-1',
        destAssetDenom: 'uatom',
        destAssetChainID: 'cosmoshub-4',
        amountIn: '1000000',
        amountOut: '54906',
        addressList: [
          'cosmos1xv9tklw7d82sezh9haa573wufgy59vmwe6xxe5',
          'cosmos1xv9tklw7d82sezh9haa573wufgy59vmwe6xxe5',
        ],
        operations: [
          {
            swap: {
              swapIn: {
                swapVenue: {
                  name: 'neutron-astroport',
                  chainID: 'neutron-1',
                  logoUri:
                    'https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg',
                },
                swapOperations: [
                  {
                    pool: 'pool-0',
                    denomIn: 'uosmo',
                    denomOut: 'uatom',
                  },
                ],
                swapAmountIn: '1000000',
              },
              estimatedAffiliateFee: '1000000',
              chainID: 'neutron-1',
              fromChainID: 'neutron-1',
              denomIn: 'uosmo',
              denomOut: 'uatom',
              swapVenues: [
                {
                  name: 'neutron-astroport',
                  chainID: 'neutron-1',
                  logoUri:
                    'https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg',
                },
              ],
            },
            txIndex: 0,
            amountIn: '100000',
            amountOut: '100000',
          },
          {
            transfer: {
              port: 'transfer',
              channel: 'channel-0',
              chainID: 'osmosis-1',
              pfmEnabled: true,
              destDenom: 'uatom',
              supportsMemo: true,
              smartRelay: false,
              bridgeID: 'IBC',
              denomIn: 'uosmo',
              denomOut: 'uatom',
              fromChainID: 'osmosis-1',
              toChainID: 'cosmoshub-4',
            },
            txIndex: 0,
            amountIn: '100000',
            amountOut: '100000',
          },
        ],
        estimatedAmountOut: '54906',
        slippageTolerancePercent: '0.01',
        affiliates: [
          {
            address: 'cosmos1xv9tklw7d82sezh9haa573wufgy59vmwe6xxe5',
            basisPointsFee: '100',
          },
        ],
        postRouteHandler: {
          wasmMsg: {
            contractAddress: 'cosmos1xv9tklw7d82sezh9haa573wufgy59vmwe6xxe5',
            msg: 'cosmwasm message',
          },
        },
        enableGasWarnings: true,
      });

      expect(response.msgs).toEqual([
        {
          multiChainMsg: {
            chainID: 'osmosis-1',
            path: ['osmosis-1', 'cosmoshub-4'],
            msg: '{"sender":"osmo1f2f9vryyu53gr8vhsksn66kugnxaa7k8jdpk0e","contract":"osmo1rc6h59ev8m7mdpg584v7m5t24k2ut3dy5nekjw4mdsfjysyjvv3q65m8pj","msg":{"swap_and_action":{"user_swap":{"swap_exact_coin_in":{"operations":[{"denom_in":"uosmo","denom_out":"ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2","pool":"1"}],"swap_venue_name":"osmosis-poolmanager"}},"min_coin":{"denom":"ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2","amount":"54946"},"timeout_timestamp":1693012979767514087,"post_swap_action":{"ibc_transfer":{"ibc_info":{"memo":"","receiver":"cosmos1f2f9vryyu53gr8vhsksn66kugnxaa7k86kjxet","recover_address":"osmo1f2f9vryyu53gr8vhsksn66kugnxaa7k8jdpk0e","source_channel":"channel-0"}}},"affiliates":[]}},"funds":[{"denom":"uosmo","amount":"1000000"}]}',
            msgTypeURL: '/cosmwasm.wasm.v1.MsgExecuteContract',
          },
        },
      ]);
    });
  });

  const routeResponseJSON: RouteResponseJSON = {
    source_asset_denom: 'uosmo',
    source_asset_chain_id: 'osmosis-1',
    dest_asset_denom: 'uatom',
    dest_asset_chain_id: 'cosmoshub-4',
    amount_in: '1000000',
    amount_out: '54906',
    required_chain_addresses: ['osmosis-1', 'cosmoshub-4'],
    operations: [
      {
        swap: {
          swap_in: {
            swap_venue: {
              name: 'neutron-astroport',
              chain_id: 'neutron-1',
              logo_uri:
                'https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg',
            },
            swap_operations: [
              {
                pool: 'pool-0',
                denom_in: 'uosmo',
                denom_out: 'uatom',
              },
            ],
            swap_amount_in: '1000000',
          },
          estimated_affiliate_fee: '1000000',
          chain_id: 'neutron-1',
          from_chain_id: 'neutron-1',
          denom_in: 'uosmo',
          denom_out: 'uatom',
          swap_venues: [
            {
              name: 'neutron-astroport',
              chain_id: 'neutron-1',
              logo_uri:
                'https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg',
            },
          ],
        },
        tx_index: 0,
        amount_in: '100000',
        amount_out: '100000',
      },
      {
        transfer: {
          port: 'transfer',
          channel: 'channel-0',
          chain_id: 'osmosis-1',
          pfm_enabled: true,
          dest_denom: 'uatom',
          supports_memo: true,
          smart_relay: false,
          bridge_id: 'IBC',
          denom_in: 'uosmo',
          denom_out: 'uatom',
          from_chain_id: 'osmosis-1',
          to_chain_id: 'cosmoshub-4',
        },
        tx_index: 0,
        amount_in: '100000',
        amount_out: '100000',
      },
    ],
    chain_ids: ['osmosis-1', 'cosmoshub-4'],
    does_swap: true,
    estimated_amount_out: '54906',
    swap_venues: [
      {
        name: 'osmosis-poolmanager',
        chain_id: 'osmosis-1',
        logo_uri:
          'https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmosis-chain-logo.png',
      },
    ],
    txs_required: 1,
    estimated_fees: [],
  };

  describe('/v2/fungible/route', () => {
    it('handles 200 OK', async () => {
      server.use(
        rest.post('https://api.skip.build/v2/fungible/route', (_, res, ctx) => {
          return res(ctx.status(200), ctx.json(routeResponseJSON));
        })
      );

      const client = new SkipClient({
        apiURL: SKIP_API_URL,
      });

      const response = await client.route({
        sourceAssetChainID: 'osmosis-1',
        sourceAssetDenom: 'uosmo',
        destAssetChainID: 'cosmoshub-4',
        destAssetDenom: 'uatom',
        amountIn: '1000000',
        smartRelay: false,
      });

      const routeResponse: RouteResponse = {
        sourceAssetDenom: 'uosmo',
        sourceAssetChainID: 'osmosis-1',
        destAssetDenom: 'uatom',
        destAssetChainID: 'cosmoshub-4',
        amountIn: '1000000',
        amountOut: '54906',
        requiredChainAddresses: ['osmosis-1', 'cosmoshub-4'],
        operations: [
          {
            swap: {
              swapIn: {
                swapVenue: {
                  name: 'neutron-astroport',
                  chainID: 'neutron-1',
                  logoUri:
                    'https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg',
                },
                swapOperations: [
                  {
                    pool: 'pool-0',
                    denomIn: 'uosmo',
                    denomOut: 'uatom',
                  },
                ],
                swapAmountIn: '1000000',
              },
              estimatedAffiliateFee: '1000000',
              chainID: 'neutron-1',
              fromChainID: 'neutron-1',
              denomIn: 'uosmo',
              denomOut: 'uatom',
              swapVenues: [
                {
                  name: 'neutron-astroport',
                  chainID: 'neutron-1',
                  logoUri:
                    'https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg',
                },
              ],
            },
            txIndex: 0,
            amountIn: '100000',
            amountOut: '100000',
          },
          {
            transfer: {
              port: 'transfer',
              channel: 'channel-0',
              chainID: 'osmosis-1',
              pfmEnabled: true,
              destDenom: 'uatom',
              supportsMemo: true,
              smartRelay: false,
              bridgeID: 'IBC',
              denomIn: 'uosmo',
              denomOut: 'uatom',
              fromChainID: 'osmosis-1',
              toChainID: 'cosmoshub-4',
            },
            txIndex: 0,
            amountIn: '100000',
            amountOut: '100000',
          },
        ],
        chainIDs: ['osmosis-1', 'cosmoshub-4'],
        doesSwap: true,
        estimatedAmountOut: '54906',
        swapVenues: [
          {
            name: 'osmosis-poolmanager',
            chainID: 'osmosis-1',
            logoUri:
              'https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmosis-chain-logo.png',
          },
        ],
        estimatedFees: [],
        txsRequired: 1,
      };

      expect(response).toEqual(routeResponse);
    });
  });

  describe('/v2/fungible/venues', () => {
    it('handles 200 OK', async () => {
      server.use(
        rest.get('https://api.skip.build/v2/fungible/venues', (_, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              venues: [
                {
                  name: 'neutron-astroport',
                  chain_id: 'neutron-1',
                },
                {
                  name: 'osmosis-poolmanager',
                  chain_id: 'osmosis-1',
                },
              ],
            })
          );
        })
      );

      const client = new SkipClient({
        apiURL: SKIP_API_URL,
      });

      const response = await client.venues();

      expect(response).toEqual([
        {
          name: 'neutron-astroport',
          chainID: 'neutron-1',
        },
        {
          name: 'osmosis-poolmanager',
          chainID: 'osmosis-1',
        },
      ]);
    });
  });

  describe('submitTransaction', () => {
    it('handles 200 OK', async () => {
      server.use(
        rest.post('https://api.skip.build/v2/tx/submit', (_, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              tx_hash: 'tx_hash123',
              success: true,
            })
          );
        })
      );

      const client = new SkipClient({
        apiURL: SKIP_API_URL,
      });

      const response = await client.submitTransaction({
        chainID: 'cosmoshub-4',
        tx: 'txbytes123',
      });

      expect(response).toEqual({
        txHash: 'tx_hash123',
      });
    });
  });

  describe('trackTransaction', () => {
    it('handles 200 OK', async () => {
      server.use(
        rest.post('https://api.skip.build/v2/tx/track', (_, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              tx_hash: 'tx_hash123',
              success: true,
            })
          );
        })
      );

      const client = new SkipClient({
        apiURL: SKIP_API_URL,
      });

      const response = await client.trackTransaction({
        chainID: 'cosmoshub-4',
        txHash: 'tx_hash123',
      });

      expect(response).toEqual({
        txHash: 'tx_hash123',
      });
    });
  });

  describe('transactionStatus', () => {
    it('handles 200 OK', async () => {
      server.use(
        rest.get('https://api.skip.build/v2/tx/status', (_, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              status: 'STATE_COMPLETED',
              transfer_sequence: [
                {
                  ibc_transfer: {
                    from_chain_id: 'axelar-dojo-1',
                    to_chain_id: 'osmosis-1',
                    src_chain_id: 'axelar-dojo-1',
                    dst_chain_id: 'osmosis-1',
                    state: 'TRANSFER_SUCCESS',
                    packet_txs: {
                      send_tx: {
                        chain_id: 'axelar-dojo-1',
                        tx_hash:
                          'AAEA76709215A808AF6D7FC2B8FBB8746BC1F196E46FFAE84B79C6F6CD0A79C9',
                      },
                      receive_tx: {
                        chain_id: 'osmosis-1',
                        tx_hash:
                          '082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D',
                      },
                      acknowledge_tx: {
                        chain_id: 'axelar-dojo-1',
                        tx_hash:
                          'C9A36F94A5B2CA9C7ABF20402561E46FD8B80EBAC4F0D5B7C01F978E34285CCA',
                      },
                      timeout_tx: null,
                      error: null,
                    },
                  },
                },
                {
                  ibc_transfer: {
                    from_chain_id: 'osmosis-1',
                    to_chain_id: 'cosmoshub-4',
                    src_chain_id: 'osmosis-1',
                    dst_chain_id: 'cosmoshub-4',
                    state: 'TRANSFER_SUCCESS',
                    packet_txs: {
                      send_tx: {
                        chain_id: 'osmosis-1',
                        tx_hash:
                          '082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D',
                      },
                      receive_tx: {
                        chain_id: 'cosmoshub-4',
                        tx_hash:
                          '913E2542EBFEF2E885C19DD9C4F8ECB6ADAFFE59D60BB108FAD94FBABF9C5671',
                      },
                      acknowledge_tx: {
                        chain_id: 'osmosis-1',
                        tx_hash:
                          '1EDB2886E6FD59D6B9C096FBADB1A52585745694F4DFEE3A3CD3FF0153307EBC',
                      },
                      timeout_tx: null,
                      error: null,
                    },
                  },
                },
              ],
              next_blocking_transfer: null,
              transfer_asset_release: {
                chain_id: 'cosmoshub-4',
                denom: 'uatom',
                amount: '999',
                released: true,
              },
              error: null,
              state: 'STATE_COMPLETED',
              transfers: [
                {
                  state: 'STATE_COMPLETED_SUCCESS',
                  transfer_sequence: [
                    {
                      ibc_transfer: {
                        from_chain_id: 'src-chain',
                        to_chain_id: 'dest-chain',
                        src_chain_id: 'src-chain',
                        dst_chain_id: 'dest-chain',
                        state: 'TRANSFER_SUCCESS',
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
                    chain_id: 'cosmoshub-4',
                    denom: 'uatom',
                    amount: '999',
                    released: true,
                  },
                  error: null,
                },
              ],
            })
          );
        })
      );

      const client = new SkipClient({
        apiURL: SKIP_API_URL,
      });

      const response = await client.transactionStatus({
        chainID: 'cosmoshub-4',
        txHash: 'tx_hash123',
      });

      expect(response).toEqual({
        status: 'STATE_COMPLETED',
        transferSequence: [
          {
            ibcTransfer: {
              fromChainID: 'axelar-dojo-1',
              toChainID: 'osmosis-1',
              srcChainID: 'axelar-dojo-1',
              dstChainID: 'osmosis-1',
              state: 'TRANSFER_SUCCESS',
              packetTXs: {
                sendTx: {
                  chainID: 'axelar-dojo-1',
                  txHash:
                    'AAEA76709215A808AF6D7FC2B8FBB8746BC1F196E46FFAE84B79C6F6CD0A79C9',
                },
                receiveTx: {
                  chainID: 'osmosis-1',
                  txHash:
                    '082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D',
                },
                acknowledgeTx: {
                  chainID: 'axelar-dojo-1',
                  txHash:
                    'C9A36F94A5B2CA9C7ABF20402561E46FD8B80EBAC4F0D5B7C01F978E34285CCA',
                },
                timeoutTx: null,
                error: null,
              },
            },
          },
          {
            ibcTransfer: {
              fromChainID: 'osmosis-1',
              toChainID: 'cosmoshub-4',
              srcChainID: 'osmosis-1',
              dstChainID: 'cosmoshub-4',
              state: 'TRANSFER_SUCCESS',
              packetTXs: {
                sendTx: {
                  chainID: 'osmosis-1',
                  txHash:
                    '082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D',
                },
                receiveTx: {
                  chainID: 'cosmoshub-4',
                  txHash:
                    '913E2542EBFEF2E885C19DD9C4F8ECB6ADAFFE59D60BB108FAD94FBABF9C5671',
                },
                acknowledgeTx: {
                  chainID: 'osmosis-1',
                  txHash:
                    '1EDB2886E6FD59D6B9C096FBADB1A52585745694F4DFEE3A3CD3FF0153307EBC',
                },
                timeoutTx: null,
                error: null,
              },
            },
          },
        ],
        nextBlockingTransfer: null,
        transferAssetRelease: {
          chainID: 'cosmoshub-4',
          denom: 'uatom',
          amount: '999',
          released: true,
        },
        error: null,
        state: 'STATE_COMPLETED',
        transfers: [
          {
            state: 'STATE_COMPLETED_SUCCESS',
            transferSequence: [
              {
                ibcTransfer: {
                  fromChainID: 'src-chain',
                  toChainID: 'dest-chain',
                  srcChainID: 'src-chain',
                  dstChainID: 'dest-chain',
                  state: 'TRANSFER_SUCCESS',
                  packetTXs: {
                    sendTx: null,
                    receiveTx: null,
                    acknowledgeTx: null,
                    timeoutTx: null,
                    error: null,
                  },
                },
              },
            ],
            nextBlockingTransfer: {
              transferSequenceIndex: 1,
            },
            transferAssetRelease: {
              chainID: 'cosmoshub-4',
              denom: 'uatom',
              amount: '999',
              released: true,
            },
            error: null,
          },
        ],
      });
    });

    it('handle 200 OK error with retry options', async () => {
      let retryCount = 0;
      const maxRetries = 3;
      server.use(
        rest.get('https://api.skip.build/v2/tx/status', (_, res, ctx) => {
          retryCount++;
          if (retryCount >= maxRetries) {
            return res(
              ctx.status(200),
              ctx.json({
                status: 'STATE_COMPLETED',
                transfer_sequence: [
                  {
                    ibc_transfer: {
                      from_chain_id: 'axelar-dojo-1',
                      to_chain_id: 'osmosis-1',
                      src_chain_id: 'axelar-dojo-1',
                      dst_chain_id: 'osmosis-1',
                      state: 'TRANSFER_SUCCESS',
                      packet_txs: {
                        send_tx: {
                          chain_id: 'axelar-dojo-1',
                          tx_hash:
                            'AAEA76709215A808AF6D7FC2B8FBB8746BC1F196E46FFAE84B79C6F6CD0A79C9',
                        },
                        receive_tx: {
                          chain_id: 'osmosis-1',
                          tx_hash:
                            '082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D',
                        },
                        acknowledge_tx: {
                          chain_id: 'axelar-dojo-1',
                          tx_hash:
                            'C9A36F94A5B2CA9C7ABF20402561E46FD8B80EBAC4F0D5B7C01F978E34285CCA',
                        },
                        timeout_tx: null,
                        error: null,
                      },
                    },
                  },
                  {
                    ibc_transfer: {
                      from_chain_id: 'osmosis-1',
                      to_chain_id: 'cosmoshub-4',
                      src_chain_id: 'osmosis-1',
                      dst_chain_id: 'cosmoshub-4',
                      state: 'TRANSFER_SUCCESS',
                      packet_txs: {
                        send_tx: {
                          chain_id: 'osmosis-1',
                          tx_hash:
                            '082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D',
                        },
                        receive_tx: {
                          chain_id: 'cosmoshub-4',
                          tx_hash:
                            '913E2542EBFEF2E885C19DD9C4F8ECB6ADAFFE59D60BB108FAD94FBABF9C5671',
                        },
                        acknowledge_tx: {
                          chain_id: 'osmosis-1',
                          tx_hash:
                            '1EDB2886E6FD59D6B9C096FBADB1A52585745694F4DFEE3A3CD3FF0153307EBC',
                        },
                        timeout_tx: null,
                        error: null,
                      },
                    },
                  },
                ],
                next_blocking_transfer: null,
                transfer_asset_release: {
                  chain_id: 'cosmoshub-4',
                  denom: 'uatom',
                  amount: '999',
                  released: true,
                },
                error: null,
                state: 'STATE_COMPLETED',
                transfers: [
                  {
                    state: 'STATE_COMPLETED_SUCCESS',
                    transfer_sequence: [
                      {
                        ibc_transfer: {
                          from_chain_id: 'src-chain',
                          to_chain_id: 'dest-chain',
                          src_chain_id: 'src-chain',
                          dst_chain_id: 'dest-chain',
                          state: 'TRANSFER_SUCCESS',
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
                      chain_id: 'cosmoshub-4',
                      denom: 'uatom',
                      amount: '999',
                      released: true,
                    },
                    error: null,
                  },
                ],
              })
            );
          }
          return res(
            ctx.status(500),
            ctx.json({
              code: 2,
              message: 'internal server error',
              details: [],
            })
          );
        })
      );

      const client = new SkipClient({
        apiURL: SKIP_API_URL,
      });

      const response = await client.transactionStatus({
        chainID: 'cosmoshub-4',
        txHash: 'tx_hash123',
        options: {
          retry: {
            retryInterval: 500,
            maxRetries: maxRetries + 1,
            backoffMultiplier: 1,
          },
        },
      });

      expect(response).toEqual({
        status: 'STATE_COMPLETED',
        transferSequence: [
          {
            ibcTransfer: {
              fromChainID: 'axelar-dojo-1',
              toChainID: 'osmosis-1',
              srcChainID: 'axelar-dojo-1',
              dstChainID: 'osmosis-1',
              state: 'TRANSFER_SUCCESS',
              packetTXs: {
                sendTx: {
                  chainID: 'axelar-dojo-1',
                  txHash:
                    'AAEA76709215A808AF6D7FC2B8FBB8746BC1F196E46FFAE84B79C6F6CD0A79C9',
                },
                receiveTx: {
                  chainID: 'osmosis-1',
                  txHash:
                    '082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D',
                },
                acknowledgeTx: {
                  chainID: 'axelar-dojo-1',
                  txHash:
                    'C9A36F94A5B2CA9C7ABF20402561E46FD8B80EBAC4F0D5B7C01F978E34285CCA',
                },
                timeoutTx: null,
                error: null,
              },
            },
          },
          {
            ibcTransfer: {
              fromChainID: 'osmosis-1',
              toChainID: 'cosmoshub-4',
              srcChainID: 'osmosis-1',
              dstChainID: 'cosmoshub-4',
              state: 'TRANSFER_SUCCESS',
              packetTXs: {
                sendTx: {
                  chainID: 'osmosis-1',
                  txHash:
                    '082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D',
                },
                receiveTx: {
                  chainID: 'cosmoshub-4',
                  txHash:
                    '913E2542EBFEF2E885C19DD9C4F8ECB6ADAFFE59D60BB108FAD94FBABF9C5671',
                },
                acknowledgeTx: {
                  chainID: 'osmosis-1',
                  txHash:
                    '1EDB2886E6FD59D6B9C096FBADB1A52585745694F4DFEE3A3CD3FF0153307EBC',
                },
                timeoutTx: null,
                error: null,
              },
            },
          },
        ],
        nextBlockingTransfer: null,
        transferAssetRelease: {
          chainID: 'cosmoshub-4',
          denom: 'uatom',
          amount: '999',
          released: true,
        },
        error: null,
        state: 'STATE_COMPLETED',
        transfers: [
          {
            state: 'STATE_COMPLETED_SUCCESS',
            transferSequence: [
              {
                ibcTransfer: {
                  fromChainID: 'src-chain',
                  toChainID: 'dest-chain',
                  srcChainID: 'src-chain',
                  dstChainID: 'dest-chain',
                  state: 'TRANSFER_SUCCESS',
                  packetTXs: {
                    sendTx: null,
                    receiveTx: null,
                    acknowledgeTx: null,
                    timeoutTx: null,
                    error: null,
                  },
                },
              },
            ],
            nextBlockingTransfer: {
              transferSequenceIndex: 1,
            },
            transferAssetRelease: {
              chainID: 'cosmoshub-4',
              denom: 'uatom',
              amount: '999',
              released: true,
            },
            error: null,
          },
        ],
      });
    });

    it('handle 500 error with retry options', async () => {
      let retryCount = 0;
      const maxRetries = 2;
      server.use(
        rest.get('https://api.skip.build/v2/tx/status', (_, res, ctx) => {
          retryCount++;
          if (retryCount >= maxRetries) {
            return res(
              ctx.status(200),
              ctx.json({
                status: 'STATE_COMPLETED',
                transfer_sequence: [
                  {
                    ibc_transfer: {
                      from_chain_id: 'axelar-dojo-1',
                      to_chain_id: 'osmosis-1',
                      src_chain_id: 'axelar-dojo-1',
                      dst_chain_id: 'osmosis-1',
                      state: 'TRANSFER_SUCCESS',
                      packet_txs: {
                        send_tx: {
                          chain_id: 'axelar-dojo-1',
                          tx_hash:
                            'AAEA76709215A808AF6D7FC2B8FBB8746BC1F196E46FFAE84B79C6F6CD0A79C9',
                        },
                        receive_tx: {
                          chain_id: 'osmosis-1',
                          tx_hash:
                            '082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D',
                        },
                        acknowledge_tx: {
                          chain_id: 'axelar-dojo-1',
                          tx_hash:
                            'C9A36F94A5B2CA9C7ABF20402561E46FD8B80EBAC4F0D5B7C01F978E34285CCA',
                        },
                        timeout_tx: null,
                        error: null,
                      },
                    },
                  },
                  {
                    ibc_transfer: {
                      from_chain_id: 'osmosis-1',
                      to_chain_id: 'cosmoshub-4',
                      src_chain_id: 'osmosis-1',
                      dst_chain_id: 'cosmoshub-4',
                      state: 'TRANSFER_SUCCESS',
                      packet_txs: {
                        send_tx: {
                          chain_id: 'osmosis-1',
                          tx_hash:
                            '082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D',
                        },
                        receive_tx: {
                          chain_id: 'cosmoshub-4',
                          tx_hash:
                            '913E2542EBFEF2E885C19DD9C4F8ECB6ADAFFE59D60BB108FAD94FBABF9C5671',
                        },
                        acknowledge_tx: {
                          chain_id: 'osmosis-1',
                          tx_hash:
                            '1EDB2886E6FD59D6B9C096FBADB1A52585745694F4DFEE3A3CD3FF0153307EBC',
                        },
                        timeout_tx: null,
                        error: null,
                      },
                    },
                  },
                ],
                next_blocking_transfer: null,
                transfer_asset_release: {
                  chain_id: 'cosmoshub-4',
                  denom: 'uatom',
                  amount: '999',
                  released: true,
                },
                error: null,
                state: 'STATE_COMPLETED',
                transfers: [
                  {
                    state: 'STATE_COMPLETED_SUCCESS',
                    transfer_sequence: [
                      {
                        ibc_transfer: {
                          from_chain_id: 'src-chain',
                          to_chain_id: 'dest-chain',
                          src_chain_id: 'src-chain',
                          dst_chain_id: 'dest-chain',
                          state: 'TRANSFER_SUCCESS',
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
                      chain_id: 'cosmoshub-4',
                      denom: 'uatom',
                      amount: '999',
                      released: true,
                    },
                    error: null,
                  },
                ],
              })
            );
          }
          return res(
            ctx.status(500),
            ctx.json({
              code: 2,
              message: 'internal server error',
              details: [],
            })
          );
        })
      );

      const client = new SkipClient({
        apiURL: SKIP_API_URL,
      });

      try {
        await client.transactionStatus({
          chainID: 'cosmoshub-4',
          txHash: 'tx_hash123',
          options: {
            retry: {
              retryInterval: 500,
              maxRetries: maxRetries - 1,
              backoffMultiplier: 1,
            },
          },
        });
      } catch (error) {
        expect(error).toEqual(new Error('internal server error'));
      }
    });
  });

  describe('ibcOriginAssets', () => {
    it('returns a list of origin assets', async () => {
      const expectedResult: OriginAssetsResponseJSON = {
        origin_assets: [
          {
            asset: {
              denom: 'uosmo',
              chain_id: 'osmosis-1',
              origin_denom: 'uosmo',
              origin_chain_id: 'osmosis-1',
              trace: '',
              is_cw20: false,
              is_evm: false,
              is_svm: false,
              token_contract: 'token-contract-value',
              symbol: 'OSMO',
              name: 'OSMO',
              logo_uri:
                'https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmo.png',
              decimals: 6,
              description: 'The native token of Osmosis',
              coingecko_id: 'osmosis',
              recommended_symbol: 'OSMO',
            },
          },
          {
            asset: {
              denom: 'uusdc',
              chain_id: 'axelar-dojo-1',
              origin_denom: 'uusdc',
              origin_chain_id: 'axelar-dojo-1',
              trace: '',
              is_cw20: false,
              is_evm: false,
              is_svm: false,
              token_contract: 'token-contract-value',
              symbol: 'USDC',
              name: 'USDC',
              logo_uri:
                'https://raw.githubusercontent.com/cosmos/chain-registry/master/axelar/images/usdc.png',
              decimals: 6,
              description: "Circle's stablecoin on Axelar",
              coingecko_id: 'axlusdc',
              recommended_symbol: 'USDC.axl',
            },
          },
        ],
      };

      server.use(
        rest.post(
          'https://api.skip.build/v2/fungible/ibc_origin_assets',
          (_, res, ctx) => {
            return res(ctx.status(200), ctx.json(expectedResult));
          }
        )
      );

      const client = new SkipClient({
        apiURL: SKIP_API_URL,
      });

      const params: DenomWithChainID[] = [
        {
          denom:
            'ibc/14F9BC3E44B8A9C1BE1FB08980FAB87034C9905EF17CF2F5008FC085218811CC',
          chainID: 'cosmoshub-4',
        },
      ];

      const result = await client.ibcOriginAssets(params);

      expect(result).toEqual(
        originAssetsResponseFromJSON(expectedResult).originAssets
      );
    });
  });

  describe('getRecommendedGasPrice', () => {
    it('returns the recommended gas price for a chain', async () => {
      const client = new SkipClient({
        apiURL: SKIP_API_URL,
      });

      const result = await client.getRecommendedGasPrice('osmosis-1');

      expect(result?.denom).toEqual('uosmo');
    }, 30000);

    it('returns the recommended gas price for Noble (no staking token)', async () => {
      const client = new SkipClient({
        apiURL: SKIP_API_URL,
        cacheDurationMs: 0
      });

      const result = await client.getRecommendedGasPrice('noble-1');

      expect(result?.denom).toEqual('uusdc');
    }, 30000);
  });

  describe('bridges', () => {
    it('returns a list of bridges', async () => {
      server.use(
        rest.get(`${SKIP_API_URL}/v2/info/bridges`, (_, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              bridges: [
                {
                  id: 'IBC',
                  name: 'IBC',
                  logo_uri:
                    'https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/bridges/ibc/logo.svg',
                },
                {
                  id: 'AXELAR',
                  name: 'Axelar',
                  logo_uri:
                    'https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/bridges/axelar/logo.svg',
                },
                {
                  id: 'CCTP',
                  name: 'CCTP',
                  logo_uri:
                    'https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/bridges/cctp/logo.svg',
                },
              ],
            })
          );
        })
      );

      const client = new SkipClient({
        apiURL: SKIP_API_URL,
      });

      const result = await client.bridges();

      expect(result).toEqual([
        {
          id: 'IBC',
          name: 'IBC',
          logoURI:
            'https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/bridges/ibc/logo.svg',
        },
        {
          id: 'AXELAR',
          name: 'Axelar',
          logoURI:
            'https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/bridges/axelar/logo.svg',
        },
        {
          id: 'CCTP',
          name: 'CCTP',
          logoURI:
            'https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/bridges/cctp/logo.svg',
        },
      ]);
    });
  });

  describe('validateChainIDsToAffiliates', () => {
    it('returns an error when basisPointsFee is not included in one of the affiliates', async () => {
      try {
        new SkipClient({
          chainIDsToAffiliates: {
            chain1: {
              affiliates: [
                {
                  basisPointsFee: '100',
                  address: 'address',
                },
              ],
            },
            chain2: {
              affiliates: [
                {
                  address: 'address',
                } as any,
              ],
            },
          },
        });
      } catch (error) {
        expect(error).toEqual(
          new Error('basisPointFee must exist in each affiliate')
        );
      }
    });

    it('returns an error when address is not included in one of the affiliates', async () => {
      try {
        new SkipClient({
          chainIDsToAffiliates: {
            chain1: {
              affiliates: [
                {
                  basisPointsFee: '100',
                  address: 'address',
                },
              ],
            },
            chain2: {
              affiliates: [
                {
                  address: '',
                } as any,
              ],
            },
          },
        });
      } catch (error) {
        expect(error).toEqual(
          new Error('basisPointFee must exist in each affiliate')
        );
      }
    });

    it('returns an error when affiliate bps differs (only comparing 2 bps)', async () => {
      try {
        new SkipClient({
          chainIDsToAffiliates: {
            chain1: {
              affiliates: [
                {
                  basisPointsFee: '50',
                  address: 'address',
                },
              ],
            },
            chain2: {
              affiliates: [
                {
                  basisPointsFee: '100',
                  address: 'address',
                },
              ],
            },
          },
        });
      } catch (error) {
        expect(error).toEqual(
          new Error(
            'basisPointFee does not add up to the same number for each chain in chainIDsToAffiliates'
          )
        );
      }
    });

    it('returns an error when first affiliate bps are the same but total differs', async () => {
      try {
        new SkipClient({
          chainIDsToAffiliates: {
            chain1: {
              affiliates: [
                {
                  basisPointsFee: '100',
                  address: 'address',
                },
              ],
            },
            chain2: {
              affiliates: [
                {
                  basisPointsFee: '100',
                  address: 'address',
                },
                {
                  basisPointsFee: '50',
                  address: 'address',
                },
              ],
            },
          },
        });
      } catch (error) {
        expect(error).toEqual(
          new Error(
            'basisPointFee does not add up to the same number for each chain in chainIDsToAffiliates'
          )
        );
      }
    });

    it('returns an error when first and last affiliates bps are the same but total bps differs', async () => {
      try {
        new SkipClient({
          chainIDsToAffiliates: {
            chain1: {
              affiliates: [
                {
                  basisPointsFee: '100',
                  address: 'address',
                },
                {
                  basisPointsFee: '10',
                  address: 'address',
                },
                {
                  basisPointsFee: '50',
                  address: 'address',
                },
              ],
            },
            chain2: {
              affiliates: [
                {
                  basisPointsFee: '100',
                  address: 'address',
                },
                {
                  basisPointsFee: '50',
                  address: 'address',
                },
              ],
            },
          },
        });
      } catch (error) {
        expect(error).toEqual(
          new Error(
            'basisPointFee does not add up to the same number for each chain in chainIDsToAffiliates'
          )
        );
      }
    });

    it('does not return an error when affiliate bps are exactly the same', async () => {
      let errorOccurred = false;
      try {
        const client = new SkipClient({
          chainIDsToAffiliates: {
            chain1: {
              affiliates: [
                {
                  basisPointsFee: '100',
                  address: 'address',
                },
              ],
            },
            chain2: {
              affiliates: [
                {
                  basisPointsFee: '100',
                  address: 'address',
                },
              ],
            },
          },
        });
      } catch (error) {
        errorOccurred = true;
      }
      expect(errorOccurred).toBe(false);
    });

    it('does not return an error if 2 bps on first chain adds up to 2nd chains first bps', async () => {
      let errorOccurred = false;
      try {
        new SkipClient({
          chainIDsToAffiliates: {
            chain1: {
              affiliates: [
                {
                  basisPointsFee: '50',
                  address: 'address',
                },
                {
                  basisPointsFee: '50',
                  address: 'address',
                },
              ],
            },
            chain2: {
              affiliates: [
                {
                  basisPointsFee: '100',
                  address: 'address',
                },
              ],
            },
          },
        });
      } catch (error) {
        errorOccurred = true;
      }
      expect(errorOccurred).toBe(false);
    });

    it('does not return an error if 3 chains are passed and each have different number of affiliates but still add up to the same total', async () => {
      let errorOccurred = false;
      try {
        new SkipClient({
          chainIDsToAffiliates: {
            chain1: {
              affiliates: [
                {
                  basisPointsFee: '50',
                  address: 'address',
                },
                {
                  basisPointsFee: '100',
                  address: 'address',
                },
                {
                  basisPointsFee: '150',
                  address: 'address',
                },
              ],
            },
            chain2: {
              affiliates: [
                {
                  basisPointsFee: '100',
                  address: 'address',
                },
                {
                  basisPointsFee: '52',
                  address: 'address',
                },
                {
                  basisPointsFee: '38',
                  address: 'address',
                },
                {
                  basisPointsFee: '110',
                  address: 'address',
                },
              ],
            },
            chain3: {
              affiliates: [
                {
                  basisPointsFee: '300',
                  address: 'address',
                },
              ],
            },
          },
        });
      } catch (error) {
        errorOccurred = true;
      }
      expect(errorOccurred).toBe(false);
    });
  });

  test('dymension', async () => {
    const client = new SkipClient({
      apiURL: SKIP_API_URL,
      cacheDurationMs: 0
    });

    const feeInfo = await client.getFeeInfoForChain('dymension_1100-1');
    expect(feeInfo?.denom).toEqual('adym');
  }, 30000);
})

