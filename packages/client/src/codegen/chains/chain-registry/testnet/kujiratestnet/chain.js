"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const info = {
    $schema: '../../chain.schema.json',
    chain_name: 'kujiratestnet',
    chain_type: 'cosmos',
    chain_id: 'harpoon-4',
    pretty_name: 'Kujira Harpoon',
    status: 'live',
    network_type: 'testnet',
    bech32_prefix: 'kujira',
    daemon_name: 'kujirad',
    node_home: '$HOME/.kujira',
    key_algos: ['secp256k1'],
    slip44: 118,
    fees: {
        fee_tokens: [{
                denom: 'ukuji',
                fixed_min_gas_price: 0
            }]
    },
    codebase: {},
    apis: {
        rpc: [{
                address: 'https://kujira-testnet-rpc.polkachu.com',
                provider: 'polkachu'
            }],
        rest: [{
                address: 'https://kujira-testnet-api.polkachu.com/',
                provider: 'polkachu'
            }]
    },
    explorers: [{
            kind: 'explorers.guru',
            url: 'https://kujira.explorers.guru',
            tx_page: 'https://kujira.explorers.guru/transaction/${txHash}'
        }]
};
exports.default = info;
