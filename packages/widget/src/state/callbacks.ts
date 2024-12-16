import { ChainType } from "@skip-go/client";
import { atom } from "jotai";

export type OnWalletConnectedMultipleChainProps = {
  walletName: string;
  chainIds?: string[];
  chainIdToAddressMap?: Record<string, string>;
};

export type OnWalletConnectedSingleChainProps = {
  walletName: string;
  chainId?: string;
  address?: string;
};

export type OnWalletDisconnectedProps = {
  chainType?: ChainType;
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
  onWalletConnected?: (
    props:
      | OnWalletConnectedMultipleChainProps
      | OnWalletConnectedSingleChainProps
  ) => void;
  onWalletDisconnected?: (props: OnWalletDisconnectedProps) => void;
  onTransactionBroadcasted?: (props: OnTransactionBroadcastedProps) => void;
  onTransactionComplete?: (props: OnTransactionCompleteProps) => void;
  onTransactionFailed?: (props: OnTransactionFailedProps) => void;
};

export const callbacksAtom = atom<AllCallbacks>();
