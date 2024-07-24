import { Chain } from '@chain-registry/types';
import * as chainRegistry from 'chain-registry';
import * as initiaRegistry from '@initia/initia-registry';

/** @deprecated */
const DYDX_CHAIN = {
  $schema: '../chain.schema.json',
  chain_name: 'dydx',
  status: 'live',
  website: 'https://dydx.exchange/',
  network_type: 'mainnet',
  pretty_name: 'dYdX Protocol',
  chain_id: 'dydx-mainnet-1',
  bech32_prefix: 'dydx',
  daemon_name: 'dydxprotocold',
  node_home: '$HOME/.dydxprotocol',
  key_algos: ['secp256k1'],
  slip44: 118,
  fees: {
    fee_tokens: [
      {
        denom: 'adydx',
        fixed_min_gas_price: 12500000000,
        low_gas_price: 12500000000,
        average_gas_price: 12500000000,
        high_gas_price: 20000000000,
      },
      {
        denom:
          'ibc/8E27BA2D5493AF5636760E354E46004562C46AB7EC0CC4C1CA14E9E20E2545B5',
        fixed_min_gas_price: 0.025,
        low_gas_price: 0.025,
        average_gas_price: 0.025,
        high_gas_price: 0.03,
      },
    ],
  },
  staking: {
    staking_tokens: [
      {
        denom: 'adydx',
      },
    ],
  },
  codebase: {
    git_repo: 'https://github.com/dydxprotocol/v4-chain/',
    recommended_version: 'v1.0.0',
    compatible_versions: ['v1.0.0'],
    cosmos_sdk_version: 'v0.47.4',
    cosmwasm_enabled: false,
    genesis: {
      genesis_url:
        'https://raw.githubusercontent.com/dydxopsdao/networks/main/dydx-mainnet-1/genesis.json',
    },
    versions: [
      {
        name: 'v1',
        recommended_version: 'v1.0.0',
        compatible_versions: ['v1.0.0'],
        cosmos_sdk_version: 'v0.47.4',
      },
    ],
  },
  logo_URIs: {
    png: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/dydx/images/dydx.png',
    svg: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/dydx/images/dydx.svg',
  },
  peers: {
    seeds: [
      {
        id: '20e1000e88125698264454a884812746c2eb4807',
        address: 'seeds.lavenderfive.com:23856',
        provider: 'Lavender.Five Nodes 🐝',
      },
      {
        id: 'ebc272824924ea1a27ea3183dd0b9ba713494f83',
        address: 'dydx-mainnet-seed.autostake.com:27366',
        provider: 'AutoStake 🛡️ Slash Protected',
      },
      {
        id: '65b740ee326c9260c30af1f044e9cda63c73f7c1',
        address: 'seeds.kingnodes.net:23856',
        provider: 'Kingnodes',
      },
      {
        id: '4c30c8a95e26b07b249813b677caab28bf0c54eb',
        address: 'rpc.dydx.nodestake.top:666',
        provider: 'NodeStake',
      },
      {
        id: '400f3d9e30b69e78a7fb891f60d76fa3c73f0ecc',
        address: 'dydx.rpc.kjnodes.com:17059',
        provider: 'kjnodes',
      },
      {
        id: 'e1b058e5cfa2b836ddaa496b10911da62dcf182e',
        address: 'dydx-seed-de.allnodes.me:26656',
        provider: 'Allnodes ⚡️ Nodes & Staking',
      },
      {
        id: 'e726816f42831689eab9378d5d577f1d06d25716',
        address: 'dydx-seed-us.allnodes.me:26656',
        provider: 'Allnodes ⚡️ Nodes & Staking',
      },
    ],
    persistent_peers: [
      {
        id: 'ebc272824924ea1a27ea3183dd0b9ba713494f83',
        address: 'dydx-mainnet-peer.autostake.com:27366',
        provider: 'AutoStake 🛡️ Slash Protected',
      },
    ],
  },
  apis: {
    rpc: [
      {
        address: 'https://dydx-rpc.lavenderfive.com:443',
        provider: 'Lavender.Five Nodes 🐝',
      },
      {
        address: 'https://dydx-mainnet-rpc.autostake.com:443',
        provider: 'AutoStake 🛡️ Slash Protected',
      },
      {
        address: 'https://rpc-dydx.ecostake.com:443',
        provider: 'ecostake',
      },
      {
        address: 'https://rpc.dydx.nodestake.top:443',
        provider: 'NodeStake',
      },
      {
        address: 'https://dydx.rpc.kjnodes.com:443',
        provider: 'kjnodes',
      },
      {
        address: 'https://dydx-rpc.publicnode.com:443',
        provider: 'Allnodes ⚡️ Nodes & Staking',
      },
    ],
    rest: [
      {
        address: 'https://dydx-api.lavenderfive.com:443',
        provider: 'Lavender.Five Nodes 🐝',
      },
      {
        address: 'https://dydx-mainnet-lcd.autostake.com:443',
        provider: 'AutoStake 🛡️ Slash Protected',
      },
      {
        address: 'https://rest-dydx.ecostake.com:443',
        provider: 'ecostake',
      },
      {
        address: 'https://api.dydx.nodestake.top:443',
        provider: 'NodeStake',
      },
      {
        address: 'https://dydx.api.kjnodes.com:443',
        provider: 'kjnodes',
      },
      {
        address: 'https://dydx-rest.publicnode.com',
        provider: 'Allnodes ⚡️ Nodes & Staking',
      },
    ],
    grpc: [
      {
        address: 'https://dydx-grpc.lavenderfive.com',
        provider: 'Lavender.Five Nodes 🐝',
      },
      {
        address: 'dydx-mainnet-grpc.autostake.com:443',
        provider: 'AutoStake 🛡️ Slash Protected',
      },
      {
        address: 'https://grpc.dydx.nodestake.top',
        provider: 'NodeStake',
      },
      {
        address: 'dydx.grpc.kjnodes.com:443',
        provider: 'kjnodes',
      },
      {
        address: 'dydx-grpc.publicnode.com:443',
        provider: 'Allnodes ⚡️ Nodes & Staking',
      },
    ],
  },
  explorers: [
    {
      kind: 'mintscan',
      url: 'https://www.mintscan.io/dydx',
      tx_page: 'https://www.mintscan.io/dydx/txs/${txHash}',
      account_page: 'https://www.mintscan.io/dydx/account/${accountAddress}',
    },
    {
      kind: 'NodeStake',
      url: 'https://explorer.nodestake.top/dydx/',
      tx_page: 'https://explorer.nodestake.top/dydx/txs/${txHash}',
      account_page:
        'https://explorer.nodestake.top/dydx/account/${accountAddress}',
    },
  ],
  images: [
    {
      png: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/dydx/images/dydx.png',
      svg: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/dydx/images/dydx.svg',
    },
  ],
};

