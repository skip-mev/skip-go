"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const info = {
    $schema: '../chain.schema.json',
    chain_name: 'andromeda',
    chain_type: 'cosmos',
    chain_id: 'andromeda-1',
    pre_fork_chain_name: 'andromeda1',
    pretty_name: 'Andromeda',
    status: 'live',
    network_type: 'mainnet',
    bech32_prefix: 'andr',
    daemon_name: 'andromedad',
    node_home: '$HOME/.andromeda',
    key_algos: ['secp256k1'],
    slip44: 118,
    fees: {
        fee_tokens: [{
                denom: 'uandr',
                low_gas_price: 0.03,
                average_gas_price: 0.05,
                high_gas_price: 0.075
            }]
    },
    staking: {
        staking_tokens: [{
                denom: 'uandr'
            }],
        lock_duration: {
            time: '1814400s'
        }
    },
    codebase: {
        cosmos_sdk_version: 'v0.47.8',
        cosmwasm_enabled: true,
        cosmwasm_version: 'v0.41.0'
    },
    apis: {
        rpc: [
            {
                address: 'https://rpc.andromeda-1.andromeda.aviaone.com',
                provider: 'AviaOne 🟢'
            },
            {
                address: 'https://andromeda.rpc.kjnodes.com',
                provider: 'kjnodes'
            },
            {
                address: 'https://andromeda.rpc.nodex.one',
                provider: 'nodex'
            },
            {
                address: 'https://andro.rpc.m.stavr.tech/',
                provider: '🔥STAVR🔥'
            },
            {
                address: 'https://andromeda-rpc.lavenderfive.com:443',
                provider: 'Lavender.Five Nodes 🐝'
            },
            {
                address: 'https://andromeda-mainnet-rpc.autostake.com:443',
                provider: 'AutoStake 🛡️ Slash Protected'
            },
            {
                address: 'https://andromeda-rpc.stakerhouse.com:443',
                provider: 'StakerHouse'
            },
            {
                address: 'https://andromeda-rpc.highstakes.ch',
                provider: 'High Stakes 🇨🇭'
            },
            {
                address: 'https://andromeda-rpc.genznodes.dev',
                provider: 'genznodes'
            },
            {
                address: 'https://andromeda.rpc.kjnodes.com',
                provider: 'kjnodes.com 🦄'
            },
            {
                address: 'andromeda-rpc.noders.services',
                provider: '[NODERS]TEAM'
            },
            {
                address: 'rpc-andromeda.blockval.io',
                provider: 'Blockval'
            },
            {
                address: 'https://andromeda.rpc.liveraven.net',
                provider: 'LiveRaveN'
            }
        ],
        rest: [
            {
                address: 'https://api.andromeda-1.andromeda.aviaone.com',
                provider: 'AviaOne 🟢'
            },
            {
                address: 'https://andromeda.api.kjnodes.com',
                provider: 'kjnodes'
            },
            {
                address: 'https://andromeda.api.nodex.one',
                provider: 'nodex'
            },
            {
                address: 'https://andro.api.m.stavr.tech',
                provider: '🔥STAVR🔥'
            },
            {
                address: 'https://andromeda-api.lavenderfive.com:443',
                provider: 'Lavender.Five Nodes 🐝'
            },
            {
                address: 'https://andromeda-mainnet-lcd.autostake.com:443',
                provider: 'AutoStake 🛡️ Slash Protected'
            },
            {
                address: 'https://andromeda-rest.stakerhouse.com:443',
                provider: 'StakerHouse'
            },
            {
                address: 'https://andromeda-api.highstakes.ch',
                provider: 'High Stakes 🇨🇭'
            },
            {
                address: 'https://andromeda-api.genznodes.dev',
                provider: 'genznodes'
            },
            {
                address: 'https://andromeda.api.kjnodes.com',
                provider: 'kjnodes.com 🦄'
            },
            {
                address: 'andromeda-api.noders.services',
                provider: '[NODERS]TEAM'
            },
            {
                address: 'api-andromeda.blockval.io',
                provider: 'Blockval'
            },
            {
                address: 'https://andromeda.api.liveraven.net',
                provider: 'LiveRaveN'
            }
        ],
        grpc: [
            {
                address: 'andromeda-grpc.lavenderfive.com:443',
                provider: 'Lavender.Five Nodes 🐝'
            },
            {
                address: 'https://grpc.andromeda-1.andromeda.aviaone.com:9108',
                provider: 'AviaOne 🟢'
            },
            {
                address: 'andromeda.grpc.kjnodes.com:443',
                provider: 'kjnodes'
            },
            {
                address: 'andromeda-mainnet-grpc.autostake.com:443',
                provider: 'AutoStake 🛡️ Slash Protected'
            },
            {
                address: 'https://andromeda.grpc.nodex.one:443',
                provider: 'nodex'
            },
            {
                address: 'http://andromedad.grpc.t.stavr.tech:132',
                provider: '🔥STAVR🔥'
            },
            {
                address: 'andromeda-grpc.stakerhouse.com:443',
                provider: 'StakerHouse'
            },
            {
                address: 'andromeda-grpc.genznodes.dev:27090',
                provider: 'genznodes'
            },
            {
                address: 'andromeda.grpc.kjnodes.com:443',
                provider: 'kjnodes.com 🦄'
            },
            {
                address: 'andromeda-grpc.noders.services:34090',
                provider: '[NODERS]TEAM'
            },
            {
                address: 'grpc-andromeda.blockval.io:443',
                provider: 'Blockval'
            },
            {
                address: 'andromeda.grpc.liveraven.net:443',
                provider: 'LiveRaveN'
            }
        ]
    },
    explorers: [
        {
            kind: '🔥STAVR🔥 Explorer',
            url: 'https://explorer.stavr.tech/Andromeda-Mainnet',
            tx_page: 'https://explorer.stavr.tech/Andromeda-Mainnet/tx/${txHash}',
            account_page: 'https://explorer.stavr.tech/Andromeda-Mainnet/account/${accountAddress}'
        },
        {
            kind: 'exploreme.pro',
            url: 'https://andromeda.exploreme.pro',
            tx_page: 'https://andromeda.exploreme.pro/transaction/${txHash}',
            account_page: 'https://andromeda.exploreme.pro/account/${accountAddress}'
        },
        {
            kind: 'Cosmotracker',
            url: 'https://cosmotracker.com/andromeda',
            tx_page: 'https://cosmotracker.com/andromeda/tx/${txHash}',
            account_page: 'https://cosmotracker.com/andromeda/account/${accountAddress}'
        },
        {
            kind: 'ping.pub',
            url: 'https://ping.pub/andromeda',
            tx_page: 'https://ping.pub/andromeda/tx/${txHash}'
        },
        {
            kind: 'AviaOne Explorer 🟢',
            url: 'https://mainnet.explorer.aviaone.com/andromeda',
            tx_page: 'https://mainnet.explorer.aviaone.com/andromeda/tx/${txHash}'
        }
    ],
    logo_URIs: {
        png: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/andromeda/images/andromeda-logo.png'
    },
    images: [{
            png: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/andromeda/images/andromeda-logo.png',
            theme: {
                primary_color_hex: '#040404'
            }
        }]
};
exports.default = info;
