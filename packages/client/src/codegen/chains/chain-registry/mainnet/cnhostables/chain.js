"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const info = {
    $schema: '../chain.schema.json',
    chain_name: 'cnhostables',
    status: 'live',
    network_type: 'mainnet',
    website: 'https://cnho.io/',
    pretty_name: 'CNHO Stables',
    chain_type: 'cosmos',
    chain_id: 'cnho_stables-1',
    bech32_prefix: 'cnho',
    daemon_name: 'cnho',
    node_home: '$HOME/.cnho',
    slip44: 118,
    fees: {
        fee_tokens: [{
                denom: 'ucnho',
                fixed_min_gas_price: 0.000005,
                low_gas_price: 0.000001,
                average_gas_price: 0.00001,
                high_gas_price: 0.025
            }]
    },
    staking: {
        staking_tokens: [{
                denom: 'ucnho'
            }]
    },
    codebase: {
        cosmos_sdk_version: 'v0.46.7',
        cosmwasm_enabled: false
    },
    logo_URIs: {
        png: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/cnhostables/images/chain.png',
        svg: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/cnhostables/images/chain.svg'
    },
    description: 'CNHO Stables Network is designed to facilitate the real world asset in Cosmos ecosystem.',
    apis: {
        rpc: [{
                address: 'https://rpc.cnho.io',
                provider: 'CNHO Stables'
            }, {
                address: 'https://cnhostables_mainnet_rpc.chain.whenmoonwhenlambo.money',
                provider: '🚀 WHEN MOON 🌕 WHEN LAMBO 🔥'
            }],
        rest: [{
                address: 'https://api.cnho.io',
                provider: 'CNHO Stables'
            }, {
                address: 'https://cnhostables_mainnet_api.chain.whenmoonwhenlambo.money',
                provider: '🚀 WHEN MOON 🌕 WHEN LAMBO 🔥'
            }],
        grpc: [{
                address: '159.138.232.248:9090',
                provider: 'CNHO Stables'
            }]
    },
    explorers: [{
            url: 'https://explorer.cnho.io',
            tx_page: 'https://explorer.cnho.io/transaction/${txHash}',
            account_page: 'https://explorer.cnho.io/account/${accountAddress}'
        }, {
            kind: '🚀 WHEN MOON 🌕 WHEN LAMBO 🔥',
            url: 'https://explorer.whenmoonwhenlambo.money/cnhostables',
            tx_page: 'https://explorer.whenmoonwhenlambo.money/cnhostables/tx/${txHash}',
            account_page: 'https://explorer.whenmoonwhenlambo.money/cnhostables/account/${accountAddress}'
        }],
    keywords: ['CNHO'],
    images: [{
            png: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/cnhostables/images/chain.png',
            svg: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/cnhostables/images/chain.svg',
            theme: {
                primary_color_hex: '#708ffc'
            }
        }]
};
exports.default = info;
