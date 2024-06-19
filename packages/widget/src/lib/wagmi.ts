import { http } from 'viem';
import { createConfig } from 'wagmi';
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
  celo,
  fantom,
  filecoin,
  kava,
  linea,
  mainnet,
  manta,
  moonbeam,
  optimism,
  optimismSepolia,
  polygon,
  polygonMumbai,
  sepolia,
} from 'wagmi/chains';

import { forma, formaTestnet } from './viem/chains';

// Update EVM_CHAINS in src/constants/wagmi.ts as well
export const config = createConfig({
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
  },
  ssr: true,
});
