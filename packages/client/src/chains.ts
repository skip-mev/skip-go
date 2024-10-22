import { Chain } from '@chain-registry/types';
import chainRegistryChains from "chain-registry/esm/chains";
import {
  chains as _testnetInitiaChains,
} from "chain-registry/testnet";
import {
  chains as _mainnetInitiaChains,
} from "chain-registry/mainnet";

const SOLANA_CHAIN = {
  chain_name: 'solana',
  chain_id: 'solana',
  pretty_name: 'Solana',
  network_type: 'mainnet',
  website: 'https://solana.com',
  bech32_prefix: '',
  daemon_name: '', // Not applicable for Solana
  node_home: '',   // Not applicable for Solana
  codebase: {
    git_repo: 'https://github.com/solana-labs/solana',
  },
  logo_URIs: {
    png: 'https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/solana/asset/sol.png',
  },
  apis: {
    rpc: [
      {
        address: 'https://api.mainnet-beta.solana.com',
        provider: 'Solana Foundation',
      },
      {
        address: 'https://mainnet.helius-rpc.com/?api-key=6cadbc95-3333-488f-a187-21ffd0c5fef3',
        provider: 'Helius',
      },
    ],
  },
  explorers: [
    {
      kind: 'blockchain',
      url: 'https://explorer.solana.com',
      tx_page: 'https://explorer.solana.com/tx/${txHash}',
      account_page: 'https://explorer.solana.com/address/${accountAddress}',
    },
    {
      kind: 'Solscan',
      url: 'https://solscan.io',
      tx_page: 'https://solscan.io/tx/${txHash}',
      account_page: 'https://solscan.io/account/${accountAddress}',
    },
  ],
  images: [
    {
      png: 'https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/solana/asset/sol.png',
    },
  ],
};

export function chains(): Chain[] {
  const additionalChains = [SOLANA_CHAIN] as Chain[];

  const existingChainIds = new Set((chainRegistryChains as Chain[]).map((chain) => chain.chain_id));

  const newChains = additionalChains.filter(
    (chain) => !existingChainIds.has(chain.chain_id)
  );

  return [...chainRegistryChains, ...newChains];
}

export function initiaChains(): Chain[] {
  const chains = [  
    ..._mainnetInitiaChains,
    ..._testnetInitiaChains,
  ] as Chain[];

  return chains;
}

export async function findFirstWorkingEndpoint(
  endpoints: string[],
  type: 'rpc' | 'rest'
): Promise<string | null> {
  for (const endpoint of endpoints) {
    try {
      const url = (() => {
        switch (type) {
          case 'rpc':
            const rpc = new URL('health', endpoint);
            return rpc.toString();
          case 'rest':
            const url = new URL(
              'cosmos/base/tendermint/v1beta1/node_info',
              endpoint
            );
            return url.toString();
          default:
            throw new Error(`Unknown endpoint type: ${type}`);
        }
      })();
      const response = await fetch(url);

      if (response.ok) {
        return endpoint;
      } else {
        console.error(
          `Error: ${endpoint} responded with status ${response.status}`
        );
      }
    } catch (error) {
      console.error(`Failed to fetch ${endpoint}: ${(error as Error).message}`);
    }
  }

  console.error('No working endpoints found.');
  return null;
}
