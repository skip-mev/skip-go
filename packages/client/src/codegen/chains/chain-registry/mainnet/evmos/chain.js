"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const info = {
    $schema: '../chain.schema.json',
    chain_name: 'evmos',
    status: 'live',
    network_type: 'mainnet',
    website: 'https://evmos.org/',
    pretty_name: 'Evmos',
    chain_type: 'cosmos',
    chain_id: 'evmos_9001-2',
    bech32_prefix: 'evmos',
    node_home: '$HOME/.evmosd',
    daemon_name: 'evmosd',
    key_algos: ['ethsecp256k1'],
    extra_codecs: ['ethermint'],
    slip44: 60,
    fees: {
        fee_tokens: [{
                denom: 'aevmos',
                fixed_min_gas_price: 250000000,
                low_gas_price: 20000000000,
                average_gas_price: 25000000000,
                high_gas_price: 40000000000
            }]
    },
    staking: {
        staking_tokens: [{
                denom: 'aevmos'
            }]
    },
    codebase: {
        cosmos_sdk_version: 'evmos/cosmos-sdk v0.47.12-evmos.2'
    },
    logo_URIs: {
        png: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/evmos/images/evmos.png',
        svg: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/evmos/images/evmos.svg'
    },
    description: 'Developers use Evmos as the Ethereum Canary Chain to deploy applications of the future. Get all the functionalities of Ethereum with the power of IBC and Interchain composability.',
    apis: {
        rpc: [
            {
                address: 'https://rpc-evmos.ecostake.com',
                provider: 'ecostake'
            },
            {
                address: 'https://evmos-rpc.lavenderfive.com:443',
                provider: 'Lavender.Five Nodes 🐝'
            },
            {
                address: 'https://tendermint.bd.evmos.org:26657',
                provider: 'Blockdaemon'
            },
            {
                address: 'https://rpc-evmos-ia.cosmosia.notional.ventures:443',
                provider: 'Notional'
            },
            {
                address: 'https://rpc.evmos.testnet.run',
                provider: 'TestNetRun'
            },
            {
                address: 'https://rpc.evmos.nodestake.top',
                provider: 'NodeStake'
            },
            {
                address: 'https://rpc.evmos.chaintools.tech/',
                provider: 'ChainTools'
            },
            {
                address: 'https://evmos-rpc.polkachu.com',
                provider: 'Polkachu'
            },
            {
                address: 'https://rpc.evmos.silentvalidator.com/',
                provider: 'silent'
            },
            {
                address: 'https://rpc.evmos.tcnetwork.io',
                provider: 'TC Network'
            },
            {
                address: 'https://evmos.rpc.stakin-nodes.com',
                provider: 'Stakin'
            },
            {
                address: 'https://rpc-evmos.architectnodes.com',
                provider: 'Architect Nodes'
            },
            {
                address: 'https://evmos-rpc.validatrium.club',
                provider: 'Validatrium'
            },
            {
                address: 'https://evmos-rpc.publicnode.com:443',
                provider: 'Allnodes ⚡️ Nodes & Staking'
            },
            {
                address: 'https://rpc-evmos-01.stakeflow.io',
                provider: 'Stakeflow'
            },
            {
                address: 'https://evmos-rpc.theamsolutions.info',
                provider: 'AM Solutions'
            },
            {
                address: 'https://rpc-evmos.validavia.me',
                provider: 'Validavia'
            },
            {
                address: 'https://evmos-rpc.w3coins.io',
                provider: 'w3coins'
            },
            {
                address: 'https://evmos-rpc.stake-town.com',
                provider: 'StakeTown'
            },
            {
                address: 'https://evmos.rpc.liveraven.net',
                provider: 'LiveRaveN'
            },
            {
                address: 'https://evmos-rpc.antrixy.org/',
                provider: 'Antrix Validators'
            },
            {
                address: 'https://evmos-mainnet.rpc.stakevillage.net:443',
                provider: 'Stake Village'
            },
            {
                address: 'https://rpc.evmos.validatus.com',
                provider: 'Validatus'
            },
            {
                address: 'https://rpc.evmos.bronbro.io:443',
                provider: 'Bro_n_Bro'
            },
            {
                address: 'https://rpc.evmos.citizenweb3.com:443',
                provider: 'Citizen Web3'
            }
        ],
        rest: [
            {
                address: 'https://rest.bd.evmos.org:1317',
                provider: 'Blockdaemon'
            },
            {
                address: 'https://evmos-api.lavenderfive.com:443',
                provider: 'Lavender.Five Nodes 🐝'
            },
            {
                address: 'https://api-evmos-ia.cosmosia.notional.ventures/',
                provider: 'Notional'
            },
            {
                address: 'https://api.evmos.nodestake.top',
                provider: 'NodeStake'
            },
            {
                address: 'https://evmos-api.polkachu.com',
                provider: 'Polkachu'
            },
            {
                address: 'https://api.evmos.silentvalidator.com/',
                provider: 'silent'
            },
            {
                address: 'https://rest.evmos.tcnetwork.io',
                provider: 'TC Network'
            },
            {
                address: 'https://evmos.rest.stakin-nodes.com',
                provider: 'Stakin'
            },
            {
                address: 'https://rest-evmos.architectnodes.com',
                provider: 'Architect Nodes'
            },
            {
                address: 'https://evmos-api.validatrium.club',
                provider: 'Validatrium'
            },
            {
                address: 'https://rest-evmos.ecostake.com',
                provider: 'ecostake'
            },
            {
                address: 'https://evmos-rest.publicnode.com',
                provider: 'Allnodes ⚡️ Nodes & Staking'
            },
            {
                address: 'https://api-evmos-01.stakeflow.io',
                provider: 'Stakeflow'
            },
            {
                address: 'https://evmos-api.theamsolutions.info',
                provider: 'AM Solutions'
            },
            {
                address: 'https://lcd-evmos.validavia.me',
                provider: 'Validavia'
            },
            {
                address: 'https://evmos-api.w3coins.io',
                provider: 'w3coins'
            },
            {
                address: 'https://evmos-api.stake-town.com',
                provider: 'StakeTown'
            },
            {
                address: 'https://evmos.api.liveraven.net',
                provider: 'LiveRaveN'
            },
            {
                address: 'https://evmos-rest.antrixy.org/',
                provider: 'Antrix Validators'
            },
            {
                address: 'https://evmos-mainnet.api.stakevillage.net',
                provider: 'Stake Village'
            },
            {
                address: 'https://api.evmos.validatus.com',
                provider: 'Validatus'
            },
            {
                address: 'https://lcd.evmos.bronbro.io:443',
                provider: 'Bro_n_Bro'
            }
        ],
        grpc: [
            {
                address: 'grpc.bd.evmos.org:9090',
                provider: 'evmos.org'
            },
            {
                address: 'grpc-evmos-ia.cosmosia.notional.ventures:443',
                provider: 'Notional'
            },
            {
                address: 'evmos-grpc.lavenderfive.com:443',
                provider: 'Lavender.Five Nodes 🐝'
            },
            {
                address: 'grpc.evmos.nodestake.top:443',
                provider: 'NodeStake'
            },
            {
                address: 'grpc-evmos.cosmos-spaces.cloud:1190',
                provider: 'Cosmos Spaces'
            },
            {
                address: 'evmos.grpcui.chaintools.host:443',
                provider: 'ChainTools'
            },
            {
                address: 'evmos-grpc.polkachu.com:13490',
                provider: 'Polkachu'
            },
            {
                address: 'evmos.grpc.stakin-nodes.com:443',
                provider: 'Stakin'
            },
            {
                address: 'evmos-mainnet-grpc.autostake.com:443',
                provider: 'AutoStake 🛡️ Slash Protected'
            },
            {
                address: 'evmos-grpc.publicnode.com:443',
                provider: 'Allnodes ⚡️ Nodes & Staking'
            },
            {
                address: 'grpc-evmos-01.stakeflow.io:1702',
                provider: 'Stakeflow'
            },
            {
                address: 'https://evmos-grpc.theamsolutions.info ',
                provider: 'AM Solutions'
            },
            {
                address: 'evmos-grpc.w3coins.io:13490',
                provider: 'w3coins'
            },
            {
                address: 'grpc-evmos.mms.team:443',
                provider: 'MMS'
            },
            {
                address: 'evmos-grpc.stake-town.com:443',
                provider: 'StakeTown'
            },
            {
                address: 'evmos.grpc.liveraven.net:443',
                provider: 'LiveRaveN'
            },
            {
                address: 'https://evmos-grpc.antrixy.org/',
                provider: 'Antrix Validators'
            },
            {
                address: 'evmos-mainnet.grpc.stakevillage.net:16990',
                provider: 'Stake Village'
            },
            {
                address: 'grpc.evmos.validatus.com:443',
                provider: 'Validatus'
            },
            {
                address: 'https://grpc.evmos.bronbro.io:443',
                provider: 'Bro_n_Bro'
            }
        ],
        "evm-http-jsonrpc": [
            {
                address: 'https://eth.bd.evmos.org:8545',
                provider: 'Blockdaemon'
            },
            {
                address: 'https://jsonrpc-evmos-ia.cosmosia.notional.ventures/',
                provider: 'Notional'
            },
            {
                address: 'https://evmos-json-rpc.stakely.io',
                provider: 'Stakely'
            },
            {
                address: 'https://jsonrpc.evmos.nodestake.top',
                provider: 'NodeStake'
            },
            {
                address: 'https://json-rpc.evmos.bh.rocks',
                provider: 'BlockHunters'
            },
            {
                address: 'https://evmos-json-rpc.agoranodes.com',
                provider: 'AgoraNodes'
            },
            {
                address: 'https://evm-rpc.evmos.silentvalidator.com/',
                provider: 'silent'
            },
            {
                address: 'https://json-rpc.evmos.tcnetwork.io',
                provider: 'TC Network'
            },
            {
                address: 'https://evmosevm.rpc.stakin-nodes.com',
                provider: 'Stakin'
            },
            {
                address: 'https://evmos-evm.publicnode.com',
                provider: 'Allnodes.com ⚡️ Nodes & Staking'
            },
            {
                address: 'https://evmos-jsonrpc.theamsolutions.info',
                provider: 'AM Solutions'
            },
            {
                address: 'https://jsonrpc-evmos.mms.team',
                provider: 'MMS'
            },
            {
                address: 'https://evmos-jsonrpc.stake-town.com',
                provider: 'StakeTown'
            },
            {
                address: 'https://evmos.jsonrpc.liveraven.net',
                provider: 'LiveRaveN'
            },
            {
                address: 'https://evmos.json.antrixy.org',
                provider: 'Antrix Validators'
            },
            {
                address: 'https://evmos-mainnet.jsonrpc.stakevillage.net',
                provider: 'Stake Village'
            },
            {
                address: 'https://json-rpc.evmos.validatus.com',
                provider: 'Validatus'
            }
        ]
    },
    explorers: [
        {
            kind: 'ezstaking',
            url: 'https://ezstaking.app/evmos',
            tx_page: 'https://ezstaking.app/evmos/txs/${txHash}',
            account_page: 'https://ezstaking.app/evmos/account/${accountAddress}'
        },
        {
            kind: 'mintscan',
            url: 'https://www.mintscan.io/evmos',
            tx_page: 'https://www.mintscan.io/evmos/transactions/${txHash}',
            account_page: 'https://www.mintscan.io/evmos/accounts/${accountAddress}'
        },
        {
            kind: 'blockscout',
            url: 'https://evm.evmos.org',
            tx_page: 'https://evm.evmos.org/tx/${txHash}'
        },
        {
            kind: 'ping.pub',
            url: 'https://ping.pub/evmos',
            tx_page: 'https://ping.pub/evmos/tx/${txHash}'
        },
        {
            kind: 'explorers.guru',
            url: 'https://evmos.explorers.guru',
            tx_page: 'https://evmos.explorers.guru/transaction/${txHash}'
        },
        {
            kind: 'atomscan',
            url: 'https://atomscan.com/evmos',
            tx_page: 'https://atomscan.com/evmos/transactions/${txHash}',
            account_page: 'https://atomscan.com/evmos/accounts/${accountAddress}'
        },
        {
            kind: 'tcnetwork',
            url: 'https://evmos.tcnetwork.io',
            tx_page: 'https://evmos.tcnetwork.io/transaction/${txHash}'
        },
        {
            kind: 'Stakeflow',
            url: 'https://stakeflow.io/evmos',
            account_page: 'https://stakeflow.io/evmos/accounts/${accountAddress}'
        },
        {
            kind: 'Stake Village',
            url: 'https://exp.stakevillage.net/evmos',
            tx_page: 'https://exp.stakevillage.net/evmos/tx/${txHash}',
            account_page: 'https://exp.stakevillage.net/evmos/accounts/${accountAddress}'
        },
        {
            kind: '🔥STAVR🔥',
            url: 'https://explorer.stavr.tech/evmos',
            tx_page: 'https://explorer.stavr.tech/evmos/tx/${txHash}',
            account_page: 'https://explorer.stavr.tech/evmos/accounts/${accountAddress}'
        }
    ],
    images: [{
            png: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/evmos/images/evmos.png',
            svg: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/evmos/images/evmos.svg',
            theme: {
                primary_color_hex: '#ec4c34'
            }
        }]
};
exports.default = info;
