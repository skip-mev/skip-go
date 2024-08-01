import { useManager } from '@cosmos-kit/react';
import { useWallet } from '@solana/wallet-adapter-react';
import toast from 'react-hot-toast';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { trackWallet } from '../store/track-wallet';
import { chainIdToName } from '../chains';
import { useChains } from './use-chains';
import { gracefullyConnect } from '../utils/wallet';

export interface MinimalWallet {
  walletName: string;
  walletPrettyName: string;
  walletInfo: {
    logo?: string | { major: string; minor: string };
  };
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  isWalletConnected: boolean;
  isAvailable?: boolean;
  getAddress?: (props: {
    signRequired?: boolean;
    context?: 'recovery' | 'destination';
    praxWallet?: {
      index?: number;
      sourceChainID?: string;
    };
  }) => Promise<string | undefined>;
}

export const useMakeWallets = () => {
  const { data: chains } = useChains();
  const getChain = (_chainID: string) =>
    chains?.find((chain) => chain.chainID === _chainID);

  const {
    connector: currentConnector,
    address: evmAddress,
    isConnected: isEvmConnected,
  } = useAccount();
  const { disconnectAsync } = useDisconnect();
  // evm
  const { connectors, connectAsync } = useConnect({
    mutation: {
      onError: (err) => {
        toast.error(
          <p>
            <strong>Failed to connect!</strong>
            <br />
            {err.name}: {err.message}
          </p>
        );
      },
    },
  });
  // cosmos
  const { getWalletRepo } = useManager();
  // solana
  const { wallets: solanaWallets } = useWallet();

  const makeWallets = (chainID: string) => {
    const chainType = getChain(chainID)?.chainType;

    let wallets: MinimalWallet[] = [];

    if (chainType === 'cosmos') {
      const chainName = chainIdToName(chainID);
      const walletRepo = getWalletRepo(chainName);
      wallets = walletRepo.wallets.map((wallet) => ({
        walletName: wallet.walletName,
        walletPrettyName: wallet.walletPrettyName,
        walletInfo: {
          logo: wallet.walletInfo.logo,
        },
        connect: async () => {
          try {
            await gracefullyConnect(wallet);
            trackWallet.track('cosmos', wallet.walletName, chainType);
          } catch (error) {
            console.error(error);
            toast.error(
              <p>
                <strong>Failed to connect!</strong>
              </p>
            );
            trackWallet.untrack('cosmos');
          }
        },
        getAddress: async ({ signRequired, context }) => {
          try {
            if (
              trackWallet.get().cosmos &&
              wallet.isWalletConnected &&
              !wallet.isWalletDisconnected
            ) {
              if (signRequired) {
                trackWallet.track('cosmos', wallet.walletName, chainType);
              }
              if (context && wallet.address) {
                toast.success(
                  `Successfully retrieved ${context} address from ${wallet.walletName}`
                );
              }
              return wallet.address;
            }
            await gracefullyConnect(wallet);
            if (!trackWallet.get().cosmos) {
              trackWallet.track('cosmos', wallet.walletName, chainType);
            }
            if (signRequired) {
              trackWallet.track('cosmos', wallet.walletName, chainType);
            }
            if (context && wallet.address) {
              toast.success(
                `Successfully retrieved ${context} address from ${wallet.walletName}`
              );
            }
            return wallet.address;
          } catch (error) {
            console.log(error);
            toast.error(
              <p>
                <strong>Failed to get address!</strong>
              </p>
            );
          }
        },
        disconnect: async () => {
          await wallet.disconnect();
          trackWallet.untrack('cosmos');
        },
        isWalletConnected: wallet.isWalletConnected,
      }));
    }

    if (chainType === 'evm') {
      for (const connector of connectors) {
        if (
          wallets.findIndex((wallet) => wallet.walletName === connector.id) !==
          -1
        ) {
          continue;
        }

        const minimalWallet: MinimalWallet = {
          walletName: connector.id,
          walletPrettyName: connector.name,
          walletInfo: {
            logo: connector.icon,
          },
          connect: async () => {
            if (connector.id === currentConnector?.id) return;
            try {
              await connectAsync({ connector, chainId: Number(chainID) });
              trackWallet.track('evm', connector.id, chainType);
            } catch (error) {
              console.error(error);
              throw error;
            }
          },
          getAddress: async ({ signRequired, context }) => {
            try {
              if (connector.id === currentConnector?.id) {
                if (isEvmConnected && evmAddress) {
                  if (signRequired) {
                    trackWallet.track('evm', connector.id, chainType);
                  }
                  if (context && evmAddress) {
                    toast.success(
                      `Successfully retrieved ${context} address from ${connector.name}`
                    );
                  }
                  return evmAddress;
                }
              } else {
                console.log('connecting');
                await connectAsync({ connector, chainId: Number(chainID) });
                trackWallet.track('evm', connector.id, chainType);

                if (context) {
                  toast.success(
                    `Successfully retrieved ${context} address from ${connector.name}`
                  );
                }
                return evmAddress;
              }
            } catch (error) {
              console.error(error);
              toast.error(
                <p>
                  <strong>Failed to get address!</strong>
                </p>
              );
            }
          },
          disconnect: async () => {
            await disconnectAsync();
            trackWallet.untrack('evm');
          },
          isWalletConnected: connector.id === currentConnector?.id,
        };

        wallets.push(minimalWallet);
      }
    }

    if (chainType === 'svm') {
      for (const wallet of solanaWallets) {
        const minimalWallet: MinimalWallet = {
          walletName: wallet.adapter.name,
          walletPrettyName: wallet.adapter.name,
          walletInfo: {
            logo: wallet.adapter.icon,
          },
          connect: async () => {
            try {
              await wallet.adapter.connect();
              trackWallet.track('svm', wallet.adapter.name, chainType);
            } catch (error) {
              console.error(error);
              toast.error(
                <p>
                  <strong>Failed to connect!</strong>
                </p>
              );
            }
          },
          getAddress: async ({ signRequired, context }) => {
            try {
              const isConnected = wallet.adapter.connected;
              if (!isConnected) {
                await wallet.adapter.connect();
                trackWallet.track('svm', wallet.adapter.name, chainType);
              }
              const address = wallet.adapter.publicKey;
              if (!address) throw new Error('No address found');
              if (signRequired) {
                trackWallet.track('svm', wallet.adapter.name, chainType);
              }
              if (context && address) {
                toast.success(
                  `Successfully retrieved ${context} address from ${wallet.adapter.name}`
                );
              }
              return address.toBase58();
            } catch (error) {
              console.error(error);
              toast.error(
                <p>
                  <strong>Failed to get address!</strong>
                </p>
              );
            }
          },
          disconnect: async () => {
            await wallet.adapter.disconnect();
            trackWallet.untrack('svm');
          },
          isWalletConnected: wallet.adapter.connected,
          isAvailable: wallet.readyState === 'Installed',
        };
        wallets.push(minimalWallet);
      }
    }

    return wallets;
  };

  return {
    makeWallets,
  };
};
