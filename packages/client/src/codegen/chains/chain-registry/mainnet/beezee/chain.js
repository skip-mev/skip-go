"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const info = {
    $schema: '../chain.schema.json',
    chain_name: 'beezee',
    status: 'live',
    network_type: 'mainnet',
    pretty_name: 'BeeZee',
    chain_type: 'cosmos',
    chain_id: 'beezee-1',
    bech32_prefix: 'bze',
    daemon_name: 'bzed',
    node_home: '$HOME/.bze',
    key_algos: ['secp256k1'],
    slip44: 118,
    fees: {
        fee_tokens: [{
                denom: 'ubze',
                fixed_min_gas_price: 0.01,
                low_gas_price: 0.01,
                average_gas_price: 0.025,
                high_gas_price: 0.04
            }]
    },
    staking: {
        staking_tokens: [{
                denom: 'ubze'
            }]
    },
    codebase: {},
    logo_URIs: {
        png: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/beezee/images/bze.png',
        svg: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/beezee/images/bze.svg'
    },
    apis: {
        rpc: [
            {
                address: 'https://rpc.getbze.com',
                provider: 'AlphaTeam'
            },
            {
                address: 'https://rpc-1.getbze.com',
                provider: 'AlphaTeam'
            },
            {
                address: 'https://rpc-2.getbze.com',
                provider: 'AlphaTeam'
            },
            {
                address: 'https://beezee_mainnet_rpc.chain.whenmoonwhenlambo.money',
                provider: '🚀 WHEN MOON 🌕 WHEN LAMBO 🔥'
            }
        ],
        rest: [
            {
                address: 'https://rest.getbze.com',
                provider: 'AlphaTeam'
            },
            {
                address: 'https://rest-1.getbze.com',
                provider: 'AlphaTeam'
            },
            {
                address: 'https://rest-2.getbze.com',
                provider: 'AlphaTeam'
            },
            {
                address: 'https://beezee_mainnet_api.chain.whenmoonwhenlambo.money',
                provider: '🚀 WHEN MOON 🌕 WHEN LAMBO 🔥'
            }
        ],
        grpc: [
            {
                address: 'grpc.getbze.com:9099',
                provider: 'AlphaTeam'
            },
            {
                address: 'grpc-1.getbze.com:9099',
                provider: 'AlphaTeam'
            },
            {
                address: 'grpc-2.getbze.com:9099',
                provider: 'AlphaTeam'
            }
        ]
    },
    explorers: [
        {
            kind: 'ping.pub',
            url: 'https://ping.pub/beezee',
            tx_page: 'https://ping.pub/beezee/tx/${txHash}',
            account_page: 'https://ping.pub/beezee/account/${accountAddress}'
        },
        {
            kind: 'ping.pub',
            url: 'https://explorer.getbze.com/beezee',
            tx_page: 'https://explorer.getbze.com/beezee/tx/${txHash}',
            account_page: 'https://explorer.getbze.com/beezee/account/${accountAddress}'
        },
        {
            kind: 'atomscan',
            url: 'https://atomscan.com/beezee',
            tx_page: 'https://atomscan.com/beezee/transactions/${txHash}',
            account_page: 'https://atomscan.com/beezee/accounts/${accountAddress}'
        },
        {
            kind: '🚀 WHEN MOON 🌕 WHEN LAMBO 🔥',
            url: 'https://explorer.whenmoonwhenlambo.money/beezee',
            tx_page: 'https://explorer.whenmoonwhenlambo.money/beezee/tx/${txHash}',
            account_page: 'https://explorer.whenmoonwhenlambo.money/beezee/account/${accountAddress}'
        }
    ],
    images: [{
            png: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/beezee/images/bze.png',
            svg: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/beezee/images/bze.svg',
            theme: {
                primary_color_hex: '#079fd7'
            }
        }]
};
exports.default = info;
