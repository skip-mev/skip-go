import { Wallet } from '.';
import { TrackWalletCtx } from '../../store/track-wallet';

export type ChainAddress = {
  chainID: string;
  chainType?: TrackWalletCtx;
  address?: string;
  source?: 'input' | 'parent' | Wallet;
};

export type ChainAddresses = Record<number, ChainAddress | undefined>;

export interface SetChainAddressesParam {
  index: number;
  chainID: string;
  chainType: TrackWalletCtx;
  address: string;
  source: 'input' | 'parent' | Wallet;
}
export interface BroadcastedTx {
  chainID: string;
  txHash: string;
  explorerLink: string;
}
