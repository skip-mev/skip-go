// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require("fs/promises");
const path = require("path");
const telescope = require("@cosmology/telescope").default;
const protoDirs = require("../../../vendor");

async function codegen() {
  const outPath = path.resolve(__dirname, "../src/codegen/");

  await fs
    .rm(outPath, { recursive: true, force: true })
    .catch(() => {})
    .then(() => fs.mkdir(outPath, { recursive: true }))
    .then(() => fs.writeFile(path.resolve(outPath, ".gitkeep"), "", "utf-8"));

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
}

void codegen();
