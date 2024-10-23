"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const info = {
    $schema: '../chain.schema.json',
    chain_name: 'octa',
    status: 'live',
    network_type: 'mainnet',
    pretty_name: 'Octa',
    chain_type: 'cosmos',
    chain_id: 'octa',
    bech32_prefix: 'octa',
    daemon_name: 'octadaemon',
    node_home: '$HOME/.octa',
    key_algos: ['secp256k1'],
    slip44: 118,
    fees: {
        fee_tokens: [{
                denom: 'uocta',
                fixed_min_gas_price: 0
            }]
    },
    codebase: {},
    logo_URIs: {
        png: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/octa/images/octa.png',
        svg: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/octa/images/octa.svg'
    },
    apis: {
        rpc: [],
        rest: []
    },
    explorers: [{
            kind: 'Octa explorer',
            url: 'http://explorer.octa-coin.com/',
            tx_page: 'http://explorer.octa-coin.com/txs/${txHash}'
        }],
    images: [{
            png: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/octa/images/octa.png',
            svg: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/octa/images/octa.svg',
            theme: {
                primary_color_hex: '#04a7f8'
            }
        }]
};
exports.default = info;
