import type { Chain } from "@chain-registry/types";
import chainRegistryChains from "./codegen/chains.json";

const retiredChainIds = new Set([
  "ledger-mainnet-1",
  "ledger-testnet-1",
]);

const activeChainRegistryChains = chainRegistryChains.filter(
  (chain) => !retiredChainIds.has(chain.chainId),
);

const SOLANA_CHAIN: Chain = {
  chainName: "solana",
  chainId: "solana",
  prettyName: "Solana",
  networkType: "mainnet",
  website: "https://solana.com",
  bech32Prefix: "",
  daemonName: "",
  nodeHome: "",
  codebase: {
    gitRepo: "https://github.com/solana-labs/solana",
  },
  logoURIs: {
    png: "https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/solana/asset/sol.png",
  },
  apis: {
    rpc: [
      {
        address: "https://api.mainnet-beta.solana.com",
        provider: "Solana Foundation",
      },
      {
        address: "https://mainnet.helius-rpc.com/?api-key=6cadbc95-3333-488f-a187-21ffd0c5fef3",
        provider: "Helius",
      },
    ],
  },
  explorers: [
    {
      kind: "blockchain",
      url: "https://explorer.solana.com",
      txPage: "https://explorer.solana.com/tx/${txHash}",
      accountPage: "https://explorer.solana.com/address/${accountAddress}",
    },
    {
      kind: "Solscan",
      url: "https://solscan.io",
      txPage: "https://solscan.io/tx/${txHash}",
      accountPage: "https://solscan.io/account/${accountAddress}",
    },
  ],
  images: [
    {
      png: "https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/solana/asset/sol.png",
    },
  ],
  chainType: "solana"
};

const additionalChains = [SOLANA_CHAIN] as Chain[];
const existingChainIds = new Set(
  activeChainRegistryChains.map((chain) => chain.chainId),
);
const newChains = additionalChains.filter(
  (chain) => !existingChainIds.has(chain.chainId),
);

export function chains(): Chain[] {
  return [...(activeChainRegistryChains as Chain[]), ...newChains];
}

export const getIsEthermint = (chainId: string) => {
  const chain = chains().find((c) => c.chainId === chainId);
  if(chain?.chainId?.includes("injective")) return true;
  if (!chain) return false;
  const keyAlgos = chain.keyAlgos;
  const extraCodecs = chain.extraCodecs;
  return (
    Boolean(keyAlgos?.includes("ethsecp256k1")) ||
    Boolean(extraCodecs?.includes("ethermint"))
  );
};

export const getIsInitia = (chainId: string) => {
  const chain = chains().find((c) => c.chainId === chainId);
  if (!chain) return false;
  const keyAlgos = chain.keyAlgos;

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
            const rpc = new URL(endpoint);
            return rpc.toString();
          }
          case "rest": {
            const url = new URL(endpoint);
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
