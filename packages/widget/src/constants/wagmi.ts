import { cookieStorage, createStorage } from "wagmi";
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
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
  forma,
} from '@reown/appkit/networks'
import { createAppKit } from "@reown/appkit/react";

const isBrowser = typeof window !== "undefined";

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: isBrowser ? localStorage : undefined, // Use a fallback for SSR
    key: "skip-go-widget-wagmi",
  }),
  ssr: false,
  projectId: "ff1b9e9bd6329cfb07642bd7f4d11a8c",
  networks: [
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
    sei,
    bscTestnet,
    fantomTestnet,
    kavaTestnet,
    lineaSepolia,
    mantaSepoliaTestnet,
  ]
})

export const config = wagmiAdapter.wagmiConfig


// Set up metadata
const metadata = {
  name: 'appkit-example',
  description: 'AppKit Example',
  url: 'https://appkitexampleapp.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// Create the modal
const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId: "ff1b9e9bd6329cfb07642bd7f4d11a8c",
  networks: [
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
    sei,
    bscTestnet,
    fantomTestnet,
    kavaTestnet,
    lineaSepolia,
    mantaSepoliaTestnet,
  ],
  defaultNetwork: mainnet,
  metadata: metadata,
  features: {
    analytics: true // Optional - defaults to your Cloud configuration
  }
})
