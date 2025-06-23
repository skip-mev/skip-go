/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require("fs/promises");
const path = require("path");
const telescope = require("@cosmology/telescope").default;
const protoDirs = require("../../../vendor");
const outPath = path.resolve(__dirname, "../src/codegen/");

const registries = [
  {
    packageName: "chain-registry",
    registryPath: path.resolve(
      __dirname,
      "../../../node_modules/chain-registry",
    ),
    isCamelCase: true,
  },
  {
    packageName: "initia-registry",
    registryPath: path.resolve(
      __dirname,
      "../../../node_modules/@initia/initia-registry/main",
    ),
    isCamelCase: false,
  },
];

function toCamel(obj) {
  return convertKeys(obj, (key) => key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()));
}

function convertKeys(obj, convertKey) {
  if (Array.isArray(obj)) {
    return obj.map((item) => convertKeys(item, convertKey))
  } else if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((acc, key) => {
      acc[convertKey(key)] = convertKeys((obj)[key], convertKey);
      return acc;
    }, {});
  } else {
    return obj;
  }
}

async function genTelescope() {
  try {
    await telescope({
      protoDirs,
      outPath,
      options: {
        aminoEncoding: {
          customTypes: {
            useCosmosSDKDec: true,
          },
          enabled: true,
          exceptions: {
            // https://github.com/evmos/evmos/blob/v16.0.3/crypto/ethsecp256k1/ethsecp256k1.go#L33
            "/ethermint.crypto.v1.ethsecp256k1.PrivKey": {
              aminoType: "ethermint/PrivKeyEthSecp256k1",
            },
            // https://github.com/evmos/evmos/blob/v16.0.3/crypto/ethsecp256k1/ethsecp256k1.go#L35
            "/ethermint.crypto.v1.ethsecp256k1.PubKey": {
              aminoType: "ethermint/PubKeyEthSecp256k1",
            },
          },
          typeUrlToAmino: (typeUrl) => {
            /**
             * regex to match typeUrl, e.g.:
             * - typeUrl  : /ethermint.evm.v1.MsgUpdateParams
             * - mod      : ethermint
             * - submod   : evm
             * - version  : v1
             * - type     : MsgUpdateParams
             */
            const matcher =
              /^\/(?<mod>\w+)\.(?<submod>\w+)\.(?<version>\w+)\.(?<type>\w+)/;

            const { mod, submod, type } = typeUrl.match(matcher)?.groups ?? {};

            // https://github.com/circlefin/noble-cctp/blob/release-2024-01-09T183203/x/cctp/types/codec.go#L30-L56
            if (typeUrl.startsWith("/circle.cctp.v1.Msg")) {
              return typeUrl.replace("/circle.cctp.v1.Msg", "cctp/");
            }

            /**
             * lookup mod to assign primary MsgUpdateParams amino type, e.g.:
             *
             * - typeUrl  : ethermint.evm.v1.MsgUpdateParams
             * - mod      : ethermint
             * - submod   : evm
             * - type     : ethermint/MsgUpdateParams
             *
             * @type {Record<string, string>}
             */
            const lookup = {
              ethermint: "evm",
              evmos: "revenue",
            };

            if (mod && lookup[mod]) {
              if (type === "MsgUpdateParams" && lookup[mod] === submod) {
                return `${mod}/MsgUpdateParams`;
              }
              if (type === "MsgUpdateParams") {
                return `${mod}/${submod}/MsgUpdateParams`;
              }
              if (type?.startsWith("Msg")) {
                return `${mod}/${type}`;
              }
              return `${submod}/${type}`;
            }
          },
        },
        bundle: {
          enabled: false,
        },
        interfaces: {
          enabled: false,
          useByDefault: false,
          useUnionTypes: false,
        },
        lcdClients: {
          enabled: false,
        },
        prototypes: {
          addTypeUrlToDecoders: true,
          addTypeUrlToObjects: true,
          enableRegistryLoader: false,
          enabled: true,
          methods: {
            decode: true,
            encode: true,
            fromAmino: true,
            fromJSON: true,
            fromProto: true,
            toAmino: true,
            toJSON: true,
            toProto: true,
          },
          parser: {
            keepCase: false,
          },
          typingsFormat: {
            customTypes: {
              useCosmosSDKDec: true,
            },
            duration: "duration",
            num64: "long",
            timestamp: "date",
            useDeepPartial: false,
            useExact: false,
          },
        },
        rpcClients: {
          enabled: false,
        },
        stargateClients: {
          enabled: false,
        },
        tsDisable: {
          disableAll: true,
        },
      },
    });
  } catch (err) {
    console.error("Failed to generate telescope:", err);
  }
}

