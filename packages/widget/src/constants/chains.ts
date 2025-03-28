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
  chainId: "localnet",
  rpc: "https://node0.ibc.lb-mgt.com:443",
  rest: "http://node0-1317.ibc.lb-mgt.com",
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

export const mainnetChains = _mainnetChains as unknown as ChainInfo[];
export const testnetChains = _testnetChains as unknown as ChainInfo[];
const allChains = [...mainnetChains, ...testnetChains, lombardTestnet];

export const explorers = _explorers as unknown as {
  chainId: string;
  explorers: Explorer[];
}[];

export const getChainInfo = (chainID: string) => {
  const chain = allChains.find((chain) => chain.chainId === chainID);
  if (!chain) return undefined;
  return chain;
};
