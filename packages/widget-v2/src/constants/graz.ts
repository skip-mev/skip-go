import { chains as _mainnetChains, assets as _mainnetAssets } from "chain-registry/mainnet";
import { chains as _testnetChains, assets as _testnetAssets } from "chain-registry/testnet";
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

export const mainnetChains = _mainnetAndInitiaChains.map((chain) => {
  try {
    return chainRegistryChainToKeplr(chain, _mainnetAndInitiaAssets);
  } catch (_error) {
    return undefined;
  }
}).filter(chainInfo => chainInfo) as ChainInfo[];

export const testnetChains = _testnetAndInitiaChains.map((chain) => {
  try {
    return chainRegistryChainToKeplr(chain, _testnetAndInitiaAssets);
  } catch (_error) {
    return undefined;
  }
}).filter(chainInfo => chainInfo) as ChainInfo[];

export const walletInfo: Record<string, {
  name: string;
  imgSrc: string;
  mobile?: boolean;
}> = {
  [WalletType.KEPLR]: {
    name: "Keplr",
    imgSrc: "https://raw.githubusercontent.com/graz-sh/graz/dev/example/starter/public/assets/wallet-icon-keplr.png",
  },
  [WalletType.LEAP]: {
    name: "Leap",
    imgSrc: "https://raw.githubusercontent.com/graz-sh/graz/dev/example/starter/public/assets/wallet-icon-leap.png",
  },
  [WalletType.COSMOSTATION]: {
    name: "Cosmostation",
    imgSrc: "https://raw.githubusercontent.com/graz-sh/graz/dev/example/starter/public/assets/wallet-icon-cosmostation.png",
  },
  [WalletType.VECTIS]: {
    name: "Vectis",
    imgSrc: "https://raw.githubusercontent.com/graz-sh/graz/dev/example/starter/public/assets/wallet-icon-vectis.svg",
  },
  [WalletType.STATION]: {
    name: "Station",
    imgSrc: "https://raw.githubusercontent.com/graz-sh/graz/dev/example/starter/public/assets/wallet-icon-station.svg",
  },
  [WalletType.XDEFI]: {
    name: "XDefi",
    imgSrc: "https://raw.githubusercontent.com/graz-sh/graz/dev/example/starter/public/assets/wallet-icon-xdefi.jpeg",
  },
  [WalletType.METAMASK_SNAP_LEAP]: {
    name: "Metamask Snap Leap",
    imgSrc: "https://raw.githubusercontent.com/graz-sh/graz/dev/example/starter/public/assets/wallet-icon-metamask.png",
  },
  [WalletType.METAMASK_SNAP_COSMOS]: {
    name: "Metamask Snap Cosmos",
    imgSrc: "https://raw.githubusercontent.com/graz-sh/graz/dev/example/starter/public/assets/wallet-icon-metamask.png",
  },
  [WalletType.WALLETCONNECT]: {
    name: "WalletConnect",
    imgSrc: "https://raw.githubusercontent.com/graz-sh/graz/dev/example/starter/public/assets/wallet-icon-walletconnect.png",
  },
  [WalletType.WC_KEPLR_MOBILE]: {
    name: "Keplr Mobile",
    imgSrc: "https://raw.githubusercontent.com/graz-sh/graz/dev/example/starter/public/assets/wallet-icon-keplr.png",
    mobile: true,
  },
  [WalletType.WC_LEAP_MOBILE]: {
    name: "Leap Mobile",
    imgSrc: "https://raw.githubusercontent.com/graz-sh/graz/dev/example/starter/public/assets/wallet-icon-leap.png",
    mobile: true,
  },
  [WalletType.WC_COSMOSTATION_MOBILE]: {
    name: "Cosmostation Mobile",
    imgSrc: "https://raw.githubusercontent.com/graz-sh/graz/dev/example/starter/public/assets/wallet-icon-cosmostation.png",
    mobile: true,
  },
  [WalletType.CAPSULE]: {
    name: "Capsule",
    imgSrc: "https://raw.githubusercontent.com/graz-sh/graz/dev/example/starter/public/assets/wallet-icon-capsule.jpg",
  },
  [WalletType.COSMIFRAME]: {
    name: "DAO DAO",
    imgSrc: "https://raw.githubusercontent.com/graz-sh/graz/dev/example/starter/public/assets/wallet-icon-daodao.png",
  },
  [WalletType.COMPASS]: {
    name: "Compass",
    imgSrc: "https://raw.githubusercontent.com/graz-sh/graz/dev/example/starter/public/assets/wallet-icon-compass.png",
  },
};

export const getCosmosWalletInfo = (walletType: WalletType) => {
  return walletInfo[walletType];
};
