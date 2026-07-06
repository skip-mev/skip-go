import { defineChain } from "viem";
import {
  arbitrum,
  arbitrumSepolia,
  avalanche,
  avalancheFuji,
  base,
  baseSepolia,
  blast,
  blastSepolia,
  bsc,
  bscTestnet,
  celo,
  fantom,
  fantomTestnet,
  filecoin,
  forma,
  kava,
  kavaTestnet,
  linea,
  lineaSepolia,
  mainnet,
  manta,
  mantaSepoliaTestnet,
  moonbeam,
  optimism,
  optimismSepolia,
  polygon,
  polygonMumbai,
  sei,
  sepolia,
} from "viem/chains";

export const formaTestnet = defineChain({
  id: 984_123,
  name: "Forma Testnet",
  nativeCurrency: {
    name: "TIA",
    symbol: "TIA",
    decimals: 18,
  },

  rpcUrls: {
    default: {
      http: ["https://rpc.sketchpad-1.forma.art"],
    },
  },
  blockExplorers: {
    default: {
      name: "Forma Explorer",
      url: "https://explorer.sketchpad-1.forma.art",
    },
  },
  testnet: true,
});

export const injectiveEvm = defineChain({
  id: 1776,
  name: "Injective EVM",
  nativeCurrency: {
    name: "INJ",
    symbol: "INJ",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://sentry.evm-rpc.injective.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "Injective Explorer",
      url: "https://blockscout.injective.network",
    },
  },
});

export const injectiveEvmTestnet = defineChain({
  id: 1439,
  name: "Injective EVM Testnet",
  nativeCurrency: {
    name: "INJ",
    symbol: "INJ",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://injectiveevm-testnet-rpc.polkachu.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "Injective Testnet Explorer",
      url: "https://testnet.blockscout.injective.network",
    },
  },
  testnet: true,
});

export const evmChains = [
  arbitrum,
  avalanche,
  base,
  bsc,
  celo,
  fantom,
  filecoin,
  kava,
  linea,
  mainnet,
  manta,
  moonbeam,
  optimism,
  polygon,
  polygonMumbai,
  sepolia,
  avalancheFuji,
  baseSepolia,
  optimismSepolia,
  arbitrumSepolia,
  blast,
  blastSepolia,
  forma,
  formaTestnet,
  sei,
  bscTestnet,
  fantomTestnet,
  kavaTestnet,
  lineaSepolia,
  mantaSepoliaTestnet,
  injectiveEvm,
  injectiveEvmTestnet,
];
