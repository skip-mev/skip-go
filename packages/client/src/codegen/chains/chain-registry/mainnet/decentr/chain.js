"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const info = {
    $schema: '../chain.schema.json',
    chain_name: 'decentr',
    status: 'live',
    network_type: 'mainnet',
    pretty_name: 'Decentr',
    chain_type: 'cosmos',
    chain_id: 'mainnet-3',
    bech32_prefix: 'decentr',
    daemon_name: 'decentrd',
    node_home: '$HOME/.decentr',
    key_algos: ['secp256k1'],
    slip44: 118,
    fees: {
        fee_tokens: [{
                denom: 'udec',
                fixed_min_gas_price: 0.025,
                low_gas_price: 0.025,
                average_gas_price: 0.025,
                high_gas_price: 0.025
            }]
    },
    staking: {
        staking_tokens: [{
                denom: 'udec'
            }]
    },
    codebase: {},
    logo_URIs: {
        png: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/decentr/images/dec.png',
        svg: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/decentr/images/dec.svg'
    },
    apis: {
        rpc: [
            {
                address: 'https://poseidon.mainnet.decentr.xyz',
                provider: 'decentr'
            },
            {
                address: 'https://rpc.decentr.chaintools.tech/',
                provider: 'ChainTools'
            },
            {
                address: 'https://decentr.rpc.m.stavr.tech:443',
                provider: '🔥STAVR🔥'
            },
            {
                address: 'https://decentr-rpc.ibs.team/',
                provider: 'Inter Blockchain Services'
            },
            {
                address: 'https://rpc-dcntr.nodine.id/',
                provider: 'Nodine.ID'
            },
            {
                address: 'https://rpc-decentr.mms.team/',
                provider: 'MMS'
            }
        ],
        rest: [
            {
                address: 'https://rest.mainnet.decentr.xyz',
                provider: 'decentr'
            },
            {
                address: 'https://decentr.api.m.stavr.tech',
                provider: '🔥STAVR🔥'
            },
            {
                address: 'https://api.decentr.chaintools.tech/',
                provider: 'ChainTools'
            },
            {
                address: 'https://decentr-api.ibs.team/',
                provider: 'Inter Blockchain Services'
            }
        ],
        grpc: [
            {
                address: 'https://grpc-decentr.sxlzptprjkt.xyz:443',
                provider: 'sxlzptprjkt | VALIDATOR'
            },
            {
                address: 'decentr.grpc.m.stavr.tech:2060',
                provider: '🔥STAVR🔥'
            },
            {
                address: 'https://grpc.decentr.hexnodes.co',
                provider: 'Hexnodes'
            },
            {
                address: 'https://grpc.decentr.nodexcapital.com:443',
                provider: 'NodeX Validator'
            },
            {
                address: 'grpc-decentr.mms.team:443',
                provider: 'MMS'
            }
        ]
    },
    explorers: [
        {
            kind: 'decentr.net',
            url: 'https://explorer.decentr.net',
            tx_page: 'https://explorer.decentr.net/transactions/${txHash}?networkId=mainnet'
        },
        {
            kind: 'ping.pub',
            url: 'https://ping.pub/decentr/',
            tx_page: 'https://ping.pub/decentr/tx/${txHash}'
        },
        {
            kind: '🔥STAVR🔥',
            url: 'https://explorer.stavr.tech/Decentr-Mainnet',
            tx_page: 'https://explorer.stavr.tech/Decentr-Mainnet/tx/${txHash}'
        },
        {
            kind: 'atomscan',
            url: 'https://atomscan.com/decentr',
            tx_page: 'https://atomscan.com/decentr/transactions/${txHash}',
            account_page: 'https://atomscan.com/decentr/accounts/${accountAddress}'
        },
        {
            kind: 'Nodine.ID',
            url: 'https://explorer.co.id/decentr',
            tx_page: 'https://explorer.co.id/decentr/tx/${txHash}'
        },
        {
            kind: 'THE EXPLORER',
            url: 'https://explorer.sxlzptprjkt.xyz/decentr',
            tx_page: 'https://explorer.sxlzptprjkt.xyz/decentr/tx/${txHash}'
        },
        {
            kind: 'hexskrt EXPLORER',
            url: 'https://explorer.hexskrt.net/decentr',
            tx_page: 'https://explorer.hexskrt.net/decentr/tx/${txHash}'
        },
        {
            kind: 'NODEXPLORER',
            url: 'https://explorer.nodexcapital.com/decentr',
            tx_page: 'https://explorer.nodexcapital.com/decentr/tx/${txHash}'
        },
        {
            kind: 'Explorer ComunityNode',
            url: 'https://explorer.comunitynode.my.id/decentr',
            tx_page: 'https://explorer.comunitynode.my.id/decentr/tx/${txHash}'
        }
    ],
    images: [{
            png: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/decentr/images/dec.png',
            svg: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/decentr/images/dec.svg',
            theme: {
                primary_color_hex: '#4678e9'
            }
        }]
};
exports.default = info;
