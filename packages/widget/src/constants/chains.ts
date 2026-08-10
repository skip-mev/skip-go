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

export const mainnetChains = _mainnetChains as unknown as ChainInfo[];
export const testnetChains = [
  ...(_testnetChains as unknown as ChainInfo[]),
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
