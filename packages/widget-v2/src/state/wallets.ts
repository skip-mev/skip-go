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

export type ChainType = "cosmos" | "evm" | "svm";

export type Account = {
  address: string;
  chainType: ChainType;
  wallet: {
    name: string;
    prettyName: string;
    logo?: string;
    isLedger?: boolean;
  }
}

export const userAccountsAtom = atom<Record<string, Account>>();

type AddAccountAtomProps = {
  chainId?: string;
  account?: Account;
}
export const addAccountAtom = atom(null, (get, set, { chainId, account }: AddAccountAtomProps) => {
  if (!chainId || !account) return;

  const userAccounts = get(userAccountsAtom);

  if (userAccounts) {
    const newUserAccounts = userAccounts;
    newUserAccounts[chainId] = account;
    set(userAccountsAtom, newUserAccounts);
  }

});