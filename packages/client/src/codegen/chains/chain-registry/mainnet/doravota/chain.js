"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const info = {
    $schema: '../chain.schema.json',
    chain_name: 'doravota',
    chain_type: 'cosmos',
    chain_id: 'vota-ash',
    pretty_name: 'Dora Vota',
    status: 'live',
    network_type: 'mainnet',
    bech32_prefix: 'dora',
    daemon_name: 'dorad',
    node_home: '$HOME/.dora',
    key_algos: ['secp256k1'],
    slip44: 118,
    fees: {
        fee_tokens: [{
                denom: 'peaka',
                fixed_min_gas_price: 100000000000,
                low_gas_price: 100000000000,
                average_gas_price: 100000000000,
                high_gas_price: 100000000000
            }]
    },
    staking: {
        staking_tokens: [{
                denom: 'peaka'
            }]
    },
    codebase: {},
    apis: {
        rpc: [
            {
                address: 'https://vota-rpc.dorafactory.org/',
                provider: 'dorafactory'
            },
            {
                address: 'https://m-dora.rpc.utsa.tech',
                provider: 'lesnik | UTSA'
            },
            {
                address: 'https://dora-rpc.publicnode.com:443',
                provider: 'Allnodes ⚡️ Nodes & Staking'
            }
        ],
        rest: [
            {
                address: 'https://vota-rest.dorafactory.org',
                provider: 'dorafactory'
            },
            {
                address: 'https://m-dora.api.utsa.tech',
                provider: 'lesnik | UTSA'
            },
            {
                address: 'https://dora-rest.publicnode.com',
                provider: 'Allnodes ⚡️ Nodes & Staking'
            }
        ],
        grpc: [{
                address: 'vota-grpc.dorafactory.org:443',
                provider: 'dorafactory'
            }, {
                address: 'dora-grpc.publicnode.com:443',
                provider: 'Allnodes ⚡️ Nodes & Staking'
            }]
    },
    explorers: [{
            kind: 'Dora Vota Ping Pub',
            url: 'https://vota-explorer.dorafactory.org',
            tx_page: 'https://vota-explorer.dorafactory.org/doravota/tx/${txHash}'
        }, {
            kind: 'lesnik | UTSA Ping Pub',
            url: 'https://exp.utsa.tech/dora/staking',
            tx_page: 'https://exp.utsa.tech/dora/tx/${txHash}'
        }]
};
exports.default = info;
