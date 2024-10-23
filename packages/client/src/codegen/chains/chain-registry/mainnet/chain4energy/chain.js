"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const info = {
    $schema: '../chain.schema.json',
    chain_name: 'chain4energy',
    status: 'live',
    network_type: 'mainnet',
    website: 'https://c4e.io/',
    pretty_name: 'C4E',
    chain_type: 'cosmos',
    chain_id: 'perun-1',
    bech32_prefix: 'c4e',
    daemon_name: 'c4ed',
    node_home: '$HOME/.c4e-chain',
    key_algos: ['secp256k1'],
    slip44: 118,
    fees: {
        fee_tokens: [{
                denom: 'uc4e',
                fixed_min_gas_price: 0,
                low_gas_price: 0.01,
                average_gas_price: 0.025,
                high_gas_price: 0.04
            }]
    },
    staking: {
        staking_tokens: [{
                denom: 'uc4e'
            }]
    },
    codebase: {},
    logo_URIs: {
        png: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/chain4energy/images/c4e.png'
    },
    apis: {
        rpc: [
            {
                address: 'https://rpc.c4e.io/',
                provider: 'C4E'
            },
            {
                address: 'https://rpc.c4e.mainnet.dteam.tech:443',
                provider: 'DTEAM'
            },
            {
                address: 'https://rpc.c4e.nodestake.top',
                provider: 'NodeStake'
            },
            {
                address: 'https://c4e.rpc.bccnodes.com',
                provider: 'BccNodes'
            },
            {
                address: 'https://chain4energy-mainnet-rpc.autostake.com:443',
                provider: 'AutoStake 🛡️ Slash Protected'
            },
            {
                address: 'https://c4e.rpc.m.stavr.tech:443',
                provider: '🔥STAVR🔥'
            },
            {
                address: 'https://rpc-c4e.takeshi.team',
                provider: 'TAKESHI'
            },
            {
                address: 'https://rpc-c4e.mzonder.com',
                provider: 'MZONDER'
            },
            {
                address: 'https://rpc.cros-nest.com/chain4energy',
                provider: 'Crosnest'
            },
            {
                address: 'https://rpc.c4e.indonode.net',
                provider: 'Indonode'
            },
            {
                address: 'https://c4e-rpc.stake-town.com',
                provider: 'StakeTown'
            },
            {
                address: 'https://rpc.c4e.silentvalidator.com',
                provider: 'silent'
            },
            {
                address: 'http://rpc.c4e.stakeup.tech',
                provider: 'StakeUp'
            },
            {
                address: 'https://chain4energy-rpc.stakeangle.com',
                provider: 'StakeAngle'
            },
            {
                address: 'https://c4e-rpc.genznodes.dev',
                provider: 'genznodes'
            },
            {
                address: 'https://rpc-c4e.theamsolutions.info',
                provider: 'AM Solutions'
            },
            {
                address: 'https://c4e.rpc.m.anode.team',
                provider: 'AlxVoy ⚡ ANODE.TEAM'
            },
            {
                address: 'http://185.245.182.192:46657',
                provider: 'Meerlabs'
            },
            {
                address: 'http://89.117.58.109:26657',
                provider: 'medes'
            },
            {
                address: 'http://c4e.rpc.node75.org:26957',
                provider: 'Pro-nodes75'
            },
            {
                address: 'http://164.68.125.243:26657',
                provider: 'Smt Network'
            },
            {
                address: 'https://c4e-rpc.antrixy.org/',
                provider: 'Antrix Validators'
            },
            {
                address: 'https://c4e.doubletop.tech/',
                provider: 'DOUBLETOP'
            },
            {
                address: 'https://c4e-rpc.kalia.network:443',
                provider: 'Kalia Network'
            },
            {
                address: 'http://38.242.220.64:16657',
                provider: 'mahof'
            },
            {
                address: 'http://209.182.239.169:46657',
                provider: 'SECARD'
            },
            {
                address: 'https://rpc.c4e.validatus.com:443',
                provider: 'Validatus'
            },
            {
                address: 'https://rpc-m-c4e.apeironnodes.com:443',
                provider: 'Apeiron Nodes'
            },
            {
                address: 'http://rpc-c4e.cryptech.com.ua:443',
                provider: 'Cryptech'
            },
            {
                address: 'http://37.60.240.43:46657',
                provider: 'NakoTurk'
            },
            {
                address: 'https://chain4energy_mainnet_rpc.chain.whenmoonwhenlambo.money',
                provider: '🚀 WHEN MOON 🌕 WHEN LAMBO 🔥'
            }
        ],
        rest: [
            {
                address: 'https://lcd.c4e.io/',
                provider: 'C4E'
            },
            {
                address: 'https://api.c4e.mainnet.dteam.tech:443',
                provider: 'DTEAM'
            },
            {
                address: 'https://api.c4e.nodestake.top',
                provider: 'NodeStake'
            },
            {
                address: 'https://c4e.lcd.bccnodes.com',
                provider: 'BccNodes'
            },
            {
                address: 'https://chain4energy-mainnet-lcd.autostake.com:443',
                provider: 'AutoStake 🛡️ Slash Protected'
            },
            {
                address: 'https://c4e.api.m.stavr.tech',
                provider: '🔥STAVR🔥'
            },
            {
                address: 'https://api-c4e.takeshi.team',
                provider: 'TAKESHI'
            },
            {
                address: 'https://api-c4e.mzonder.com',
                provider: 'MZONDER'
            },
            {
                address: 'https://rest.cros-nest.com/chain4energy',
                provider: 'Crosnest'
            },
            {
                address: 'https://api.c4e.indonode.net',
                provider: 'Indonode'
            },
            {
                address: 'https://c4e-api.stake-town.com',
                provider: 'StakeTown'
            },
            {
                address: 'https://api.c4e.silentvalidator.com',
                provider: 'silent'
            },
            {
                address: 'http://api.c4e.stakeup.tech',
                provider: 'StakeUp'
            },
            {
                address: 'http://chain4energy-rpc.stakeangle.com:1317',
                provider: 'StakeAngle'
            },
            {
                address: 'https://c4e-api.genznodes.dev',
                provider: 'genznodes'
            },
            {
                address: 'https://api-c4e.theamsolutions.info',
                provider: 'AM Solutions'
            },
            {
                address: 'https://c4e.api.m.anode.team',
                provider: 'AlxVoy ⚡ ANODE.TEAM'
            },
            {
                address: 'http://c4e.api.node75.org:1397',
                provider: 'Pro-nodes75'
            },
            {
                address: 'http://164.68.125.243:1319',
                provider: 'Smt Network'
            },
            {
                address: 'https://c4e-rest.antrixy.org/',
                provider: 'Antrix Validators'
            },
            {
                address: 'https://c4e-api.kalia.network:443',
                provider: 'Kalia Network'
            },
            {
                address: 'http://38.242.220.64:11317',
                provider: 'mahof'
            },
            {
                address: 'http://209.182.239.169:1417',
                provider: 'SECARD'
            },
            {
                address: 'https://api.c4e.validatus.com:443',
                provider: 'Validatus'
            },
            {
                address: 'https://api-c4e.cryptech.com.ua:443',
                provider: 'CrypTech'
            },
            {
                address: 'https://lcd-m-c4e.apeironnodes.com',
                provider: 'Apeiron Nodes'
            },
            {
                address: 'https://chain4energy_mainnet_api.chain.whenmoonwhenlambo.money',
                provider: '🚀 WHEN MOON 🌕 WHEN LAMBO 🔥'
            }
        ],
        grpc: [
            {
                address: 'grpc.c4e.nodestake.top:443',
                provider: 'NodeStake'
            },
            {
                address: 'grpc.c4e.mainnet.dteam.tech:30090',
                provider: 'DTEAM'
            },
            {
                address: 'c4e.grpc.bccnodes.com:443',
                provider: 'BccNodes'
            },
            {
                address: 'chain4energy-mainnet-grpc.autostake.com:443',
                provider: 'AutoStake 🛡️ Slash Protected'
            },
            {
                address: 'c4e.grpc.bccnodes.com:443',
                provider: 'BccNodes'
            },
            {
                address: 'grpc-c4e.takeshi.team:443',
                provider: 'TAKESHI'
            },
            {
                address: 'grpc-c4e.mzonder.com:443',
                provider: 'MZONDER'
            },
            {
                address: 'http://c4e.grpc.m.stavr.tech:7029',
                provider: '🔥STAVR🔥'
            },
            {
                address: 'c4e-grpc.stake-town.com:443',
                provider: 'StakeTown'
            },
            {
                address: 'grpc.c4e.silentvalidator.com:443',
                provider: 'silent'
            },
            {
                address: 'http://chain4energy-rpc.stakeangle.com:1317',
                provider: 'StakeAngle'
            },
            {
                address: 'c4e-grpc.genznodes.dev:52090',
                provider: 'genznodes'
            },
            {
                address: 'https://grpc-c4e.theamsolutions.info:9391',
                provider: 'AM Solutions'
            },
            {
                address: 'https://c4e.grpc.m.anode.team',
                provider: 'AlxVoy ⚡ ANODE.TEAM'
            },
            {
                address: 'https://c4e-grpc.validatrium.club',
                provider: 'Validatrium'
            },
            {
                address: 'http://185.245.182.192:1318',
                provider: 'Meerlabs'
            },
            {
                address: 'grpc-c4e.stakerun.com:1190',
                provider: 'StakeRun'
            },
            {
                address: 'https://c4e-grpc.antrixy.org/',
                provider: 'Antirx Validators'
            },
            {
                address: 'https://c4e.doubletop.tech:443',
                provider: 'DOUBLETOP'
            },
            {
                address: 'c4e-grpc.kalia.network:3090',
                provider: 'Kalia Network'
            },
            {
                address: 'https://c4e.grpc.skynodejs.net',
                provider: 'skynodejs'
            },
            {
                address: 'http://38.242.220.64:19090',
                provider: 'mahof'
            },
            {
                address: 'http://209.182.239.169:9190',
                provider: 'SECARD'
            },
            {
                address: 'https://grpc.c4e.validatus.com:443',
                provider: 'Validatus'
            },
            {
                address: 'https://grpc-c4e.cryptech.com.ua:443',
                provider: 'Cryptech'
            },
            {
                address: 'http://207.180.208.47:46657',
                provider: 'NakoTurk'
            }
        ]
    },
    explorers: [
        {
            kind: 'explorer',
            url: 'https://explorer.apeironnodes.com/chain4energy',
            tx_page: 'https://explorer.apeironnodes.com/chain4energy/transactions/${txHash}'
        },
        {
            kind: 'DTEAM | Explorer',
            url: 'https://explorer.mainnet.dteam.tech/chain4energy',
            tx_page: 'https://explorer.mainnet.dteam.tech/chain4energytransactions/${txHash}'
        },
        {
            kind: 'explorer',
            url: 'https://explorer.ppnv.space/c4e',
            tx_page: 'https://explorer.ppnv.space/c4e/transactions/${txHash}'
        },
        {
            kind: 'explorer',
            url: 'https://explorer.c4e.io/',
            tx_page: 'https://explorer.c4e.io/transactions/${txHash}'
        },
        {
            kind: 'NodeStake Explorer',
            url: 'https://explorer.nodestake.top/chain4energy',
            tx_page: 'https://explorer.nodestake.top/chain4energy/transactions/${txHash}'
        },
        {
            kind: '𝐥𝐞𝐬𝐧𝐢𝐤 | 𝐔𝐓𝐒𝐀 Explorer',
            url: 'https://exp.utsa.tech/c4e',
            tx_page: 'https://exp.utsa.tech/c4e/tx/${txHash}'
        },
        {
            kind: '🔥STAVR🔥 Explorer',
            url: 'https://explorer.stavr.tech/c4e',
            tx_page: 'https://explorer.stavr.tech/c4e/tx/${txHash}'
        },
        {
            kind: 'BccNodes Explorer',
            url: 'https://explorer.bccnodes.com/chain4energy',
            tx_page: 'https://explorer.bccnodes.com/chain4energy/transactions/${txHash}'
        },
        {
            kind: 'NODEXPLORER',
            url: 'https://explorer.nodexcapital.com/c4e',
            tx_page: 'https://explorer.nodexcapital.com/c4e/transactions/${txHash}'
        },
        {
            kind: 'atomscan',
            url: 'https://atomscan.com/chain4energy',
            tx_page: 'https://atomscan.com/chain4energy/transactions/${txHash}',
            account_page: 'https://atomscan.com/chain4energy/accounts/${accountAddress}'
        },
        {
            kind: 'AM Solutions Explorer',
            url: 'https://explorer.theamsolutions.info/c4e-main/staking',
            tx_page: 'https://explorer.theamsolutions.info/c4e-main/transactions/${txHash}'
        },
        {
            kind: 'AlxVoy ⚡ ANODE.TEAM Explorer',
            url: 'https://main.anode.team/c4e',
            tx_page: 'https://main.anode.team/c4e/tx/${txHash}'
        },
        {
            kind: 'ScanRun',
            url: 'https://scanrun.io/c4e',
            tx_page: 'https://scanrun.io/c4e/transactions/${txHash}'
        },
        {
            kind: 'Cryptech',
            url: 'https://explorers.cryptech.com.ua/chain4energy',
            tx_page: 'https://explorers.cryptech.com.ua/chain4energy/tx/${txHash}'
        },
        {
            kind: '🚀 WHEN MOON 🌕 WHEN LAMBO 🔥',
            url: 'https://explorer.whenmoonwhenlambo.money/chain4energy',
            tx_page: 'https://explorer.whenmoonwhenlambo.money/chain4energy/tx/${txHash}',
            account_page: 'https://explorer.whenmoonwhenlambo.money/chain4energy/account/${accountAddress}'
        }
    ],
    images: [{
            png: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/chain4energy/images/c4e.png',
            theme: {
                primary_color_hex: '#24344c'
            }
        }]
};
exports.default = info;
