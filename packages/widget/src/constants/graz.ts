import { WalletType } from "graz";

export const okxWalletChainIdsInitialConnect = [
  "axelar-dojo-1",
  "celestia",
  "cosmoshub-4",
  "dydx-mainnet-1",
  "injective-1",
  "juno-1",
  "kava_2222-10",
  "osmosis-1",
  "stargaze-1",
];

export const keplrMainnetChainIdsInitialConnect = [
  "agoric-3",
  "akashnet-2",
  "axelar-dojo-1",
  "celestia",
  "chihuahua-1",
  "columbus-5",
  "core-1",
  "cosmoshub-4",
  "crypto-org-chain-mainnet-1",
  "dimension_37-1",
  "dydx-mainnet-1",
  "dymension_1100-1",
  "evmos_9001-2",
  "injective-1",
  "juno-1",
  "kava_2222-10",
  "kyve-1",
  "lava-mainnet-1",
  "mars-1",
  "neutron-1",
  "noble-1",
  "omniflixhub-1",
  "osmosis-1",
  "passage-2",
  "phoenix-1",
  "pryzm-1",
  "quasar-1",
  "quicksilver-2",
  "regen-1",
  "secret-4",
  "seda-1",
  "sentinelhub-2",
  "sommelier-3",
  "ssc-1",
  "stargaze-1",
  "stride-1",
  "umee-1",
  "wormchain"
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

export const walletConnectMainnetChainIdsInitialConnect = [
  "cosmoshub-4",
  "noble-1",
  "osmosis-1",
  "neutron-1",
  "pryzm-1",
  "axelar-dojo-1",
  "chihuahua-1",
];

export const keplrMainnetWithoutEthermintChainIdsInitialConnect = [
  "agoric-3",
  "akashnet-2",
  "axelar-dojo-1",
  "celestia",
  "chihuahua-1",
  "columbus-5",
  "core-1",
  "cosmoshub-4",
  "crypto-org-chain-mainnet-1",
  "dydx-mainnet-1",
  "juno-1",
  "kava_2222-10",
  "kyve-1",
  "lava-mainnet-1",
  "mars-1",
  "neutron-1",
  "noble-1",
  "omniflixhub-1",
  "osmosis-1",
  "passage-2",
  "phoenix-1",
  "pryzm-1",
  "quasar-1",
  "quicksilver-2",
  "regen-1",
  "secret-4",
  "seda-1",
  "sentinelhub-2",
  "sommelier-3",
  "ssc-1",
  "stargaze-1",
  "stride-1",
  "umee-1",
  "wormchain"
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
