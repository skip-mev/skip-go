import { http } from "viem";
import { Config, createConfig, createStorage } from "wagmi";
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
  forma
} from "wagmi/chains";
import { defineChain } from "viem";
import { walletConnect } from "wagmi/connectors"

const isBrowser = typeof window !== "undefined";

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

export const config: Config = createConfig({
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
  connectors: [
    walletConnect({
      projectId: "19b7fb4e5adc3e74e37aa00c05937fa5",
      showQrModal: true,
      customStoragePrefix: "skip-go-widget-wallet-connect",
    })
  ]
});

export const walletConnectLogo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAMAAABOo35HAAADAFBMVEVHcEwge/wfffwKcv4TeP0MdP4ngvwog/wcfP0Xe/0hgP0Vev0hgP0ff/wbfv8cffwbffwbfPwaff4QeP4Jc/4sg/oshfsng/wafPwggv8ihf8dffwYgf8hfPgffvsogfslgv0ffvwefvwafP0Ze/0Xe/4QeP4JdP4wiPskgfsliP8igPwhf/wgf/wff/wXe/0VfP8Wefw0ifsXev0Wev0Tfv8Hc/4nhv8kgfwjgPwVef0Tef8IdP4Hcv4vh/sTef0Gc/4Fcf4phf0rif8ng/0lgfsmgvsTeP0ngvsSeP0phf4og/sRd/0Pev8Pd/8Off8vjf8pg/sQd/0qhPsDcf4rhPsPdv4shfsyjf8thfsNdv4uhvs3i/sNdf4Ecf5Aj/k0i/0vh/wvhvoMdv8GdP40ivwyif0wh/oJev8zi/02j/8Ldf5Ik/kxh/oyiPoEcf5CkPgLdP4Kdf8ziPo5kf80ifoJdP41ifo3jP02ivoIdP8Ic/4IeP1Ik/g5jf03ivoHd/89lP84i/pCj/k5i/o5i/k6jPk7jfoGc/88jvw7jPkGcv4/kPw9kf88jflAkvtGkvpAk/89jfkBcP9Dlv8+jfk+jvkCdv9Dkfk/jvkEcv4DeP9Aj/kFcf9Bj/lJmP9Cj/lPlvhEkvxCkPkDcf9DkPlKk/dDkPhEkfhIlfxFkfhBj/hGkvhGkfhQnP9HkvgBc/9PlvdIk/gCcP9Jk/hOmf1Kk/hNlfdKlPhNlfhRl/dLlPggfvsdffspgvpVnPxgpP12sP2Ct/0ae/tanfqbxf2z0/7I3/7Z6f/k8P/x9//2+v/////U5/98s/wrhPqsz/7P4/78/f9Mlfi61/5bof6Uwf1OlfhtqvxQlveMvf1Ql/dOlfff7f9Wn/9OlvcthPlPlvcwhvlop/tQl/eiyf0AcP80iPlSmPdWmvZRl/cNdP3r9P82iflVm/nB2/5TmPdWmfdVmfdUmPdXmvdWmfdWmvhYmfZZm/Y+jfg8jPhZnPUDb/1bnPZbm/VcnfcUYgSRAAAA/3RSTlMACh8sRU5rhJSqw9XR7f//////7YASLOD4/////wQYObf//////7VfYf///////////53///+b///////AjKj/4Wvt///////////////////////V/////////7n/to33////+Nn////p//8o//+nSv///////////////4D//////7X///////////////ju///u/////9///////////2j/////W//////V//////+Z///////R//+o/////////////////////////////////////+b/t//v/////////////////9D/////////6f/////b9v///77///H5MkSAAAAo7klEQVR4AeTWBW4rMRSF4SbDWAgzM3PKzIz7X8o798HIr5Y1YnWSfwmfjq+88QMKhSVZUTXdMC3bcTfR1tY22olYlmnoUVWRpXBoY82LxWVVM+yEk0yl0+kUct3MJqPlum6WcpOOZRtRVY7H1pAply+oetF20lQKlUqlMpXJMFqoUqlWq7XaDqGhiFXXG4V8bn2k4k2t6LTS7XY61en2qH6fsMRag9/VarUhwIajSD3aiK/BouLNMfZETqkO6nah9YdLqFX1tCaTyXQ6HQ6Hs+wwYs0b0govLC/rptNuL9LLXapDdRE7Ln8ttLe3tz+czbKRg0M5v4pSYfUosVi000vKRwvxL5HVIq7j42OADU+M0/CKXSm1eNY+X1wsLy8vWx4WtNiXyN8tHou0PCxqf5idReqn0spsqlk8O4fUFbpErZb/tlgtJJoWur7e35/Bq7EC+wopRyR1g2CFWC2Gy1cLibSub2+H8JoroWA/P82+O1/c34OK1/J7ieKzxWGhh8fZoxUN7HPMyTSqu/vf/a8FLk+L25a/1hTxWg9Pz7OIIQfxOxFTzfOX81fkaSGhFvcSM9+vfFW8LcIirbc3zOvgNBa0o64lMKp35HFxT9HvbnFfeQ9LuC1wPT0/f0TDgTpVZy9/qARal4i9WxR3t/gPBK/FY4HrcRY5lIJCNQbVJ8VqUYIz//0llpDoK88/RF7r6+nxOTKXgkL1ixmz4I0jiGKwyigKCsrMzMzMeHwX3jAzc/Kv+6aBp63PmulKC/4Jn2w/z/z+/XNN7uZSWpeQluUk+mEJrV+/DK6axHeVQWWksETUWwALSj6QtUTGXQ+3JvoC1qaep9Pp34ALvcWTiOM0EK2M4HpSldjLeGb/ly/ZrMACXGAuksQLnBYPIoMl+vhx3+lE7q7DOUFlpLB+85pnSYSS59bCi4i08h8/Fg4nDtWhYilVV59d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"
