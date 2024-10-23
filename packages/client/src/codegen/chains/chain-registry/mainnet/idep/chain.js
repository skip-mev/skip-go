"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const info = {
    $schema: '../chain.schema.json',
    chain_name: 'idep',
    status: 'live',
    network_type: 'mainnet',
    website: 'https://www.idep.network/',
    pretty_name: 'IDEP',
    chain_type: 'cosmos',
    chain_id: 'Antora',
    bech32_prefix: 'idep',
    daemon_name: 'idep',
    node_home: '$HOME/.ion',
    key_algos: ['secp256k1'],
    slip44: 118,
    fees: {
        fee_tokens: [{
                denom: 'idep',
                fixed_min_gas_price: 0
            }]
    },
    codebase: {},
    logo_URIs: {
        png: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/idep/images/idep.png',
        svg: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/idep/images/idep.svg'
    },
    apis: {
        rpc: [],
        rest: [],
        grpc: [{
                address: 'idep-grpc.lavenderfive.com:443',
                provider: 'Lavender.Five Nodes 🐝'
            }]
    },
    explorers: [
        {
            kind: 'chadscan',
            url: 'https://chadscan.com',
            tx_page: 'https://chadscan.com/transactions/${txHash}'
        },
        {
            kind: 'atomscan',
            url: 'https://atomscan.com/idep',
            tx_page: 'https://atomscan.com/idep/transactions/${txHash}',
            account_page: 'https://atomscan.com/idep/accounts/${accountAddress}'
        },
        {
            kind: 'TC Network',
            url: 'https://explorer.tcnetwork.io/idep',
            tx_page: 'https://explorer.tcnetwork.io/idep/transaction/${txHash}'
        }
    ],
    images: [{
            png: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/idep/images/idep.png',
            svg: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/idep/images/idep.svg',
            theme: {
                primary_color_hex: '#c5b4cf'
            }
        }]
};
exports.default = info;
