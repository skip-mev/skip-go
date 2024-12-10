import { atom } from "jotai";

export type OnWalletConnectedProps = {
  walletName: string;
  chainId: string;
  address?: string;
};

export type OnWalletDisconnectedProps = {
  chainType?: "cosmos" | "evm" | "svm";
};

export type OnTransactionBroadcastedProps = {
  txHash: string;
  chainId: string;
  explorerLink: string;
};

export type OnTransactionCompleteProps = {
  txHash: string;
  chainId: string;
  explorerLink: string;
};

export type OnTransactionFailedProps = {
  error: string;
};

export type AllCallbacks = {
  onWalletConnected?: (props: OnWalletConnectedProps) => void;
  onWalletDisconnected?: (props: OnWalletDisconnectedProps) => void;
  onTransactionBroadcasted?: (props: OnTransactionBroadcastedProps) => void;
  onTransactionComplete?: (props: OnTransactionCompleteProps) => void;
  onTransactionFailed?: (props: OnTransactionFailedProps) => void;
}

export const allCallbacksAtom = atom<AllCallbacks>();