import { http } from "viem";
import { createConfig, createStorage } from "wagmi";
import { walletConnect } from 'wagmi/connectors'
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
} from "wagmi/chains";
import { defineChain } from "viem";
import { WalletConnect } from "@/state/wallets";
const isBrowser = typeof window !== "undefined";

export const forma = defineChain({
  id: 984_122,
  name: "Forma",
  nativeCurrency: {
    name: "TIA",
    symbol: "TIA",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.forma.art"],
    },
  },
  blockExplorers: {
    default: {
      name: "Forma Explorer",
      url: "https://explorer.forma.art",
    },
  },
  contracts: {
    multicall3: {
      address: "0xd53C6FFB123F7349A32980F87faeD8FfDc9ef079",
      blockCreated: 252_705,
    },
  },
  testnet: false,
});

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

export const createWagmiConfig = (props: WalletConnect | undefined) => {
  const { options, walletConnectModal } = props || {};
  return createConfig({
    chains: [
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
    ],
    transports: {
      [arbitrum.id]: http(),
      [avalanche.id]: http(),
      [base.id]: http(),
      [bsc.id]: http(),
      [celo.id]: http(),
      [fantom.id]: http(),
      [filecoin.id]: http(),
      [kava.id]: http(),
      [linea.id]: http(),
      [mainnet.id]: http(),
      [manta.id]: http(),
      [moonbeam.id]: http(),
      [optimism.id]: http(),
      [polygon.id]: http(),
      [polygonMumbai.id]: http(),
      [sepolia.id]: http(),
      [avalancheFuji.id]: http(),
      [baseSepolia.id]: http(),
      [optimismSepolia.id]: http(),
      [arbitrumSepolia.id]: http(),
      [blast.id]: http(),
      [blastSepolia.id]: http(),
      [forma.id]: http(),
      [formaTestnet.id]: http(),
      [sei.id]: http(),
      [bscTestnet.id]: http(),
      [fantomTestnet.id]: http(),
      [kavaTestnet.id]: http(),
      [lineaSepolia.id]: http(),
      [mantaSepoliaTestnet.id]: http(),
    },
    ssr: false,
    storage: createStorage({
      storage: isBrowser ? localStorage : undefined, // Use a fallback for SSR
      key: "skip-go-widget-wagmi",
    }),
    connectors: options?.projectId ? [walletConnect({
      projectId: options?.projectId,
      name: options?.name,
      customStoragePrefix: "skip-go-widget-wagmi-walletconnect",
      showQrModal: true,
      qrModalOptions: {
        themeMode: walletConnectModal?.themeMode,
        themeVariables: walletConnectModal?.themeVariables,
      }
    })] : [],
  });
}
