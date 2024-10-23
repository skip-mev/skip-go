"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const info = {
    $schema: '../chain.schema.json',
    chain_name: 'pundix',
    chain_type: 'cosmos',
    chain_id: 'PUNDIX',
    website: 'https://pundix.com',
    pretty_name: 'Pundi X Chain',
    status: 'live',
    network_type: 'mainnet',
    bech32_prefix: 'px',
    daemon_name: 'pundixd',
    node_home: '$HOME/.pundix',
    key_algos: ['secp256k1'],
    slip44: 118,
    fees: {
        fee_tokens: [{
                denom: 'ibc/55367B7B6572631B78A93C66EF9FDFCE87CDE372CC4ED7848DA78C1EB1DCDD78',
                fixed_min_gas_price: 2000000000000,
                low_gas_price: 2000000000000,
                average_gas_price: 2500000000000,
                high_gas_price: 3000000000000
            }]
    },
    staking: {
        staking_tokens: [{
                denom: 'ibc/55367B7B6572631B78A93C66EF9FDFCE87CDE372CC4ED7848DA78C1EB1DCDD78'
            }]
    },
    codebase: {
        cosmos_sdk_version: '0.45.11'
    },
    description: 'Pundi X Chain is a dedicated payment-focused blockchain in the Function X network. It is specially designed to perform high throughput transactions with low latency and low transaction fees. In addition, it provides room for future compliance requirement upgrades, hardware (XPOS) integration, and Point-of-Sales compatibility, with tokenonomics that offer incentives to merchants and payment processors.',
    apis: {
        rpc: [{
                address: 'https://px-json.pundix.com',
                provider: 'Pundi X'
            }, {
                address: 'https://pundix.rpc.nodeshub.online:443',
                provider: 'Nodes Hub 🛡️ 100% Slash Protected 🛡️ | Restake ✅'
            }],
        rest: [{
                address: 'https://px-rest.pundix.com',
                provider: 'Pundi X'
            }, {
                address: 'https://pundix.api.nodeshub.online:443',
                provider: 'Nodes Hub 🛡️ 100% Slash Protected 🛡️ | Restake ✅'
            }],
        grpc: [{
                address: 'https://px-grpc.pundix.com',
                provider: 'Pundi X'
            }, {
                address: 'https://pundix.grpc.nodeshub.online',
                provider: 'Nodes Hub'
            }]
    },
    images: [{
            png: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/pundix/images/pundi-x-chain-logo.png',
            svg: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/pundix/images/pundi-x-chain-logo.svg',
            theme: {
                primary_color_hex: '#141414'
            }
        }, {
            png: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/pundix/images/pundi-x-chain-logo.png',
            theme: {
                primary_color_hex: '#141414'
            }
        }],
    logo_URIs: {
        png: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/pundix/images/pundi-x-chain-logo.png',
        svg: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/pundix/images/pundi-x-chain-logo.svg'
    },
    explorers: [{
            kind: 'starscan',
            url: 'https://starscan.io',
            tx_page: 'https://starscan.io/pundix/tx/${txHash}',
            account_page: 'https://starscan.io/pundix/address/${accountAddress}'
        }, {
            kind: 'Nodes Hub 🛡️ 100% Slash Protected 🛡️ | Restake ✅',
            url: 'https://explorer.nodeshub.online/pundix/',
            tx_page: 'https://explorer.nodeshub.online/pundix/tx/${txHash}',
            account_page: 'https://explorer.nodeshub.online/pundix/accounts/${accountAddress}'
        }]
};
exports.default = info;
