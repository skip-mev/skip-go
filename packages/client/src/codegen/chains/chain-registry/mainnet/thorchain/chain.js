"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const info = {
    $schema: '../chain.schema.json',
    chain_name: 'thorchain',
    status: 'live',
    network_type: 'mainnet',
    website: 'https://thorchain.org/',
    pretty_name: 'THORChain',
    chain_type: 'cosmos',
    chain_id: 'thorchain-mainnet-v1',
    bech32_prefix: 'thor',
    daemon_name: 'thord',
    node_home: '$HOME/.thornode',
    slip44: 931,
    codebase: {},
    apis: {
        rpc: [],
        rest: []
    },
    explorers: [{
            kind: 'THORChain explorer',
            url: 'https://thorchain.net',
            tx_page: 'https://thorchain.net/#/txs/${txHash}'
        }, {
            kind: 'viewblock',
            url: 'https://viewblock.io/thorchain',
            tx_page: 'https://viewblock.io/thorchain/tx/${txHash}'
        }]
};
exports.default = info;
