import { ChainType } from "@skip-go/client";
import { atom } from "jotai";

export type onWalletConnectedProps = {
  walletName: string;
  chainIdToAddressMap?: Record<string, string>;
  chainId?: string;
  address?: string;
};

export type onWalletDisconnectedProps = {
  walletName: string;
  chainType?: ChainType;
};

export type onTransactionBroadcastedProps = {
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

export type onTransactionCompleteProps = {
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

export type onTransactionFailedProps = {
  error: string;
};

export type onRouteUpdatedProps = {
  srcChainId?: string;
  srcAssetDenom?: string;
  destChainId?: string;
  destAssetDenom?: string;
  amountIn?: string;
  amountOut?: string;
  requiredChainAddresses?: string[];
};

export type onSourceAndDestinationSwappedProps = {
  srcChainId?: string;
  srcAssetDenom?: string;
  destChainId?: string;
  destAssetDenom?: string;
  amountIn?: string;
  amountOut?: string;
};

export type Callbacks = {
  onWalletConnected?: (props: onWalletConnectedProps) => void;
  onWalletDisconnected?: (props: onWalletDisconnectedProps) => void;
  onTransactionBroadcasted?: (props: onTransactionBroadcastedProps) => void;
  onTransactionComplete?: (props: onTransactionCompleteProps) => void;
  onTransactionFailed?: (props: onTransactionFailedProps) => void;
  onRouteUpdated?: (props: onRouteUpdatedProps) => void;
  onSourceAndDestinationSwapped?: (props: onSourceAndDestinationSwappedProps) => void;
};

export const callbacksAtom = atom<Callbacks>();
