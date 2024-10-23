"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const info = {
    $schema: '../../chain.schema.json',
    chain_name: 'likecointestnet',
    status: 'live',
    network_type: 'testnet',
    pretty_name: 'LikeCoin Testnet',
    chain_type: 'cosmos',
    chain_id: 'likecoin-public-testnet-5',
    bech32_prefix: 'like',
    daemon_name: 'liked',
    node_home: '$HOME/.liked',
    key_algos: ['secp256k1'],
    slip44: 118,
    fees: {
        fee_tokens: [{
                denom: 'nanoekil',
                fixed_min_gas_price: 1000,
                low_gas_price: 1000,
                average_gas_price: 10000,
                high_gas_price: 1000000
            }]
    },
    staking: {
        staking_tokens: [{
                denom: 'nanoekil'
            }],
        lock_duration: {
            time: '1814400s'
        }
    },
    codebase: {
        cosmos_sdk_version: '0.46',
        cosmwasm_enabled: false
    },
    apis: {
        rpc: [{
                address: 'https://node.testnet.like.co/rpc/',
                provider: 'like.co'
            }],
        rest: [{
                address: 'https://node.testnet.like.co/',
                provider: 'like.co'
            }],
        grpc: [{
                address: 'https://node.testnet-grpc.like.co/',
                provider: 'like.co'
            }]
    },
    explorers: [{
            kind: 'bigdipper',
            url: 'https://testnet.bigdipper.live/likecoin',
            tx_page: 'https://testnet.bigdipper.live/likecoin/transactions/${txHash}',
            account_page: 'https://testnet.bigdipper.live/likecoin/accounts/${accountAddress}'
        }, {
            kind: 'lunie-ng',
            url: 'https://likecoin-public-testnet-5.netlify.app/'
        }],
    logo_URIs: {
        png: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/likecoin/images/likecoin-chain-logo.png',
        svg: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/likecoin/images/likecoin-chain-logo.svg'
    },
    keywords: [],
    images: [{
            png: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/likecoin/images/likecoin-chain-logo.png',
            svg: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/likecoin/images/likecoin-chain-logo.svg'
        }]
};
exports.default = info;