/** @deprecated */
const CELESTIA_CHAIN = {
  $schema: '../chain.schema.json',
  chain_name: 'celestia',
  chain_id: 'celestia',
  pretty_name: 'Celestia',
  status: 'live',
  network_type: 'mainnet',
  bech32_prefix: 'celestia',
  daemon_name: 'celestia-appd',
  node_home: '$HOME/.celestia-app',
  key_algos: ['secp256k1'],
  slip44: 118,
  fees: {
    fee_tokens: [
      {
        denom: 'utia',
        fixed_min_gas_price: 0,
        low_gas_price: 0.1,
        average_gas_price: 0.2,
        high_gas_price: 0.4,
      },
    ],
  },
  codebase: {
    git_repo: 'https://github.com/celestiaorg/celestia-app',
    recommended_version: 'v1.3.0',
    compatible_versions: ['v1.3.0'],
    genesis: {
      genesis_url:
        'https://raw.githubusercontent.com/celestiaorg/networks/master/celestia/genesis.json',
    },
    versions: [
      {
        name: 'v1.3.0',
        recommended_version: 'v1.3.0',
        compatible_versions: ['v1.3.0'],
      },
    ],
  },
  peers: {
    seeds: [
      {
        id: 'e6116822e1a5e283d8a85d3ec38f4d232274eaf3',
        address: 'consensus-full-seed-1.celestia-bootstrap.net:26656',
        provider: 'Celestia Foundation',
      },
      {
        id: 'cf7ac8b19ff56a9d47c75551bd4864883d1e24b5',
        address: 'consensus-full-seed-1.celestia-bootstrap.net:26656',
        provider: 'Celestia Foundation',
      },
    ],
  },
  apis: {
    rpc: [
      {
        address: 'https://public-celestia-rpc.numia.xyz',
        provider: 'Numia',
      },
      {
        address: 'https://celestia-rpc.mesa.newmetric.xyz',
        provider: 'Newmetric',
      },
      {
        address: 'https://rpc.lunaroasis.net',
        provider: 'Lunar Oasis',
      },
    ],
    rest: [
      {
        address: 'https://public-celestia-lcd.numia.xyz',
        provider: 'Numia',
      },
      {
        address: 'https://celestia-rest.mesa.newmetric.xyz',
        provider: 'Newmetric',
      },
      {
        address: 'https://api.lunaroasis.net',
        provider: 'Lunar Oasis',
      },
    ],
  },
  explorers: [
    {
      kind: 'Mintscan',
      url: 'https://mintscan.io/celestia',
      tx_page: 'https://mintscan.io/celestia/txs/${txHash}',
    },
  ],
};

/** @deprecated */
export function chains(): Chain[] {
  const chains = chainRegistry.chains;

  if (chains.findIndex((chain) => chain.chain_id === 'dydx-mainnet-1') === -1) {
    chains.push(DYDX_CHAIN);
  }

  if (chains.findIndex((chain) => chain.chain_id === 'celestia') === -1) {
    chains.push(CELESTIA_CHAIN);
  }

  return chains;
}

export function initiaChains(): Chain[] {
  const chains = initiaRegistry.chains as Chain[];

  return chains;
}
