import { create } from 'zustand';
import {
  createJSONStorage,
  persist,
  subscribeWithSelector,
} from 'zustand/middleware';

export type TrackWalletCtx = 'evm' | 'cosmos' | 'svm';

interface WalletState {
  walletName: string;
  chainType: string;
}

interface TrackWalletStore {
  evm?: WalletState;
  cosmos?: WalletState;
  svm?: WalletState;
}

const defaultValues: TrackWalletStore = {
  evm: undefined,
  cosmos: undefined,
  svm: undefined,
};

const useStore = create(
  subscribeWithSelector(
    persist(() => defaultValues, {
      name: 'TrackWalletState',
      version: 2,
      storage: createJSONStorage(() => window.sessionStorage),
    })
  )
);

export const trackWallet = {
  track: (ctx: TrackWalletCtx, walletName: string, chainType: string) => {
    useStore.setState({
      [ctx]: { walletName, chainType },
    });
  },
  untrack: (ctx: TrackWalletCtx) => {
    useStore.setState({
      [ctx]: undefined,
    });
  },
  get: useStore.getState,
  subscribe: useStore.subscribe,
};

export function useTrackWallet(ctx?: TrackWalletCtx) {
  return useStore((state) => ctx && state[ctx]);
}
