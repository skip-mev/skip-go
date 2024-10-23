"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const info = {
    $schema: '../../chain.schema.json',
    chain_name: 'humanstestnet',
    chain_type: 'cosmos',
    chain_id: 'testnet-1',
    pretty_name: 'Humans AI Testnet',
    status: 'live',
    network_type: 'testnet',
    bech32_prefix: 'humans',
    daemon_name: 'humansd',
    node_home: '$HOME/.humans',
    key_algos: ['secp256k1'],
    slip44: 118,
    fees: {
        fee_tokens: [{
                denom: 'uheart',
                fixed_min_gas_price: 0
            }]
    },
    codebase: {},
    apis: {
        rpc: [{
                address: 'https://humans-testnet.nodejumper.io',
                provider: 'NODEJUMPER'
            }],
        rest: [{
                address: 'https://humans-testnet.nodejumper.io:1317',
                provider: 'NODEJUMPER'
            }],
        grpc: [{
                address: 'https://humans-testnet.nodejumper.io:9090',
                provider: 'NODEJUMPER'
            }]
    },
    explorers: [{
            kind: 'explorer.humans.zone',
            url: 'https://explorer.humans.zone/',
            tx_page: 'https://explorer.humans.zone/humans-testnet/tx/${txHash}'
        }]
};
exports.default = info;
