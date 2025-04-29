import { seiPrecompileAddrABI } from "@/constants/abis";
import { sourceAssetAtom } from "@/state/swapPage";
import {
  evmWalletAtom,
  MinimalWallet,
  setWalletConnectDeepLinkByChainTypeAtom,
  WalletConnectMetaData,
} from "@/state/wallets";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";
import { createPublicClient, http } from "viem";
import { sei } from "viem/chains";
import { useAccount, useConnect, useConnectors } from "wagmi";
import { disconnect } from "@wagmi/core";
import { config, walletConnectLogo } from "@/constants/wagmi";
import { callbacksAtom } from "@/state/callbacks";
import { track } from "@amplitude/analytics-browser";
import { useUpdateSourceAssetToDefaultForChainType } from "./useUpdateSourceAssetToDefaultForChainType";
import { ChainType } from "@skip-go/client";

export const useCreateEvmWallets = () => {
  const sourceAsset = useAtomValue(sourceAssetAtom);
  const [evmWallet, setEvmWallet] = useAtom(evmWalletAtom);
  const callbacks = useAtomValue(callbacksAtom);
  const setWCDeepLinkByChainType = useSetAtom(setWalletConnectDeepLinkByChainTypeAtom);

  const setDefaultSourceAsset = useUpdateSourceAssetToDefaultForChainType();

  const {
    connector: currentEvmConnector,
    isConnected: isEvmConnected,
    chainId: accountChainId,
  } = useAccount();
  const { connectAsync } = useConnect();
  const connectors = useConnectors();

  const createEvmWallets = useCallback(
    (chainId?: string) => {
      const isSei = chainId === "pacific-1";
      if (isSei) {
        chainId = sei.id.toString();
      }
      const wallets: MinimalWallet[] = [];
      for (const connector of connectors) {
        if (connector.id === "com.okex.wallet") {
          continue;
        }
        const isWalletFound =
          wallets.findIndex((wallet) => wallet.walletName === connector.id) !== -1;
        if (isWalletFound) {
          continue;
        }
        const isWalletConnect = connector.id === "walletConnect";

        const connectWallet = async ({ chainIdToConnect = "1" }: { chainIdToConnect?: string }) => {
          const walletConnectedButNeedToSwitchChain =
            isEvmConnected &&
            accountChainId !== Number(chainIdToConnect) &&
            connector.id === currentEvmConnector?.id;

          try {
            if (isEvmConnected && connector.id !== currentEvmConnector?.id) {
              await disconnect(config);
            }
            if (walletConnectedButNeedToSwitchChain) {
              await connector?.switchChain?.({
                chainId: Number(chainIdToConnect),
              });
            }

            await connectAsync({ connector, chainId: Number(chainIdToConnect) });

            if (sourceAsset === undefined) {
              setDefaultSourceAsset(ChainType.Evm);
            }

            const account = await connector.getAccounts();

            const provider = await connector.getProvider();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const walletConnectMetadata = (provider as any)?.session?.peer
              ?.metadata as WalletConnectMetaData;

            setWCDeepLinkByChainType(ChainType.Evm);

            if (evmWallet === undefined) {
              callbacks?.onWalletConnected?.({
                walletName: connector.name,
                chainId: chainId,
                address: account[0],
              });

              setEvmWallet({
                id: account[0],
                walletName: connector.id,
                chainType: ChainType.Evm,
                logo: walletConnectMetadata?.icons[0] ?? connector?.icon,
              });
            }

            track("wallet connected", {
              walletName: connector.name,
              chainId: chainIdToConnect,
              chainType: ChainType.Evm,
            });

            return { address: account[0], logo: walletConnectMetadata?.icons?.[0] };
          } catch (e) {
            const error = e as Error;
            track("connect wallet error", {
              walletName: connector.name,
              chainId: chainIdToConnect,
              ChainType: ChainType.Evm,
              errorMessage: error?.message,
            });
            console.error(error);
            throw e;
          }
        };

        const minimalWallet: MinimalWallet = {
          walletName: connector.id,
          walletPrettyName: connector.name,
          walletChainType: ChainType.Evm,
          walletInfo: {
            logo: isWalletConnect ? walletConnectLogo : connector.icon,
          },
          connect: async (chainId) => {
            await connectWallet({ chainIdToConnect: chainId });
          },
          disconnect: async () => {
            await disconnect(config);
            track("wallet disconnected", {
              walletName: connector.name,
              chainId: chainId,
              ChainType: ChainType.Evm,
            });
            setEvmWallet(undefined);
            callbacks?.onWalletDisconnected?.({
              walletName: connector.name,
              chainType: ChainType.Evm,
            });
          },
          getAddress: async ({ signRequired }) => {
            if (signRequired && !isEvmConnected) {
              return connectWallet({
                chainIdToConnect: chainId,
              });
            }
            track("get address", {
              walletName: connector.name,
              chainId: chainId,
              ChainType: ChainType.Evm,
            });
            try {
              const account = await connector.getAccounts();
              if (account.length === 0) {
                throw new Error("No accounts found");
              }
              return { address: account[0] };
            } catch (_error) {
              return connectWallet({
                chainIdToConnect: chainId,
              });
            }
          },
          isWalletConnected: connector.id === currentEvmConnector?.id,
        };

        if (isSei) {
          const isMultiChainWallet =
            connector.name.toLowerCase().includes("keplr") ||
            connector.name.toLowerCase().includes("leap") ||
            connector.name.toLowerCase().includes("cosmostation");
          minimalWallet.walletPrettyName = `${connector.name} ${isMultiChainWallet ? "(EVM)" : ""}`;
          minimalWallet.getAddress = async () => {
            track("get address", {
              walletName: connector.name,
              chainId: chainId,
              ChainType: ChainType.Cosmos,
            });
            const { address } = await connectWallet({
              chainIdToConnect: chainId,
            });
            const publicClient = createPublicClient({
              chain: sei,
              transport: http(),
            });
            try {
              const seiAddress = await publicClient.readContract({
                args: [address as `0x${string}`],
                address: "0x0000000000000000000000000000000000001004",
                abi: seiPrecompileAddrABI,
                functionName: "getSeiAddr",
              });
              return { address: seiAddress };
            } catch (e) {
              const error = e as Error;
              track("get address error", {
                walletName: connector.name,
                chainId: chainId,
                ChainType: ChainType.Cosmos,
                errorMessage: error?.message,
              });
              console.error(error);
              throw new Error(`Your EVM address (0x) has not been associated on chain yet. Please visit https://app.sei.io/ to associate your SEI address.
`);
            }
          };
        }
        wallets.push(minimalWallet);
      }
      return wallets;
    },
    [
      connectors,
      currentEvmConnector?.id,
      isEvmConnected,
      accountChainId,
      connectAsync,
      sourceAsset,
      setWCDeepLinkByChainType,
      evmWallet,
      setDefaultSourceAsset,
      callbacks,
      setEvmWallet,
    ],
  );

  return { createEvmWallets };
};
