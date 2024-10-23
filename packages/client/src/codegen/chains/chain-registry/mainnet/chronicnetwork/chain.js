"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const info = {
    $schema: '../chain.schema.json',
    chain_name: 'chronicnetwork',
    status: 'killed',
    network_type: 'mainnet',
    pretty_name: 'Chronic Chain',
    chain_type: 'cosmos',
    chain_id: 'morocco-1',
    bech32_prefix: 'chronic',
    daemon_name: 'chtd',
    node_home: '$HOME/.cht',
    key_algos: ['secp256k1'],
    slip44: 118,
    fees: {
        fee_tokens: [{
                denom: 'ucgas',
                fixed_min_gas_price: 0.001
            }]
    },
    codebase: {},
    apis: {
        rpc: [{
                address: 'https://rpc-chronic.zenchainlabs.io/',
                provider: 'ZenChainLabs'
            }],
        rest: [{
                address: 'https://api-chronic.zenchainlabs.io/',
                provider: 'ZenChainLabs'
            }]
    },
    explorers: [
        {
            kind: 'skynetexplorers',
            url: 'https://www.skynetexplorers.com/chronic-token'
        },
        {
            kind: 'Zenscan.io',
            url: 'https://www.chronic.zenscan.io'
        },
        {
            kind: 'atomscan',
            url: 'https://atomscan.com/chronicnetwork',
            tx_page: 'https://atomscan.com/chronicnetwork/transactions/${txHash}',
            account_page: 'https://atomscan.com/chronicnetwork/accounts/${accountAddress}'
        }
    ]
};
exports.default = info;
