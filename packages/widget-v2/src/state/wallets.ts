import { atom } from "jotai";

export type MinimalWallet = {
  walletName: string;
  walletPrettyName: string;
  walletChainType: "evm" | "cosmos" | "svm";
  walletInfo: {
    logo?: string
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
