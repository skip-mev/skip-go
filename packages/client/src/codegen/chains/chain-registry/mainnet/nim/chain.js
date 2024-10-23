"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const info = {
    $schema: '../chain.schema.json',
    chain_name: 'nim',
    status: 'live',
    network_type: 'mainnet',
    website: 'https://ai.nim.network',
    pretty_name: 'Nim Network',
    chain_type: 'cosmos',
    chain_id: 'nim_1122-1',
    bech32_prefix: 'nim',
    slip44: 60,
    fees: {
        fee_tokens: [{
                denom: 'anim',
                low_gas_price: 20000000000,
                average_gas_price: 20000000000,
                high_gas_price: 20000000000
            }]
    },
    staking: {
        staking_tokens: [{
                denom: 'anim'
            }],
        lock_duration: {
            time: '1209600s'
        }
    },
    logo_URIs: {
        png: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/nim/images/nim.png',
        svg: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/nim/images/nim.svg'
    },
    description: 'Nim Network is a highly-adoptable AI Gaming chain that will provide the ultimate ecosystem for exploration and development of games at the intersection of Web3 and AI.',
    images: [{
            png: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/nim/images/nim.png',
            svg: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/nim/images/nim.svg',
            theme: {
                primary_color_hex: '#519cea'
            }
        }],
    codebase: {},
    apis: {
        rpc: [{
                address: 'https://nim-mainnet-tendermint.public.blastapi.io',
                provider: 'BlastAPI'
            }],
        rest: [{
                address: 'https://nim-mainnet-rest.public.blastapi.io',
                provider: 'BlastAPI'
            }],
        "evm-http-jsonrpc": [{
                address: 'https://nim-mainnet.public.blastapi.io',
                provider: 'BlastAPI'
            }]
    },
    explorers: [{
            kind: 'FYI',
            url: 'https://dym.fyi/r/nim',
            tx_page: 'https://dym.fyi/r/nim/tx/${txHash}',
            account_page: 'https://dym.fyi/r/nim/address/${accountAddress}'
        }]
};
exports.default = info;
