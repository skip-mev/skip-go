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
import { useSkipConfig } from './use-skip-client';

export function useAccount(chainID?: string) {
  const { data: chain } = useChainByID(chainID);
  const trackedWallet = useTrackWallet(chain?.chainType as TrackWalletCtx);
  const { connectedWallet } = useSkipConfig();

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

  const { data: parentCosmosAddress } = useQuery({
    queryKey: [
      'parentCosmosAddress',
      chain?.chainID,
      connectedWallet?.cosmos?.getSigner,
    ],
    queryFn: async () => {
      if (chain?.chainType === 'cosmos') {
        const signer = await connectedWallet?.cosmos?.getSigner?.(
          chain.chainID
        );
        const accounts = await signer?.getAccounts();
        return accounts?.[0].address;
      }
    },
    enabled:
      chain?.chainType === 'cosmos' && !!connectedWallet?.cosmos?.getSigner,
  });

  const { data: parentEVMSAddress } = useQuery({
    queryKey: [
      'parentEVMSAddress',
      chain?.chainID,
      connectedWallet?.evm?.getSigner,
    ],
    queryFn: async () => {
      if (chain?.chainType === 'evm') {
        const signer = await connectedWallet?.evm?.getSigner?.(chain.chainID);
        return signer?.account?.address;
      }
    },
    enabled: chain?.chainType === 'evm' && !!connectedWallet?.evm?.getSigner,
  });

  const { data: parentSVMAddress } = useQuery({
    queryKey: [
      'parentSVMAddress',
      chain?.chainID,
      connectedWallet?.svm?.getSigner,
    ],
    queryFn: async () => {
      if (chain?.chainType === 'svm') {
        const signer = await connectedWallet?.svm?.getSigner?.();
        return signer?.publicKey?.toBase58();
      }
    },
    enabled: chain?.chainType === 'svm' && !!connectedWallet?.svm?.getSigner,
  });

  const account = useMemo(() => {
    if (!chain) return;
    if (chain.chainType === 'cosmos' && parentCosmosAddress && !cosmosWallet) {
      return {
        address: parentCosmosAddress,
        isWalletConnected: true,
        wallet: {
          walletName: 'injected',
          walletPrettyName: '',
          walletInfo: {
            logo: '',
          },
          isLedger: false,
        },
        chainType: chain.chainType,
        connect: () => {},
        disconnect: () => {},
      };
    }
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
      if (parentEVMSAddress && !wagmiAccount) {
        return {
          address: parentEVMSAddress,
          isWalletConnected: true,
          wallet: {
            walletName: 'injected',
            walletPrettyName: '',
            walletInfo: {
              logo: '',
            },
          },
          chainType: chain.chainType,
          connect: () => {},
          disconnect: () => {},
        };
      }
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
      if (parentSVMAddress && !solanaWallet) {
        return {
          address: parentSVMAddress,
          isWalletConnected: true,
          wallet: {
            walletName: 'injected',
            walletPrettyName: '',
            walletInfo: {
              logo: '',
            },
          },
          chainType: chain.chainType,
          connect: () => {},
          disconnect: () => {},
        };
      }

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
    parentCosmosAddress,
    parentEVMSAddress,
    parentSVMAddress,
  ]);
  return account;
}
