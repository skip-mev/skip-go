import { useManager } from '@cosmos-kit/react';
import { useWallet } from '@solana/wallet-adapter-react';
import toast from 'react-hot-toast';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { trackWallet } from '../store/track-wallet';
import { chainIdToName } from '../chains';
import { useChains } from './use-chains';
import { gracefullyConnect } from '../utils/wallet';
import { useCallbackStore } from '../store/callbacks';
import { createPenumbraClient } from '@penumbra-zone/client';
import { ViewService } from '@penumbra-zone/protobuf';
import { bech32mAddress } from '@penumbra-zone/bech32m/penumbra';
import { bech32CompatAddress } from '@penumbra-zone/bech32m/penumbracompat1';
import { createPublicClient, http } from 'viem';
import { sei } from 'viem/chains';
import { seiPrecompileAddrABI } from '../constants/abis';
import { StyledBorderDiv } from '../ui/StyledComponents/Theme';

export interface MinimalWallet {
  walletName: string;
  walletPrettyName: string;
  walletChainType: 'evm' | 'cosmos' | 'svm';
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
  const { onWalletConnected, onWalletDisconnected } =
    useCallbackStore.getState();

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
    const isSei = chainType === 'cosmos' && chainID === 'pacific-1';

    let wallets: MinimalWallet[] = [];

