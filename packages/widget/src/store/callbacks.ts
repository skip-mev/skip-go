import { create } from 'zustand';

type OnWalletConnected = {
  walletName: string;
  chainId: string;
  address?: string;
};

type OnWalletDisconnected = {
  chainType?: string;
};

type OnTransactionBroadcasted = {
  txHash: string;
  chainId: string;
  explorerLink: string;
};

type OnTransactionComplete = {
  txHash: string;
  chainId: string;
  explorerLink: string;
};

type OnTransactionFailed = {
  error: string;
};

export type WalletCallbackStore = {
  onWalletConnected?: (props: OnWalletConnected) => void;
  onWalletDisconnected?: (props: OnWalletDisconnected) => void;
  onTransactionBroadcasted?: (props: OnTransactionBroadcasted) => void;
  onTransactionComplete?: (props: OnTransactionComplete) => void;
  onTransactionFailed?: (props: OnTransactionFailed) => void;
};

export const defaultValues: WalletCallbackStore = {};

export const useCallbackStore = create<WalletCallbackStore>()(
  () => defaultValues
);
