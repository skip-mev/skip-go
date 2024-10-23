"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const info = {
    $schema: '../chain.schema.json',
    chain_name: 'noistestnet',
    status: 'live',
    network_type: 'testnet',
    website: 'https://nois.network',
    pretty_name: 'Nois',
    chain_type: 'cosmos',
    chain_id: 'nois-testnet-005',
    bech32_prefix: 'nois',
    daemon_name: 'noisd',
    node_home: '$HOME/.noisd',
    key_algos: ['secp256k1'],
    slip44: 118,
    fees: {
        fee_tokens: [{
                denom: 'unois',
                fixed_min_gas_price: 0,
                low_gas_price: 0.05,
                average_gas_price: 0.05,
                high_gas_price: 0.1
            }]
    },
    staking: {
        staking_tokens: [{
                denom: 'unois'
            }],
        lock_duration: {
            time: '1814400s'
        }
    },
    codebase: {
        cosmos_sdk_version: '0.45',
        cosmwasm_enabled: true,
        cosmwasm_version: '0.30'
    },
    images: [{
            png: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/nois/images/nois.png',
            theme: {
                primary_color_hex: '#0C0914'
            }
        }],
    logo_URIs: {
        png: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/nois/images/nois.png'
    },
    apis: {
        rpc: [
            {
                address: 'https://nois-testnet-rpc.polkachu.com',
                provider: 'Polkachu'
            },
            {
                address: 'https://nois-testnet-rpc.itrocket.net:443',
                provider: 'itrocket'
            },
            {
                address: 'https://rpc.nois.mcbnode.online:443',
                provider: 'mcbnode'
            },
            {
                address: 'https://nois-testnet.rpc.kjnodes.com:443',
                provider: 'kjnodes'
            },
            {
                address: 'https://tnois-rpc.systemd.run:443',
                provider: 'systemd'
            }
        ],
        grpc: [
            {
                address: 'tnois-grpc.systemd.run:443',
                provider: 'systemd'
            },
            {
                address: 'http://nois.grpc.t.stavr.tech:191',
                provider: '🔥STAVR🔥'
            },
            {
                address: 'nois-testnet-grpc.itrocket.net:21090',
                provider: 'itrocket'
            }
        ],
        rest: [
            {
                address: 'https://api.nois.mcbnode.online',
                provider: 'mcbnode'
            },
            {
                address: 'https://nois3.api.t.stavr.tech',
                provider: '🔥STAVR🔥'
            },
            {
                address: 'https://tnois-api.systemd.run:443',
                provider: 'systemd'
            }
        ]
    },
    explorers: [{
            kind: '🔥STAVR🔥',
            url: 'https://explorer.stavr.tech/Nois-Testnet',
            tx_page: 'https://explorer.stavr.tech/Nois-Testnet/tx/${txHash}',
            account_page: 'https://explorer.stavr.tech/Nois-Testnet/account/${accountAddress}'
        }, {
            kind: 'explorers.guru',
            url: 'https://testnet.nois.explorers.guru',
            tx_page: 'https://testnet.nois.explorers.guru/transaction/${txHash}',
            account_page: 'https://testnet.nois.explorers.guru/account/${accountAddress}'
        }],
    keywords: [
        'nois',
        'randomness',
        'drand',
        'wasm'
    ]
};
exports.default = info;
