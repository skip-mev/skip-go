import type { Chain } from "@chain-registry/types";
import chainRegistryChains from "./codegen/chains.json";

const SOLANA_CHAIN = {
  chain_name: "solana",
  chain_id: "solana",
  pretty_name: "Solana",
  network_type: "mainnet",
  website: "https://solana.com",
  bech32_prefix: "",
  daemon_name: "", // Not applicable for Solana
  node_home: "", // Not applicable for Solana
  codebase: {
    git_repo: "https://github.com/solana-labs/solana",
  },
  logo_URIs: {
    png: "https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/solana/asset/sol.png",
  },
  apis: {
    rpc: [
      {
        address: "https://api.mainnet-beta.solana.com",
        provider: "Solana Foundation",
      },
      {
        address:
          "https://mainnet.helius-rpc.com/?api-key=6cadbc95-3333-488f-a187-21ffd0c5fef3",
        provider: "Helius",
      },
    ],
  },
  explorers: [
    {
      kind: "blockchain",
      url: "https://explorer.solana.com",
      tx_page: "https://explorer.solana.com/tx/${txHash}",
      account_page: "https://explorer.solana.com/address/${accountAddress}",
    },
    {
      kind: "Solscan",
      url: "https://solscan.io",
      tx_page: "https://solscan.io/tx/${txHash}",
      account_page: "https://solscan.io/account/${accountAddress}",
    },
  ],
  images: [
    {
      png: "https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/solana/asset/sol.png",
    },
  ],
};

const lombardTestnet: Chain = {
  chain_id: "ledger-testnet-1",
  apis: {
    rpc: [
      {
        address: "https://rpc-gastald.lb-mgt.com:443",
      },
    ],
    rest: [
      {
        address: "https://rpc-gastald.lb-mgt.com/ipc",
      },
    ],
    grpc: [
      {
        address: "https://grpc-gastald.lb-mgt.com:443",
      },
    ],
  },
  fees: {
    fee_tokens: [
      {
        denom: "ulom",
        fixed_min_gas_price: 1,
        low_gas_price: 1,
        average_gas_price: 1,
        high_gas_price: 1,
      },
    ],
  },
  chain_name: "Ledger",
  chain_type: "cosmos",
};

const lombardMainnet: Chain = {
  chain_id: "ledger-mainnet-1",
  apis: {
    rpc: [
      {
        address: "https://rpc-mainnet.lb-mgt.com:443",
      },
    ],
    rest: [
      {
        address: "http://rpc-mainnet.lb-mgt.com:1317",
      },
    ],
    grpc: [
      {
        address: "https://grpc-mainnet.lb-mgt.com:443",
      },
    ],
  },
  fees: {
    fee_tokens: [
      {
        denom: "ulom",
        fixed_min_gas_price: 100,
        low_gas_price: 100,
        average_gas_price: 100,
        high_gas_price: 100,
      },
    ],
  },
  chain_name: "Ledger",
  chain_type: "cosmos",
};

const additionalChains = [
  SOLANA_CHAIN,
  lombardTestnet,
  lombardMainnet,
] as Chain[];
const existingChainIds = new Set(
  chainRegistryChains.map((chain) => chain.chain_id),
);
const newChains = additionalChains.filter(
  (chain) => !existingChainIds.has(chain.chain_id),
);

export function chains(): Chain[] {
  return [...(chainRegistryChains as Chain[]), ...newChains];
}

export const getIsEthermint = (chainId: string) => {
  const chain = chains().find((c) => c.chain_id === chainId);
  if (!chain) return false;
  const keyAlgos = chain.key_algos;
  const extraCodecs = chain.extra_codecs;
  return (
    Boolean(keyAlgos?.includes("ethsecp256k1")) ||
    Boolean(extraCodecs?.includes("ethermint"))
  );
};

export const getIsInitia = (chainId: string) => {
  const chain = chains().find((c) => c.chain_id === chainId);
  if (!chain) return false;
  const keyAlgos = chain.key_algos;

  // @ts-expect-error - initia chain have special key algo in the initia-registry
  return Boolean(keyAlgos?.includes("initia_ethsecp256k1"));
};

export async function findFirstWorkingEndpoint(
  endpoints: string[],
  type: "rpc" | "rest",
): Promise<string | null> {
  for (const endpoint of endpoints) {
    try {
      const url = (() => {
        switch (type) {
          case "rpc": {
            const rpc = new URL("health", endpoint);
            return rpc.toString();
          }
          case "rest": {
            const url = new URL(
              "cosmos/base/tendermint/v1beta1/node_info",
              endpoint,
            );
            return url.toString();
          }
          default:
            throw new Error(`Unknown endpoint type: ${type}`);
        }
      })();
      const response = await fetch(url);

      if (response.ok) {
        return endpoint;
      } else {
        console.error(
          `Error: ${endpoint} responded with status ${response.status}`,
        );
      }
    } catch (error) {
      console.error(`Failed to fetch ${endpoint}: ${(error as Error).message}`);
    }
  }

  console.error("No working endpoints found.");
  return null;
}
