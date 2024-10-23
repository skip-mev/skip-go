"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const info = {
    $schema: '../chain.schema.json',
    chain_name: 'cifer1',
    status: 'killed',
    network_type: 'mainnet',
    website: 'https://cifer.ai/',
    pretty_name: 'Cifer',
    chain_type: 'cosmos',
    chain_id: 'cifer-1',
    bech32_prefix: 'cife',
    daemon_name: 'ciferd',
    node_home: '$HOME/.ciferd',
    slip44: 118,
    fees: {
        fee_tokens: [{
                denom: 'ucif',
                fixed_min_gas_price: 0.0025,
                low_gas_price: 1,
                average_gas_price: 5,
                high_gas_price: 10
            }]
    },
    staking: {
        staking_tokens: [{
                denom: 'ucif'
            }]
    },
    codebase: {},
    logo_URIs: {
        png: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/cifer/images/cif.png',
        svg: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/cifer/images/cif.svg'
    },
    apis: {
        rpc: [{
                address: 'https://cif_node.cifer.ai/',
                provider: 'Cifer'
            }],
        rest: [{
                address: 'https://api.cifer.ai',
                provider: 'Cifer'
            }],
        grpc: [{
                address: 'http://grpc.cifer.ai',
                provider: 'Cifer'
            }]
    },
    explorers: [{
            kind: 'bigdipper',
            url: 'https://explorer.cifer.ai/',
            tx_page: 'https://explorer.cifer.ai/transactions/${txHash}'
        }],
    images: [{
            png: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/cifer/images/cif.png',
            svg: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/cifer/images/cif.svg',
            theme: {
                primary_color_hex: '#af49b7'
            }
        }]
};
exports.default = info;
