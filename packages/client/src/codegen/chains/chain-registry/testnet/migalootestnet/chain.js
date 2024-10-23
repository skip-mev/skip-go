"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const info = {
    $schema: '../chain.schema.json',
    chain_name: 'migalootestnet',
    status: 'live',
    network_type: 'testnet',
    website: 'https://www.whitewhale.money/',
    pretty_name: 'Migaloo Testnet',
    chain_type: 'cosmos',
    chain_id: 'narwhal-2',
    bech32_prefix: 'migaloo',
    daemon_name: 'migalood',
    node_home: '$HOME/.migalood',
    key_algos: ['secp256k1'],
    slip44: 118,
    fees: {
        fee_tokens: [{
                denom: 'uwhale',
                fixed_min_gas_price: 0.25,
                low_gas_price: 0.25,
                average_gas_price: 0.5,
                high_gas_price: 0.75
            }]
    },
    staking: {
        staking_tokens: [{
                denom: 'uwhale'
            }]
    },
    logo_URIs: {
        png: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/migaloo/images/migaloo-light.png',
        svg: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/migaloo/images/migaloo-light.svg'
    },
    codebase: {
        cosmos_sdk_version: '0.45',
        cosmwasm_enabled: true,
        cosmwasm_version: '0.28'
    },
    apis: {
        rpc: [{
                address: 'https://migaloo-testnet-rpc.polkachu.com',
                provider: 'Polkachu'
            }],
        rest: [{
                address: 'https://migaloo-testnet-api.polkachu.com',
                provider: 'Polkachu'
            }],
        grpc: []
    },
    explorers: [{
            kind: 'ping.pub',
            url: 'https://ping.pfc.zone/narwhal-testnet',
            tx_page: 'https://ping.pfc.zone/narwhal-testnet/tx/${txHash}'
        }],
    images: [{
            png: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/migaloo/images/migaloo-light.png',
            svg: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/migaloo/images/migaloo-light.svg'
        }]
};
exports.default = info;
