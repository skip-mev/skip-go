import { useManager } from '@cosmos-kit/react';
import { useWallet } from '@solana/wallet-adapter-react';
import toast from 'react-hot-toast';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { trackWallet } from '../store/track-wallet';
import { chainIdToName } from '../chains';
import { useChains } from './use-chains';
import { gracefullyConnect } from '../utils/wallet';

import { bech32mAddress } from '@penumbra-zone/bech32m/penumbra';
import { createPenumbraClient } from '@penumbra-zone/client/create';
import { ViewService } from '@penumbra-zone/protobuf';
import {
  createPraxClient,
  isPraxConnected,
  isPraxInstalled,
  requestPraxAccess,
} from '../utils/prax';

interface ConnectProps {
  penumbraWalletIndex?: number;
}
export interface MinimalWallet {
  walletName: string;
  walletPrettyName: string;
  walletInfo: {
    logo?: string | { major: string; minor: string };
  };
  connect: ({ penumbraWalletIndex }?: ConnectProps) => Promise<void>;
  disconnect: () => Promise<void>;
  isWalletConnected: boolean;
  isAvailable?: boolean;
  getAddress?: (props: {
    signRequired?: boolean;
    context?: 'recovery' | 'destination';
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
      if (chainID.includes('penumbra')) {
        const wallet: MinimalWallet = {
          walletName: 'prax',
          walletPrettyName: 'Prax Wallet',
          walletInfo: {
            logo: 'https://raw.githubusercontent.com/prax-wallet/web/e8b18f9b997708eab04f57e7a6c44f18b3cf13a8/apps/extension/public/prax-white-vertical.svg',
          },
          connect: async (props) => {
            const penumbraWalletIndex = props?.penumbraWalletIndex;
            try {
              const isInstalled = await isPraxInstalled();
              if (!isInstalled) {
                throw new Error('Prax Wallet is not installed');
              }
              const isConnected = isPraxConnected();
              console.log('requesting access');
              await requestPraxAccess();
              console.log('access requested');
              const praxClient = createPraxClient(ViewService);
              console.log(praxClient);
              const address = await praxClient.addressByIndex({
                addressIndex: {
                  account: penumbraWalletIndex ? penumbraWalletIndex : 0,
                },
              });
              console.log(address);
              if (!address.address) throw new Error('No address found');
              const bech32Address = bech32mAddress(address.address);
              console.log(bech32Address);
              console.log('test', isInstalled, isConnected);
            } catch (error) {
              console.error(error);
              toast.error(
                <p>
                  {/* @ts-expect-error */}
                  <strong>{error?.message}</strong>
                </p>
              );
            }
          },
          getAddress: async () => {
            // Or, you might prefer a specific provider.
            const praxViewClient = await createPenumbraClient(
              ViewService,
              'chrome-extension://lkpmkhpnhknhmibgnmmhdhgdilepfghe'
            );

            const { address } = await praxViewClient.addressByIndex({});
            if (!address) throw new Error('No address found');
            console.log(bech32mAddress(address));
            return 'testing';
          },
          disconnect: async () => {
            console.error('Prax wallet is not supported');
          },
          isWalletConnected: false,
        };
        wallets.push(wallet);
      } else {
        const chainName = chainIdToName[chainID];
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
