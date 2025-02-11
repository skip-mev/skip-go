import { atom } from "jotai";
import { SignClientTypes } from "@walletconnect/types";
import { WalletConnectModalConfig } from "@walletconnect/modal";
import { ChainType, SignerGetters } from "@skip-go/client";
import { Key } from "graz";
import { atomWithStorage } from "jotai/utils";

export type MinimalWallet = {
  walletName: string;
  walletPrettyName: string;
  walletChainType: ChainType;
  walletInfo: {
    logo?: string;
  };
  connect: (chainId?: string) => Promise<string | undefined>;
  disconnect: () => Promise<void>;
  isWalletConnected: boolean;
  isAvailable?: boolean;
  getAddress?: (props: {
    chainId?: string;
    signRequired?: boolean;
    context?: "recovery" | "destination";
    praxWallet?: {
      index?: number;
      sourceChainID?: string;
    };
  }) => Promise<string | undefined>;
};

export type WalletState = {
  walletName: string;
  walletChainType?: ChainType;
  walletPrettyName?: string;
  walletInfo?: {
    logo?: string;
  };
  chainId?: string | number;
  isLedger?: boolean;
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

export const evmWalletAtom = atom<WalletState | undefined>();
export const cosmosWalletAtom = atom<WalletState | undefined>();
export const svmWalletAtom = atom<WalletState | undefined>();

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
];

export const getConnectedSignersAtom = atom<SignerGetters>();

export const connectedAddressesAtom = atom<Record<string, string | undefined>>();
