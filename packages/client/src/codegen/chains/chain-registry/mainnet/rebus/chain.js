"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const info = {
    $schema: '../chain.schema.json',
    chain_name: 'rebus',
    website: 'https://www.rebuschain.com/',
    status: 'live',
    network_type: 'mainnet',
    pretty_name: 'Rebus',
    chain_type: 'cosmos',
    chain_id: 'reb_1111-1',
    bech32_prefix: 'rebus',
    daemon_name: 'rebusd',
    node_home: '$HOME/.rebusd',
    key_algos: ['secp256k1'],
    slip44: 118,
    fees: {
        fee_tokens: [{
                denom: 'arebus',
                fixed_min_gas_price: 0,
                low_gas_price: 0.01,
                average_gas_price: 0.025,
                high_gas_price: 0.04
            }]
    },
    staking: {
        staking_tokens: [{
                denom: 'arebus'
            }]
    },
    codebase: {},
    logo_URIs: {
        png: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/rebus/images/rebus.png',
        svg: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/rebus/images/rebus.svg'
    },
    apis: {
        rpc: [
            {
                address: 'https://api.rebuschain.com:26657/',
                provider: 'Rebuschain'
            },
            {
                address: 'https://rebus.rpc.bccnodes.com:443',
                provider: 'BccNodes'
            },
            {
                address: 'https://rebus.rpc.manticore.team:443/',
                provider: 'MantiCore'
            },
            {
                address: 'https://rpc.rebus.nodestake.top/',
                provider: 'NodeStake'
            },
            {
                address: 'http://rebus.rpc.m.stavr.tech:40107',
                provider: '🔥STAVR🔥'
            },
            {
                address: 'https://rpc-1.rebus.nodes.guru',
                provider: 'Nodes.Guru'
            },
            {
                address: 'https://api.mainnet.rebus.money:26657',
                provider: 'Rebuschain'
            },
            {
                address: 'https://rebus-rpc.brocha.in',
                provider: 'Brochain'
            },
            {
                address: 'https://rebus-mainnet-rpc.autostake.com:443',
                provider: 'AutoStake 🛡️ Slash Protected'
            },
            {
                address: 'https://rebus.rpc.liveraven.net',
                provider: 'LiveRaveN'
            },
            {
                address: 'https://rebus-rpc.publicnode.com:443',
                provider: 'Allnodes ⚡️ Nodes & Staking'
            },
            {
                address: 'https://rebus-rpc.noders.services',
                provider: '[NODERS]TEAM'
            }
        ],
        rest: [
            {
                address: 'https://api.rebuschain.com:1317/',
                provider: 'Rebuschain'
            },
            {
                address: 'https://rebus.api.manticore.team:443/',
                provider: 'MantiCore'
            },
            {
                address: 'https://api.rebus.nodestake.top/',
                provider: 'NodeStake'
            },
            {
                address: 'https://rebus.api.m.stavr.tech',
                provider: '🔥STAVR🔥'
            },
            {
                address: 'https://api-1.rebus.nodes.guru',
                provider: 'Nodes.Guru'
            },
            {
                address: 'https://api.mainnet.rebus.money:1317',
                provider: 'Rebuschain'
            },
            {
                address: 'https://rebus-rest.brocha.in',
                provider: 'Brochain'
            },
            {
                address: 'https://rebus-mainnet-lcd.autostake.com:443',
                provider: 'AutoStake 🛡️ Slash Protected'
            },
            {
                address: 'https://rebus.api.liveraven.net',
                provider: 'LiveRaveN'
            },
            {
                address: 'https://rebus-rest.publicnode.com',
                provider: 'Allnodes ⚡️ Nodes & Staking'
            },
            {
                address: 'https:/rebus-api.noders.services',
                provider: '[NODERS]TEAM'
            }
        ],
        grpc: [
            {
                address: 'rebus.grpc.manticore.team:443',
                provider: 'MantiCore'
            },
            {
                address: 'rebus.grpc.bccnodes.com:14090',
                provider: 'BccNodes'
            },
            {
                address: 'grpc.rebus.nodestake.top:443',
                provider: 'NodeStake'
            },
            {
                address: 'rebus.grpc.nodersteam.com:9181',
                provider: '[NODERS]TEAM'
            },
            {
                address: 'http://rebus.grpc.m.stavr.tech:3211',
                provider: '🔥STAVR🔥'
            },
            {
                address: 'rebus-grpc.brocha.in:443',
                provider: 'Brochain'
            },
            {
                address: 'rebus-mainnet-grpc.autostake.com:443',
                provider: 'AutoStake 🛡️ Slash Protected'
            },
            {
                address: 'https://rebus.grpc.liveraven.net',
                provider: 'LiveRaveN'
            },
            {
                address: 'rebus-grpc.publicnode.com:443',
                provider: 'Allnodes ⚡️ Nodes & Staking'
            },
            {
                address: 'rebus-grpc.noders.services:18090',
                provider: '[NODERS]TEAM'
            }
        ]
    },
    explorers: [
        {
            kind: 'explorers.guru',
            url: 'https://rebus.explorers.guru',
            tx_page: 'https://rebus.explorers.guru/transaction/${txHash}'
        },
        {
            kind: 'NodeStake',
            url: 'https://explorer.nodestake.top/rebus',
            tx_page: 'https://explorer.nodestake.top/rebus/tx/${txHash}'
        },
        {
            kind: 'BccNodes',
            url: 'https://explorer.bccnodes.com/rebus-M',
            tx_page: 'https://explorer.bccnodes.com/rebus-M/tx/${txHash}'
        },
        {
            kind: 'Brochain',
            url: 'https://explorer.brocha.in/rebus',
            tx_page: 'https://explorer.brocha.in/rebus/tx/${txHash}'
        },
        {
            kind: '🔥STAVR🔥 Explorer',
            url: 'https://explorer.stavr.tech/rebus',
            tx_page: 'https://explorer.stavr.tech/rebus/tx/${txHash}'
        },
        {
            kind: 'tcnetwork',
            url: 'https://rebus.tcnetwork.io',
            tx_page: 'https://rebus.tcnetwork.io/transaction/${txHash}'
        },
        {
            kind: 'atomscan',
            url: 'https://atomscan.com/rebus',
            tx_page: 'https://atomscan.com/rebus/transactions/${txHash}',
            account_page: 'https://atomscan.com/rebus/accounts/${accountAddress}'
        }
    ],
    images: [{
            png: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/rebus/images/rebus.png',
            svg: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/rebus/images/rebus.svg',
            theme: {
                primary_color_hex: '#e75486'
            }
        }]
};
exports.default = info;
