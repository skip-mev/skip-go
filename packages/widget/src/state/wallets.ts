import { atom } from "jotai";
import { SignClientTypes } from "@walletconnect/types";
import { WalletConnectModalConfig } from "@walletconnect/modal";
import { ChainType, SignerGetters } from "@skip-go/client";
import { atomWithStorageNoCrossTabSync } from "@/utils/storage";

export type WalletConnectMetaData = {
  name: string;
  description: string;
  icons: string[];
  redirect: {
    native: string;
    universal: string;
  };
  url: string;
  publicKey: string;
};

export type MinimalWallet = {
  walletName: string;
  walletPrettyName: string;
  walletChainType: ChainType;
  walletInfo: {
    logo?: string;
  };
  connect: (chainId?: string) => Promise<void>;
  disconnect: () => Promise<void>;
  isWalletConnected: boolean;
  isAvailable?: boolean;
  getAddress?: (props: {
    signRequired?: boolean;
    context?: "recovery" | "destination";
    praxWallet?: {
      index?: number;
      sourceChainID?: string;
    };
  }) => Promise<{ address: string | undefined; logo?: string }>;
};

type WalletState = {
  id?: string;
  walletName: string;
  chainType: string;
  logo?: string;
};

export type WalletConnect = {
  options: Pick<SignClientTypes.Options, "projectId" | "name"> | null;
  walletConnectModal?: Pick<
    WalletConnectModalConfig,
    "themeVariables" | "themeMode" | "privacyPolicyUrl" | "termsOfServiceUrl"
  > | null;
};

export const walletConnectAtom = atom<WalletConnect>({
  options: {
    projectId: "ff1b9e9bd6329cfb07642bd7f4d11a8c",
    name: "Skip Go",
  },
});

export const evmWalletAtom = atom<WalletState>();
export const cosmosWalletAtom = atom<WalletState>();
export const svmWalletAtom = atom<WalletState>();

export const walletsAtom = atom((get) => {
  return {
    evm: get(evmWalletAtom),
    cosmos: get(cosmosWalletAtom),
    svm: get(svmWalletAtom),
  };
});

export const knownEthermintLikeChains = [
  "evmos_9001-2",
  "dymension_1100-1",
  "injective-1",
  "dimension_37-1",
  "haqq_11235-1",
  "shido_9008-1",
  "interwoven-1",
];

export const DEEPLINK_CHOICE = "WALLETCONNECT_DEEPLINK_CHOICE";
export const RECENT_WALLET_DATA = "WCM_RECENT_WALLET_DATA";

export const walletConnectDeepLinkByChainTypeAtom = atomWithStorageNoCrossTabSync(
  "WC_DEEPLINK_BY_CHAIN_TYPE",
  {
    [ChainType.Cosmos]: {
      deeplink: "",
      recentWalletData: "",
    },
    [ChainType.Evm]: {
      deeplink: "",
      recentWalletData: "",
    },
    [ChainType.Svm]: {
      deeplink: "",
      recentWalletData: "",
    },
  },
);

export const setWalletConnectDeepLinkByChainTypeAtom = atom(
  null,
  (_get, set, chainType: string) => {
    const walletConnectDeeplinkChoice = window.localStorage.getItem(DEEPLINK_CHOICE);
    const wcmRecentWalletData = window.localStorage.getItem(RECENT_WALLET_DATA);

    set(walletConnectDeepLinkByChainTypeAtom, (prev) => ({
      ...prev,
      [chainType]: {
        deeplink: walletConnectDeeplinkChoice,
        recentWalletData: wcmRecentWalletData,
      },
    }));
  },
);

export const getConnectedSignersAtom = atom<SignerGetters>();

export const connectedAddressesAtom = atom<Record<string, string | undefined>>();
