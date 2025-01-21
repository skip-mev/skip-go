import { ChainType } from "@skip-go/client";
import { atom } from "jotai";

export type OnWalletConnectedProps = {
  walletName: string;
  chainIdToAddressMap?: Record<string, string>;
  chainId?: string;
  address?: string;
};

export type OnWalletDisconnectedProps = {
  walletName: string;
  chainType?: ChainType;
};

export type OnTransactionBroadcastedProps = {
  txHash: string;
  chainId: string;
  explorerLink: string;
  sourceAddress: string;
  destinationAddress: string;
  sourceAssetDenom: string;
  sourceAssetChainID: string;
  destAssetDenom: string;
  destAssetChainID: string;
};

export type OnTransactionCompleteProps = {
  txHash: string;
  chainId: string;
  explorerLink: string;
  sourceAddress: string;
  destinationAddress: string;
  sourceAssetDenom: string;
  sourceAssetChainID: string;
  destAssetDenom: string;
  destAssetChainID: string;
};

export type OnTransactionFailedProps = {
  error: string;
};

export type Callbacks = {
  onWalletConnected?: (props: OnWalletConnectedProps) => void;
  onWalletDisconnected?: (props: OnWalletDisconnectedProps) => void;
  onTransactionBroadcasted?: (props: OnTransactionBroadcastedProps) => void;
  onTransactionComplete?: (props: OnTransactionCompleteProps) => void;
  onTransactionFailed?: (props: OnTransactionFailedProps) => void;
};

export const callbacksAtom = atom<Callbacks>();
