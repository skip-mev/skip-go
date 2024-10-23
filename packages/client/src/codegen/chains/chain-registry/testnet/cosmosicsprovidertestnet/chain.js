"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const info = {
    $schema: '../../chain.schema.json',
    chain_name: 'cosmosicsprovidertestnet',
    chain_type: 'cosmos',
    chain_id: 'provider',
    pretty_name: 'Cosmos ICS Provider Testnet',
    status: 'live',
    network_type: 'testnet',
    bech32_prefix: 'cosmos',
    daemon_name: 'gaiad',
    node_home: '$HOME/.gaia',
    key_algos: ['secp256k1'],
    slip44: 118,
    fees: {
        fee_tokens: [{
                denom: 'uatom',
                fixed_min_gas_price: 0.005,
                low_gas_price: 0.01,
                average_gas_price: 0.025,
                high_gas_price: 0.03
            }]
    },
    staking: {
        staking_tokens: [{
                denom: 'uatom'
            }]
    },
    codebase: {
        cosmos_sdk_version: 'v0.47.16-ics-lsm'
    },
    apis: {
        rpc: [
            {
                address: 'https://rpc.provider-sentry-01.rs-testnet.polypore.xyz',
                provider: 'Hypha'
            },
            {
                address: 'https://rpc.provider-sentry-02.rs-testnet.polypore.xyz',
                provider: 'Hypha'
            },
            {
                address: 'https://rpc.provider-state-sync-01.rs-testnet.polypore.xyz',
                provider: 'Hypha'
            },
            {
                address: 'https://rpc.provider-state-sync-02.rs-testnet.polypore.xyz',
                provider: 'Hypha'
            }
        ],
        rest: [
            {
                address: 'https://rest.provider-sentry-01.rs-testnet.polypore.xyz',
                provider: 'Hypha'
            },
            {
                address: 'https://rest.provider-sentry-02.rs-testnet.polypore.xyz',
                provider: 'Hypha'
            },
            {
                address: 'https://rest.provider-state-sync-01.rs-testnet.polypore.xyz',
                provider: 'Hypha'
            },
            {
                address: 'https://rest.provider-state-sync-02.rs-testnet.polypore.xyz',
                provider: 'Hypha'
            }
        ],
        grpc: [
            {
                address: 'https://grpc.provider-sentry-01.rs-testnet.polypore.xyz',
                provider: 'Hypha'
            },
            {
                address: 'https://grpc.provider-sentry-02.rs-testnet.polypore.xyz',
                provider: 'Hypha'
            },
            {
                address: 'https://grpc.provider-state-sync-01.rs-testnet.polypore.xyz',
                provider: 'Hypha'
            },
            {
                address: 'https://grpc.provider-state-sync-02.rs-testnet.polypore.xyz',
                provider: 'Hypha'
            }
        ]
    },
    explorers: [{
            kind: 'Mintscan',
            url: 'https://mintscan.io/ics-testnet-provider',
            tx_page: 'https://mintscan.io/ics-testnet-provider/txs/${txHash}'
        }, {
            kind: 'Ping.pub',
            url: 'https://explorer.rs-testnet.polypore.xyz/provider',
            tx_page: 'https://explorer.rs-testnet.polypore.xyz/provider/tx/${txHash}'
        }]
};
exports.default = info;
