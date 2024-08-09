import { create } from 'zustand';

type OnWalletConnected = {
  walletName: string;
  chainId: string;
  address?: string;
};

type OnWalletDisconnected = {
  chainType?: string;
};

export type WalletCallbackStore = {
  onWalletConnected?: (props: OnWalletConnected) => void;
  onWalletDisconnected?: (props: OnWalletDisconnected) => void;
};

export const defaultValues: WalletCallbackStore = {};

export const useCallbackStore = create<WalletCallbackStore>()(
  () => defaultValues
);
