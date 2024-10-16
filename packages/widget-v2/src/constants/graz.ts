import {
  chains as _mainnetChains,
  assets as _mainnetAssets,
} from "chain-registry/mainnet";
import {
  chains as _testnetChains,
  assets as _testnetAssets,
} from "chain-registry/testnet";
import { chainRegistryChainToKeplr } from "@chain-registry/keplr";
import { ChainInfo } from "@keplr-wallet/types";
import { WalletType } from "graz";
import { Chain, AssetList } from "@chain-registry/types";
import {
  chains as chainsInitiaRegistry,
  assets as assetsInitiaRegistry,
} from "@initia/initia-registry";

const _mainnetAndInitiaChains = [
  ..._mainnetChains,
  ...chainsInitiaRegistry,
] as Chain[];

const _mainnetAndInitiaAssets = [
  ..._mainnetAssets,
  ...assetsInitiaRegistry,
] as AssetList[];

const _testnetAndInitiaChains = [
  ..._mainnetChains,
  ...chainsInitiaRegistry,
] as Chain[];

const _testnetAndInitiaAssets = [
  ..._mainnetAssets,
  ...assetsInitiaRegistry,
] as AssetList[];

export const mainnetChains = _mainnetAndInitiaChains
  .map((chain) => {
    try {
      return chainRegistryChainToKeplr(chain, _mainnetAndInitiaAssets);
    } catch (_error) {
      return undefined;
    }
  })
  .filter((chainInfo) => chainInfo && chainInfo.rpc) as ChainInfo[];

export const testnetChains = _testnetAndInitiaChains
  .map((chain) => {
    try {
      return chainRegistryChainToKeplr(chain, _testnetAndInitiaAssets);
    } catch (_error) {
      return undefined;
    }
  })
  .filter((chainInfo) => chainInfo) as ChainInfo[];

export const keplrMainnetChainIdsInitialConnect = [
  "90u-4",
  "FUND-MainNet-2",
  "HICKORY",
  "HoneyWood",
  "LumenX",
  "Neutaro-1",
  "ShareRing-VoyagerNet",
  "agoric-3",
  "aioz_168-1",
  "akashnet-2",
  "alfama",
  "arctic-1",
  "ares-1",
  "arkeo",
  "athens_7001-1",
  "atlantic-2",
  "axelar-dojo-1",
  "axelar-testnet-lisbon-3",
  "band-laozi-testnet6",
  "banksy-testnet-5",
  "bbn-dev-5",
  "bbn-test-3",
  "berberis-1",
  "birdee-1",
  "bitcanna-1",
  "blockx_100-1",
  "bluechip-2",
  "bluzelle-testnet-10",
  "bluzelle-9",
  "bostrom",
  "bouachain",
  "buenavista-1",
  "bzetestnet-2",
  "celestia",
  "chihuahua-1",
  "cifer-2",
  "cnho_stables-1",
  "colosseum-1",
  "columbus-5",
  "comdex-test-4",
  "constantine-3",
  "core-1",
  "coreum-testnet-1",
  "cosmoshub-4",
  "coss-1",
  "crossfi-evm-testnet-1",
  "crypto-org-chain-mainnet-1",
  "cudos-1",
  "cvm_323-1",
  "cvn_2032-1",
  "desmos-mainnet",
  "developer",
  "dimension_37-1",
  "dydx-mainnet-1",
  "dydx-testnet-4",
  "dymension_1100-1",
  "dyson-mainnet-01",
  "earendel-1",
  "ebony-2",
  "elgafar-1",
  "elystestnet-1",
  "emoney-3",
  "empe-testnet-2",
  "entrypoint-pubtest-2",
  "evmos_9001-2",
  "fairyring-testnet-1",
  "fiamma-testnet-1",
  "finschia-2",
  "fivenet",
  "froopyland_100-1",
  "furya-1",
  "fxcore",
  "galactica_9302-1",
  "govgen-1",
  "grand-1",
  "helichain",
  "iconlake-testnet-1",
  "iconlake-1",
  "indigo-1",
  "initiation-1",
  "injective-888",
  "injective-1",
  "inns-1",
  "iov-mainnet-ibc",
  "irishub-1",
  "ixo-5",
  "joltify_1729-1",
  "juno-1",
  "kaon-1",
  "kava_2222-10",
  "korellia-2",
  "kyve-1",
  "lambda_92000-1",
  "laozi-mainnet",
  "lava-mainnet-1",
  "lava-testnet-2",
  "likecoin-mainnet-2",
  "likecoin-public-testnet-5",
  "loop-1",
  "mainnet-tura",
  "mande_18071918-1",
  "mantra-hongbai-1",
  "mars-1",
  "medasdigital-1",
  "meme-1",
  "mineplex-mainnet-1",
  "mocha-4",
  "morocco-1",
  "mutelandia1",
  "neutron-1",
  "nibiru-devnet-1",
  "nibiru-testnet-1",
  "nillion-chain-testnet-1",
  "nim_1122-1",
  "noble-1",
  "nubit-alphatestnet-1",
  "omniflixhub-1",
  "osmo-test-5",
  "osmosis-1",
  "ovg",
  "panacea-3",
  "passage-2",
  "phoenix-1",
  "pio-testnet-1",
  "pion-1",
  "planq_7077-1",
  "poktroll",
  "provider",
  "pryzm-1",
  "pulsar-3",
  "quasar-1",
  "quicksilver-2",
  "qwoyn-1",
  "realionetwork_3300-3",
  "realionetwork_3301-1",
  "reapchain_221230-1",
  "regen-1",
  "router_9600-1",
  "scorum-1",
  "secret-4",
  "seda-1-testnet",
  "seda-1",
  "sentinelhub-2",
  "sge-network-4",
  "sgenet-1",
  "shido_9007-1",
  "sixnet",
  "soarchaintestnet",
  "sommelier-3",
  "sourcetest-1",
  "ssc-testnet-2",
  "ssc-1",
  "stafihub-1",
  "stargaze-1",
  "stratos-1",
  "stride-internal-1",
  "stride-1",
  "stwart_test_1",
  "stwart_testnet_1",
  "swisstronik_1291-1",
  "symphony-testnet-3",
  "synternet-1",
  "tenet_1559-1",
  "test-core-2",
  "tgrade-mainnet-1",
  "theta-testnet-001",
  "titan-test-3",
  "titan_18889-1",
  "tucana_712-1",
  "tumbler",
  "umee-1",
  "unicorn-420",
  "union-testnet-8",
  "uptick_117-1",
  "wormchain",
  "xion-testnet-1",
  "yulei-2.1",
  "zetachain_7000-1"
];

