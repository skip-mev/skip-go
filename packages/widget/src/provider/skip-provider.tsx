import { useManager } from '@cosmos-kit/react';
import {
  ChainAffiliates,
  SkipClient,
  SkipClientOptions,
} from '@skip-go/client';
import { useWallet } from '@solana/wallet-adapter-react';
import { getWalletClient } from '@wagmi/core';
import { createContext, ReactNode } from 'react';
import { WalletClient } from 'viem';

import { config } from '../lib/wagmi';
import { trackWallet } from '../store/track-wallet';
import { gracefullyConnect, isWalletClientUsingLedger } from '../utils/wallet';
import { chainIdToName } from '../chains';
import { MinimalWallet } from '../hooks/use-make-wallets';
import { SkipAPIProviderProps } from './index';

export const SkipContext = createContext<
  | {
      skipClient: SkipClient;
      apiURL?: string;
      endpointOptions?: SkipClientOptions['endpointOptions'];
      makeDestinationWallets?: (chainID: string) => MinimalWallet[];
      chainIDsToAffiliates?: Record<string, ChainAffiliates>;
      connectedWallet?: {
        cosmos?: {
          getAddress: (chainID: string) => Promise<string>;
          getSigner: SkipClientOptions['getCosmosSigner'];
        };
        evm?: {
          getAddress: (chainID: string) => Promise<string>;
          getSigner: SkipClientOptions['getEVMSigner'];
        };
        svm?: {
          getAddress: (chainID: string) => Promise<string>;
          getSigner: SkipClientOptions['getSVMSigner'];
        };
      };
    }
  | undefined
>(undefined);

export function SkipProvider({
  children,
  apiURL,
  endpointOptions,
  makeDestinationWallets,
  chainIDsToAffiliates,
  connectedWallet,
}: SkipAPIProviderProps) {
  const { getWalletRepo } = useManager();
  const { wallets } = useWallet();

  const skipClient = new SkipClient({
    chainIDsToAffiliates,
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
        if (!!connectedWallet?.cosmos?.getSigner) {
          const signer = await connectedWallet.cosmos.getSigner(chainID);
          if (signer) {
            return signer;
          }
        }
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
        if (!!connectedWallet?.evm?.getSigner) {
          const signer = await connectedWallet.evm.getSigner(chainID);
          if (signer) {
            return signer;
          }
        }
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
        if (!!connectedWallet?.svm?.getSigner) {
          const signer = await connectedWallet.svm.getSigner();
          if (signer) {
            return signer;
          }
        }
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
        connectedWallet,
      }}
    >
      {children}
    </SkipContext.Provider>
  );
}
