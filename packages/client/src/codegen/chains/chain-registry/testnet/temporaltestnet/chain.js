"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const info = {
    $schema: '../../chain.schema.json',
    chain_name: 'temporaltestnet',
    chain_type: 'cosmos',
    chain_id: 'temporal-test-2',
    pretty_name: 'Temporal Testnet',
    status: 'killed',
    network_type: 'testnet',
    bech32_prefix: 'temporal',
    daemon_name: 'temporald',
    node_home: '$HOME/.temporal',
    key_algos: ['secp256k1'],
    slip44: 118,
    fees: {
        fee_tokens: [{
                denom: 'utprl',
                fixed_min_gas_price: 0
            }]
    },
    staking: {
        staking_tokens: [{
                denom: 'utprl'
            }]
    },
    codebase: {},
    apis: {
        rpc: [{
                address: 'https://rpc.yieldmos.com/temporal-test-2',
                provider: 'Yieldmos'
            }, {
                address: 'https://testnet-temporal-rpc.lavenderfive.com:443',
                provider: 'Lavender.Five'
            }],
        rest: [{
                address: 'https://lcd.yieldmos.com/temporal-test-2',
                provider: 'Yieldmos'
            }, {
                address: 'https://testnet-temporal-api.lavenderfive.com:443',
                provider: 'Lavender.Five'
            }],
        grpc: [{
                address: '142.132.157.153:24190',
                provider: 'Yieldmos'
            }]
    },
    explorers: [
        {
            kind: 'ping.pub',
            url: 'https://testnet.explorer.thesilverfox.pro/temporal',
            tx_page: 'https://testnet.explorer.thesilverfox.pro/temporal/tx/${txHash}'
        },
        {
            kind: 'Nodes.Guru',
            url: 'https://testnet.temporal.explorers.guru',
            tx_page: 'https://testnet.temporal.explorers.guru/transaction/${txHash}'
        },
        {
            kind: 'ping.pub',
            url: 'https://testnet.ping.pub/temporal',
            tx_page: 'https://testnet.ping.pub/temporal/tx/${txHash}'
        }
    ]
};
exports.default = info;