// other wallets not the keplr wallet
export const walletMainnetChainIdsInitialConnect = [
  "cosmoshub-4",
  "injective-1",
  "pacific-1",
  "noble-1",
  "osmosis-1",
  "neutron-1",
  "pryzm-1",
  "axelar-dojo-1",
  "chihuahua-1",
];

export const walletInfo: Record<
  string,
  {
    name: string;
    imgSrc: string;
    mobile?: boolean;
  }
> = {
  [WalletType.KEPLR]: {
    name: "Keplr",
    imgSrc:
      "https://raw.githubusercontent.com/graz-sh/graz/dev/example/starter/public/assets/wallet-icon-keplr.png",
  },
  [WalletType.LEAP]: {
    name: "Leap",
    imgSrc:
      "https://raw.githubusercontent.com/graz-sh/graz/dev/example/starter/public/assets/wallet-icon-leap.png",
  },
  [WalletType.COSMOSTATION]: {
    name: "Cosmostation",
    imgSrc:
      "https://raw.githubusercontent.com/graz-sh/graz/dev/example/starter/public/assets/wallet-icon-cosmostation.png",
  },
  [WalletType.VECTIS]: {
    name: "Vectis",
    imgSrc:
      "https://raw.githubusercontent.com/graz-sh/graz/dev/example/starter/public/assets/wallet-icon-vectis.svg",
  },
  [WalletType.STATION]: {
    name: "Station",
    imgSrc:
      "https://raw.githubusercontent.com/graz-sh/graz/dev/example/starter/public/assets/wallet-icon-station.svg",
  },
  [WalletType.XDEFI]: {
    name: "XDefi",
    imgSrc:
      "https://raw.githubusercontent.com/graz-sh/graz/dev/example/starter/public/assets/wallet-icon-xdefi.jpeg",
  },
  [WalletType.METAMASK_SNAP_LEAP]: {
    name: "Metamask Snap Leap",
    imgSrc:
      "https://raw.githubusercontent.com/graz-sh/graz/dev/example/starter/public/assets/wallet-icon-metamask.png",
  },
  [WalletType.METAMASK_SNAP_COSMOS]: {
    name: "Metamask Snap Cosmos",
    imgSrc:
      "https://raw.githubusercontent.com/graz-sh/graz/dev/example/starter/public/assets/wallet-icon-metamask.png",
  },
  [WalletType.WALLETCONNECT]: {
    name: "WalletConnect",
    imgSrc:
      "https://raw.githubusercontent.com/graz-sh/graz/dev/example/starter/public/assets/wallet-icon-walletconnect.png",
  },
  [WalletType.WC_KEPLR_MOBILE]: {
    name: "Keplr Mobile",
    imgSrc:
      "https://raw.githubusercontent.com/graz-sh/graz/dev/example/starter/public/assets/wallet-icon-keplr.png",
    mobile: true,
  },
  [WalletType.WC_LEAP_MOBILE]: {
    name: "Leap Mobile",
    imgSrc:
      "https://raw.githubusercontent.com/graz-sh/graz/dev/example/starter/public/assets/wallet-icon-leap.png",
    mobile: true,
  },
  [WalletType.WC_COSMOSTATION_MOBILE]: {
    name: "Cosmostation Mobile",
    imgSrc:
      "https://raw.githubusercontent.com/graz-sh/graz/dev/example/starter/public/assets/wallet-icon-cosmostation.png",
    mobile: true,
  },
  [WalletType.CAPSULE]: {
    name: "Capsule",
    imgSrc:
      "https://raw.githubusercontent.com/graz-sh/graz/dev/example/starter/public/assets/wallet-icon-capsule.jpg",
  },
  [WalletType.COSMIFRAME]: {
    name: "DAO DAO",
    imgSrc:
      "https://raw.githubusercontent.com/graz-sh/graz/dev/example/starter/public/assets/wallet-icon-daodao.png",
  },
  [WalletType.COMPASS]: {
    name: "Compass",
    imgSrc:
      "https://raw.githubusercontent.com/graz-sh/graz/dev/example/starter/public/assets/wallet-icon-compass.png",
  },
};

export const getCosmosWalletInfo = (walletType: WalletType) => {
  return walletInfo[walletType];
};
