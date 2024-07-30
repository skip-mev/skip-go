import { useManager } from '@cosmos-kit/react';
import { SkipRouter, SkipRouterOptions } from '@skip-go/core';
import { useWallet } from '@solana/wallet-adapter-react';
import { getWalletClient } from '@wagmi/core';
import { createContext, ReactNode } from 'react';
import { WalletClient } from 'viem';

import { config } from '../lib/wagmi';
import { trackWallet } from '../store/track-wallet';
import { gracefullyConnect, isWalletClientUsingLedger } from '../utils/wallet';
import { chainIdToName } from '../chains';
import { MinimalWallet } from '../hooks/use-make-wallets';

export const SkipContext = createContext<
  | {
      skipClient: SkipRouter;
      apiURL?: string;
      endpointOptions?: SkipRouterOptions['endpointOptions'];
      makeDestinationWallets?: (chainID: string) => MinimalWallet[];
    }
  | undefined
>(undefined);

export function SkipProvider({
  children,
  apiURL,
  endpointOptions,
  makeDestinationWallets,
}: {
  children: ReactNode;
  apiURL?: string;
  endpointOptions?: SkipRouterOptions['endpointOptions'];
  makeDestinationWallets?: (chainID: string) => MinimalWallet[];
}) {
  const { getWalletRepo } = useManager();
  const { wallets } = useWallet();

  const skipClient = new SkipRouter({
    getCosmosSigner: async (chainID) => {
      const chainName = chainIdToName(chainID);
      if (!chainName) {
        throw new Error(`getCosmosSigner error: unknown chainID '${chainID}'`);
      }

      const walletName = (() => {
        const { cosmos } = trackWallet.get();
        if (cosmos?.chainType === 'cosmos') return cosmos.walletName;
      })();

      const wallet = getWalletRepo(chainName).wallets.find((w) => {
        return w.walletName === walletName;
      });

      if (!wallet) {
        throw new Error(
          `getCosmosSigner error: unable to find wallets connected to '${chainID}'`
        );
      }

      if (!wallet.isWalletConnected || wallet.isWalletDisconnected) {
        await gracefullyConnect(wallet);
      }

      const isLedger = await isWalletClientUsingLedger(wallet.client, chainID);
      await wallet.initOfflineSigner(isLedger ? 'amino' : 'direct');

      if (!wallet.offlineSigner) {
        throw new Error(
          `getCosmosSigner error: no offline signer for walletName '${walletName}'`
        );
      }

      wallet.client.setDefaultSignOptions?.({
        preferNoSetFee: true,
      });

      return wallet.offlineSigner;
    },
    getEVMSigner: async (chainID) => {
      const evmWalletClient = (await getWalletClient(config, {
        chainId: parseInt(chainID),
      })) as WalletClient;

      if (!evmWalletClient) {
        throw new Error(
          `getEVMSigner error: no wallet client available for chain ${chainID}`
        );
      }

      return evmWalletClient;
    },
    getSVMSigner: async () => {
      const walletName = (() => {
        const { svm } = trackWallet.get();
        if (svm?.chainType === 'svm') return svm.walletName;
      })();
      const solanaWallet = wallets.find((w) => w.adapter.name === walletName);

      if (!solanaWallet?.adapter) {
        throw new Error(`getSVMSigner error: no wallet client available`);
      }

      return solanaWallet.adapter;
    },
    apiURL,
    endpointOptions,
  });

  return (
    <SkipContext.Provider
      value={{
        skipClient,
        apiURL,
        endpointOptions,
        makeDestinationWallets,
      }}
    >
      {children}
    </SkipContext.Provider>
  );
}