    if (chainType === 'cosmos') {
      if (chainID.includes('penumbra')) {
        const praxWallet: MinimalWallet = {
          walletName: 'prax',
          walletPrettyName: 'Prax Wallet',
          walletChainType: 'cosmos',
          walletInfo: {
            logo: 'https://raw.githubusercontent.com/prax-wallet/web/e8b18f9b997708eab04f57e7a6c44f18b3cf13a8/apps/extension/public/prax-white-vertical.svg',
          },
          connect: async () => {
            console.error('Prax wallet is not supported for connect');
            toast.error('Prax wallet is not supported for connect');
          },
          getAddress: async ({ praxWallet }) => {
            const penumbraWalletIndex = praxWallet?.index;
            const sourceChainID = praxWallet?.sourceChainID;
            const prax_id = 'lkpmkhpnhknhmibgnmmhdhgdilepfghe';
            const prax_origin = `chrome-extension://${prax_id}`;
            const client = createPenumbraClient(prax_origin);
            try {
              await client.connect();

              const viewService = client.service(ViewService);
              const address = await viewService.addressByIndex({
                addressIndex: {
                  account: penumbraWalletIndex ? penumbraWalletIndex : 0,
                },
              });
              if (!address.address) throw new Error('No address found');
              const bech32Address = getPenumbraCompatibleAddress({
                address: address.address,
                chainID: sourceChainID,
              });
              return bech32Address;
            } catch (error) {
              console.error(error);
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              toast.error(error?.message);
            }
          },
          disconnect: async () => {
            console.error('Prax wallet is not supported');
          },
          isWalletConnected: false,
        };
        return [praxWallet];
      }
      const chainName = chainIdToName(chainID);
      const walletRepo = getWalletRepo(chainName);
      wallets = walletRepo.wallets.map((wallet) => ({
        walletName: wallet.walletName,
        walletPrettyName: wallet.walletPrettyName,
        walletChainType: 'cosmos',
        walletInfo: {
          logo: wallet.walletInfo.logo,
        },
        connect: async () => {
          try {
            await gracefullyConnect(wallet);
            trackWallet.track('cosmos', wallet.walletName, chainType);
            onWalletConnected?.({
              walletName: wallet.walletPrettyName,
              chainId: chainID,
              address: wallet.address,
            });
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
            console.error(error);
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
          onWalletDisconnected?.({ chainType });
        },
        isWalletConnected: wallet.isWalletConnected,
      }));
    }

    if (chainType === 'evm' || isSei) {
      for (const connector of connectors) {
        if (
          wallets.findIndex((wallet) => wallet.walletName === connector.id) !==
          -1
        ) {
          continue;
        }

        const evmGetAddress: MinimalWallet['getAddress'] = async ({
          signRequired,
        }) => {
          if (connector.id !== currentConnector?.id) {
            await connectAsync({ connector, chainId: Number(chainID) });
            trackWallet.track('evm', connector.id, chainType);
          } else if (evmAddress && isEvmConnected && signRequired) {
            trackWallet.track('evm', connector.id, chainType);
          }
          return evmAddress;
        };

        let minimalWallet: MinimalWallet = {
          walletName: connector.id,
          walletPrettyName: connector.name,
          walletChainType: 'evm',
          walletInfo: {
            logo: connector.icon,
          },
          connect: async () => {
            if (connector.id === currentConnector?.id) return;
            try {
              await connectAsync({ connector, chainId: Number(chainID) });
              trackWallet.track('evm', connector.id, chainType);
              onWalletConnected?.({
                walletName: connector.name,
                chainId: chainID,
                address: evmAddress,
              });
            } catch (error) {
              console.error(error);
              throw error;
            }
          },
          getAddress: async ({ signRequired, context }) => {
            try {
              const address = await evmGetAddress({ signRequired, context });
              if (address && context) {
                toast.success(
                  `Successfully retrieved ${context} address from ${connector.name}`
                );
              }
              return address;
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
            onWalletDisconnected?.({ chainType });
          },
          isWalletConnected: connector.id === currentConnector?.id,
        };

        if (isSei) {
          minimalWallet.getAddress = async ({ signRequired, context }) => {
            const address = await evmGetAddress({ signRequired, context });
            if (!address) {
              toast.error(
                <p>
                  <strong>Failed to get address!</strong>
                </p>
              );
            }
            const publicClient = createPublicClient({
              chain: sei,
              transport: http(),
            });
            try {
              const seiAddress = await publicClient.readContract({
                args: [address as `0x${string}`],
                address: '0x0000000000000000000000000000000000001004',
                abi: seiPrecompileAddrABI,
                functionName: 'getSeiAddr',
              });
              if (context) {
                toast.success(
                  `Successfully retrieved ${context} address from ${connector.name}`
                );
              }

              return seiAddress;
            } catch (error) {
              console.error(error);
              toast(
                ({ id }) => (
                  <div className="flex flex-col">
                    <h4 className="mb-2 font-bold">
                      Failed to get the address
                    </h4>
                    <StyledBorderDiv
                      as="pre"
                      className="mb-4 overflow-auto whitespace-pre-wrap break-all rounded border p-2 text-sm"
                    >
                      <p>
                        Your EVM address (0x) has not associated on chain yet.
                        Please visit{' '}
                        <a
                          target="_blank"
                          className="underline"
                          href="https://app.sei.io/"
                        >
                          https://app.sei.io/
                        </a>{' '}
                        to associate your SEI address.
                      </p>
                    </StyledBorderDiv>
                    <button
                      className="self-end text-sm font-medium text-red-500 hover:underline"
                      onClick={() => toast.dismiss(id)}
                    >
                      Clear Notification &times;
                    </button>
                  </div>
                ),
                {
                  duration: Infinity,
                }
              );
            }
          };
        }
        wallets.push(minimalWallet);
      }
    }

    if (chainType === 'svm') {
      for (const wallet of solanaWallets) {
        const minimalWallet: MinimalWallet = {
          walletName: wallet.adapter.name,
          walletPrettyName: wallet.adapter.name,
          walletChainType: 'svm',
          walletInfo: {
            logo: wallet.adapter.icon,
          },
          connect: async () => {
            try {
              await wallet.adapter.connect();
              trackWallet.track('svm', wallet.adapter.name, chainType);
              onWalletConnected?.({
                walletName: wallet.adapter.name,
                chainId: chainID,
                address: wallet.adapter.publicKey?.toBase58(),
              });
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
            onWalletDisconnected?.({ chainType });
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

const penumbraBech32ChainIDs = ['noble-1', 'grand-1'];
const getPenumbraCompatibleAddress = ({
  chainID,
  address,
}: {
  chainID?: string;
  address: { inner: Uint8Array };
}): string => {
  if (!chainID) return bech32mAddress(address);
  return penumbraBech32ChainIDs.includes(chainID)
    ? bech32CompatAddress(address)
    : bech32mAddress(address);
};
