"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const info = {
    $schema: '../chain.schema.json',
    chain_name: 'medasdigital',
    status: 'live',
    network_type: 'mainnet',
    website: 'https://medas-digital.io/',
    pretty_name: 'Medas Digital Network',
    chain_type: 'cosmos',
    chain_id: 'medasdigital-1',
    bech32_prefix: 'medas',
    daemon_name: 'medasdigitald',
    node_home: '$HOME/.medasdigital',
    slip44: 118,
    key_algos: ['secp256k1'],
    fees: {
        fee_tokens: [{
                denom: 'umedas',
                low_gas_price: 0.1,
                average_gas_price: 0.25,
                high_gas_price: 0.4
            }]
    },
    staking: {
        staking_tokens: [{
                denom: 'umedas'
            }]
    },
    codebase: {},
    logo_URIs: {
        png: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/medasdigital/images/medas.png',
        svg: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/medasdigital/images/medas.svg'
    },
    apis: {
        rpc: [{
                address: 'https://rpc.medas-digital.io:26657/',
                provider: 'Neptun Validator'
            }],
        rest: [{
                address: 'https://lcd.medas-digital.io:1317/',
                provider: 'Neptun Validator'
            }],
        grpc: [{
                address: 'grpc.medas-digital.io:9090',
                provider: 'Neptun Validator'
            }]
    },
    explorers: [{
            kind: 'BigDipper',
            url: 'https://explorer.medas-digital.io:3100/medasdigital',
            tx_page: 'https://explorer.medas-digital.io:3100/medasdigital/transactions/${txHash}',
            account_page: 'explorer.medas-digital.io:3100/medasdigital/accounts/${accountAddress}'
        }, {
            kind: 'atomscan',
            url: 'https://atomscan.com/frontier/medasdigital',
            tx_page: 'https://atomscan.com/frontier/medasdigital/transactions/${txHash}',
            account_page: 'https://atomscan.com/frontier/medasdigital/accounts/${accountAddress}'
        }],
    images: [{
            png: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/medasdigital/images/medas.png',
            svg: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/medasdigital/images/medas.svg',
            theme: {
                primary_color_hex: '#147ccc'
            }
        }]
};
exports.default = info;
