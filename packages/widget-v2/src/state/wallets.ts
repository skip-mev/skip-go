import { atom } from "jotai";

export type MinimalWallet = {
  walletName: string;
  walletPrettyName: string;
  walletChainType: "evm" | "cosmos" | "svm";
  walletInfo: {
    logo?: string | { major: string; minor: string };
  };
  connect: () => Promise<void>;
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
  }) => Promise<string | undefined>;
}

type WalletState = {
  walletName: string;
  chainType: string;
}

export const evmWaletAtom = atom<WalletState>()
export const cosmosWaletAtom = atom<WalletState>()
export const svmWaletAtom = atom<WalletState>()

export const walletsAtom = atom((get) => {
  return {
    evm: get(evmWaletAtom),
    cosmos: get(cosmosWaletAtom),
    svm: get(svmWaletAtom),
  }
})