async function collectChains({ registryPath, isCamelCase }) {
  try {
    const mainnetDir = path.join(registryPath, "mainnet");
    const testnetDir = path.join(registryPath, "testnet");

    const mainnetChains = await collectChainData(mainnetDir, isCamelCase);
    const testnetChains = await collectChainData(testnetDir, isCamelCase);

    return [...mainnetChains, ...testnetChains];
  } catch (error) {
    console.log(`Error processing ${registryPath}:`, error);
  }
}

async function collectChainData(directory, isCamelCase) {
  const chains = [];
  try {
    const dirEntries = await fs.readdir(directory, { withFileTypes: true });

    for (const dirent of dirEntries) {
      if (dirent.isDirectory()) {
        const chainName = dirent.name;
        const chainJsPath = path.join(directory, chainName, "chain.js");
        try {
          const chainModule = require(chainJsPath);
          const chainData = chainModule.default || chainModule;

          // Process the chain data to extract desired properties
          const chainArray = Array.isArray(chainData) ? chainData : [chainData];
          for (const chain of chainArray) {
            if (isCamelCase) {
              const extractedData = extractCamelCaseProperties(chain);
              chains.push(extractedData);
            } else {
              const extractedData = extractProperties(chain);
              chains.push(extractedData);
            }
          }
        } catch (error) {
          console.error(`Failed to import ${chainJsPath}:`, error);
        }
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${directory}:`, error);
  }
  console.log( `Collected ${chains.length} chains from ${directory}`);
  return chains;
}

function extractProperties(chain) {
  return {
    chainId: chain.chain_id,
    fees: {
      feeTokens: toCamel(chain.fee_tokens || []),
      gasPriceStep: toCamel(chain.fees?.gas_price_step || {}),
      gasAdjustment: chain.fees?.gas_adjustment,
    },
    apis: {
      rpc: chain.apis?.rpc || [],
    },
    keyAlgos: chain.key_algos,
    extraCodecs: chain.extra_codecs,
  };
}

function extractCamelCaseProperties(chain) {
  return {
    chainId: chain.chainId,
    fees: chain.fees,
    apis: {
      rpc: chain.apis?.rpc || [],
    },
    keyAlgos: chain.keyAlgos,
    extraCodecs: chain.extraCodecs,
  };
}

async function codegen() {
  await fs
    .rm(outPath, { recursive: true, force: true })
    .catch(() => {})
    .then(() => fs.mkdir(outPath, { recursive: true }))
    .then(() => fs.writeFile(path.resolve(outPath, ".gitkeep"), "", "utf-8"));

  await genTelescope();
  await fixProtobufjsImports(outPath);

  let allChains = [];

  for (const registry of registries) {
    const chains = await collectChains(registry);
    allChains = mergeArrays(allChains, chains);
  }
  console.log(`Collected ${allChains.length} chains from all registries.`);
  // Write all chains to a single JSON file
  const outputFilePath = path.resolve(outPath, "chains.json");
  await fs.writeFile(outputFilePath, JSON.stringify(allChains), "utf-8");
}

const mergeArrays = (arr1, arr2) => {
  const merged = [...arr1, ...arr2];
  const map = new Map();

  merged.forEach((item) => {
    map.set(item.chainId, item); // second occurrence overwrites first
  });

  return Array.from(map.values());
};

async function fixProtobufjsImports(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await fixProtobufjsImports(fullPath);
    } else if (entry.isFile() && entry.name.endsWith(".ts")) {
      let content = await fs.readFile(fullPath, "utf-8");
      let updated = content;

      // Replace import * as x from 'protobufjs/minimal'; with import x from 'protobufjs/minimal.js'
      updated = updated.replace(
        /import\s+\*\s+as\s+(\w+)\s+from\s+['"]protobufjs\/minimal(?:\.js)?['"];/g,
        'import $1 from "protobufjs/minimal.js";'
      );

      updated = updated.replace(
        `import { HttpEndpoint } from "@cosmjs/tendermint-rpc";`,
        'import type { HttpEndpoint } from "@cosmjs/stargate";'
      );

      if (updated !== content) {
        await fs.writeFile(fullPath, updated, "utf-8");
      }
    }
  }
}

void codegen();
