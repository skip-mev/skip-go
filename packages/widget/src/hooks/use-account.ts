import { WalletClient } from '@cosmos-kit/core';
import { useManager as useCosmosManager } from '@cosmos-kit/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useAccount as useWagmiAccount } from 'wagmi';
import {
  useTrackWallet,
  TrackWalletCtx,
  trackWallet,
} from '../store/track-wallet';
import {
  isWalletClientUsingLedger,
  isReadyToCheckLedger,
} from '../utils/wallet';
import { useChainByID } from './use-chains';
import { chainIdToName } from '../chains';

export function useAccount(chainID?: string) {
  const { data: chain } = useChainByID(chainID);
  const trackedWallet = useTrackWallet(chain?.chainType as TrackWalletCtx);

  const { getWalletRepo } = useCosmosManager();

  const cosmosWallet = useMemo(() => {
    if (chain?.chainType !== 'cosmos') return;
    if (chain.chainID.includes('penumbra')) return;
    const { wallets } = getWalletRepo(chainIdToName(chain.chainID));
    return wallets.find((w) => w.walletName === trackedWallet?.walletName);
  }, [
    chain?.chainID,
    chain?.chainName,
    chain?.chainType,
    getWalletRepo,
    trackedWallet?.walletName,
  ]);

  const wagmiAccount = useWagmiAccount();

  const { wallets } = useWallet();

  const getIsLedger = async (client: WalletClient, chainId: string) => {
    const isLedger = await isWalletClientUsingLedger(client, chainId);
    return isLedger;
  };

  const readyToCheckLedger = useMemo(() => {
    if (!cosmosWallet?.client) return false;
    return isReadyToCheckLedger(cosmosWallet?.client);
  }, [cosmosWallet?.client]);

  const cosmosWalletIsLedgerQuery = useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: [
      'cosmosWallet',
      {
        cosmosWallet: cosmosWallet?.walletName,
        address: cosmosWallet?.address,
        chainID: chain?.chainID,
      },
    ],
    queryFn: () => {
      if (!cosmosWallet?.client || !chain) return null;
      return getIsLedger(cosmosWallet.client, chain.chainID);
    },
    enabled:
      chain &&
      chain.chainType === 'cosmos' &&
      !!cosmosWallet &&
      readyToCheckLedger &&
      !!cosmosWallet?.address,
  });

  const account = useMemo(() => {
    trackedWallet;
    if (!chain) return;
    if (chain.chainType === 'cosmos' && cosmosWallet) {
      return {
        address: cosmosWallet.address,
        isWalletConnected:
          cosmosWallet.isWalletConnected && !cosmosWallet.isWalletDisconnected,
        wallet: cosmosWallet
          ? {
              walletName: cosmosWallet.walletInfo.name,
              walletPrettyName: cosmosWallet.walletInfo.prettyName,
              walletInfo: {
                logo: cosmosWallet.walletInfo.logo,
              },
              isLedger: cosmosWalletIsLedgerQuery.data,
            }
          : undefined,
        chainType: chain.chainType,
        connect: () => {
          return cosmosWallet.connect().then(() => {
            trackWallet.track(
              'cosmos',
              cosmosWallet.walletName,
              chain.chainType
            );
          });
        },
        disconnect: () => {
          return cosmosWallet.disconnect().then(() => {
            trackWallet.untrack('cosmos');
          });
        },
      };
    }
    if (chain.chainType === 'evm') {
      return {
        address: wagmiAccount.address,
        isWalletConnected: wagmiAccount.isConnected,
        wallet: wagmiAccount.connector
          ? {
              walletName: wagmiAccount.connector.id,
              walletPrettyName: wagmiAccount.connector.name,
              walletInfo: {
                logo: wagmiAccount.connector.icon,
              },
            }
          : undefined,
        chainType: chain.chainType,
        connect: () => {
          return wagmiAccount.connector?.connect().then(() => {
            trackWallet.track(
              'evm',
              wagmiAccount.connector!.id,
              chain.chainType
            );
          });
        },
        disconnect: () => {
          return wagmiAccount.connector?.disconnect().then(() => {
            trackWallet.untrack('evm');
          });
        },
      };
    }
    if (chain.chainType === 'svm') {
      const solanaWallet = wallets.find(
        (w) => w.adapter.name === trackedWallet?.walletName
      );
      return {
        address: solanaWallet?.adapter.publicKey?.toBase58(),
        isWalletConnected:
          solanaWallet?.adapter.connected && !solanaWallet.adapter.connecting,
        wallet: solanaWallet
          ? {
              walletName: solanaWallet.adapter.name,
              walletPrettyName: solanaWallet.adapter.name,
              walletInfo: {
                logo: solanaWallet.adapter.icon,
              },
            }
          : undefined,
        chainType: chain.chainType,
        connect: () => {
          return solanaWallet?.adapter.connect().then(() => {
            trackWallet.track(
              'svm',
              solanaWallet.adapter.name,
              chain.chainType
            );
          });
        },
        disconnect: () => {
          return solanaWallet?.adapter.disconnect().then(() => {
            trackWallet.untrack('svm');
          });
        },
      };
    }
  }, [
    trackedWallet,
    chain,
    cosmosWallet,
    cosmosWalletIsLedgerQuery.data,
    wagmiAccount.address,
    wagmiAccount.isConnected,
    wagmiAccount.connector,
    wallets,
  ]);
  return account;
}
