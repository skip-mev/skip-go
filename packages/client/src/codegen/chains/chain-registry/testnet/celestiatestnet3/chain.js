"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const info = {
    $schema: '../../chain.schema.json',
    chain_name: 'celestiatestnet3',
    chain_type: 'cosmos',
    chain_id: 'mocha-4',
    pretty_name: 'Mocha Testnet',
    status: 'live',
    network_type: 'testnet',
    bech32_prefix: 'celestia',
    daemon_name: 'celestia-appd',
    node_home: '$HOME/.celestia-app',
    key_algos: ['secp256k1'],
    slip44: 118,
    fees: {
        fee_tokens: [{
                denom: 'utia',
                fixed_min_gas_price: 0,
                low_gas_price: 0.01,
                average_gas_price: 0.02,
                high_gas_price: 0.1
            }]
    },
    codebase: {},
    apis: {
        rpc: [
            {
                address: 'https://rpc-mocha.pops.one',
                provider: 'P-OPs'
            },
            {
                address: 'https://celestia-testnet-rpc.publicnode.com:443',
                provider: 'Allnodes ⚡️ Nodes & Staking'
            },
            {
                address: 'https://rpc-mocha-full.avril14th.org',
                provider: 'Avril 14th'
            },
            {
                address: 'https://celestia-testnet-rpc.itrocket.net',
                provider: '🚀ITRocket🚀'
            },
            {
                address: 'https://rpc-celestia-testnet.cryptech.com.ua',
                provider: 'CrypTech'
            },
            {
                address: 'https://rpc.celestia.testnet.dteam.tech:443',
                provider: 'DTEAM'
            }
        ],
        rest: [
            {
                address: 'https://api-mocha.pops.one',
                provider: 'P-OPs'
            },
            {
                address: 'https://celestia-testnet-rest.publicnode.com',
                provider: 'Allnodes ⚡️ Nodes & Staking'
            },
            {
                address: 'https://api-mocha-full.avril14th.org',
                provider: 'Avril 14th'
            },
            {
                address: 'https://celestia-testnet-api.itrocket.net',
                provider: '🚀ITRocket🚀'
            },
            {
                address: 'https://api-celestia-testnet.cryptech.com.ua',
                provider: 'CrypTech'
            },
            {
                address: 'https://api.celestia.testnet.dteam.tech:443',
                provider: 'DTEAM'
            }
        ],
        grpc: [
            {
                address: 'celestia-testnet-grpc.publicnode.com:443',
                provider: 'Allnodes ⚡️ Nodes & Staking'
            },
            {
                address: 'grpc-mocha-full.avril14th.org',
                provider: 'Avril 14th'
            },
            {
                address: 'celestia-testnet-grpc.itrocket.net:11090',
                provider: '🚀ITRocket🚀'
            },
            {
                address: 'https://grpc-celestia-testnet.cryptech.com.ua',
                provider: 'CrypTech'
            },
            {
                address: 'grpc.celestia.testnet.dteam.tech:27090',
                provider: 'DTEAM'
            }
        ]
    },
    explorers: [
        {
            kind: 'Mintscan',
            url: 'https://mintscan.io/celestia-testnet',
            tx_page: 'https://mintscan.io/celestia-testnet/txs/${txHash}'
        },
        {
            kind: '🚀ITRocket🚀',
            url: 'https://testnet.itrocket.net/celestia',
            tx_page: 'https://testnet.itrocket.net/celestia/tx/${txHash}',
            account_page: 'https://testnet.itrocket.net/celestia/account/${accountAddress}'
        },
        {
            kind: 'CrypTech',
            url: 'https://explorers.cryptech.com.ua/Celestia-Testnet',
            tx_page: 'https://explorers.cryptech.com.ua/Celestia-Testnet/tx/${txHash}',
            account_page: 'https://explorers.cryptech.com.ua/Celestia-Testnet/account/${accountAddress}'
        },
        {
            kind: 'DTEAM | Explorer',
            url: 'https://explorer.testnet.dteam.tech/celestia',
            tx_page: 'https://explorer.testnet.dteam.tech/celestia/tx/${txHash}',
            account_page: 'https://explorer.testnet.dteam.tech/celestia/account/${accountAddress}'
        }
    ]
};
exports.default = info;
