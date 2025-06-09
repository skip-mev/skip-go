import { ChainInfo } from "@keplr-wallet/types";
import _mainnetChains from "@/constants/cosmosChains/mainnet.json";
import _testnetChains from "@/constants/cosmosChains/testnet.json";
import _explorers from "@/constants/cosmosChains/explorers.json";

export type Explorer = {
  kind?: string;
  url?: string;
  tx_page?: string;
  account_page?: string;
  validator_page?: string;
  proposal_page?: string;
  block_page?: string;
};

const lombardTestnet: ChainInfo = {
  chainName: "Ledger",
  chainId: "ledger-testnet-1",
  rpc: "https://rpc-gastald.lb-mgt.com:443",
  rest: "https://rpc-gastald.lb-mgt.com/ipc",
  bip44: {
    coinType: 118,
  },
  currencies: [
    {
      coinDecimals: 6,
      coinDenom: "lom",
      coinMinimalDenom: "ulom",
    },
  ],
  feeCurrencies: [
    {
      coinDenom: "lom",
      coinMinimalDenom: "ulom",
      coinDecimals: 6,
    },
  ],
  stakeCurrency: {
    coinDenom: "lom",
    coinMinimalDenom: "ulom",
    coinDecimals: 6,
  },
  bech32Config: {
    bech32PrefixAccAddr: "lom",
    bech32PrefixAccPub: "lompub",
    bech32PrefixValAddr: "lomvaloper",
    bech32PrefixValPub: "lomvaloperpub",
    bech32PrefixConsAddr: "lomvalcons",
    bech32PrefixConsPub: "lomvalconspub",
  },
};

const lombardMainnet: ChainInfo = {
  chainName: "Ledger",
  chainId: "ledger-mainnet-1",
  rpc: "https://rpc-mainnet.lb-mgt.com:443",
  rest: "http://rpc-mainnet.lb-mgt.com:1317",
  bip44: {
    coinType: 118,
  },
  currencies: [
    {
      coinDecimals: 6,
      coinDenom: "lom",
      coinMinimalDenom: "ulom",
    },
  ],
  feeCurrencies: [
    {
      coinDenom: "lom",
      coinMinimalDenom: "ulom",
      coinDecimals: 6,
    },
  ],
  stakeCurrency: {
    coinDenom: "lom",
    coinMinimalDenom: "ulom",
    coinDecimals: 6,
  },
  bech32Config: {
    bech32PrefixAccAddr: "lom",
    bech32PrefixAccPub: "lompub",
    bech32PrefixValAddr: "lomvaloper",
    bech32PrefixValPub: "lomvaloperpub",
    bech32PrefixConsAddr: "lomvalcons",
    bech32PrefixConsPub: "lomvalconspub",
  },
};

const initiaTestnet = {
  chainName: "initia",
  chainId: "initiation-2",
  rpc: "https://rpc.testnet.initia.xyz",
  rest: "https://rest.testnet.initia.xyz",
  bip44: {
    coinType: 118,
  },
  currencies: [
    {
      coinDecimals: 6,
      coinDenom: "init",
      coinMinimalDenom: "uinit",
    },
  ],
  feeCurrencies: [
    {
      coinDenom: "init",
      coinMinimalDenom: "uinit",
      coinDecimals: 6,
    },
  ],
  stakeCurrency: {
    coinDenom: "init",
    coinMinimalDenom: "uinit",
    coinDecimals: 6,
  },
  bech32Config: {
    bech32PrefixAccAddr: "init",
    bech32PrefixAccPub: "initpub",
    bech32PrefixValAddr: "initvaloper",
    bech32PrefixValPub: "initvaloperpub",
    bech32PrefixConsAddr: "initvalcons",
    bech32PrefixConsPub: "initvalconspub",
  },
};

export const mainnetChains = [...(_mainnetChains as unknown as ChainInfo[]), lombardMainnet];
export const testnetChains = [
  ...(_testnetChains as unknown as ChainInfo[]),
  lombardTestnet,
  initiaTestnet,
];
const allChains = [...mainnetChains, ...testnetChains];

export const explorers = _explorers as unknown as {
  chainId: string;
  explorers: Explorer[];
}[];

export const getChainInfo = (chainId: string) => {
  const chain = allChains.find((chain) => chain.chainId === chainId);
  if (!chain) return undefined;
  return chain;
};
