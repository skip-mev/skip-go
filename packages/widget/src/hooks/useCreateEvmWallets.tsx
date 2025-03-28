import { seiPrecompileAddrABI } from "@/constants/abis";
import { skipChainsAtom, skipAssetsAtom } from "@/state/skipClient";
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
import { ChainType } from "@skip-go/client";
import { walletConnectLogo } from "@/constants/wagmi";
import { callbacksAtom } from "@/state/callbacks";
import { track } from "@amplitude/analytics-browser";

export const useCreateEvmWallets = () => {
  const { data: chains } = useAtomValue(skipChainsAtom);
  const { data: assets } = useAtomValue(skipAssetsAtom);
  const [sourceAsset, setSourceAsset] = useAtom(sourceAssetAtom);
  const [evmWallet, setEvmWallet] = useAtom(evmWalletAtom);
  const callbacks = useAtomValue(callbacksAtom);
  const setWCDeepLinkByChainType = useSetAtom(setWalletConnectDeepLinkByChainTypeAtom);

  const { connector: currentEvmConnector, isConnected: isEvmConnected, chainId } = useAccount();
  const { connectAsync } = useConnect();
  const connectors = useConnectors();
  const currentConnector = connectors.find((connector) => connector.id === currentEvmConnector?.id);

  const createEvmWallets = useCallback(
    (chainID?: string) => {
      const isSei = chainID === "pacific-1";
      if (isSei) {
        chainID = sei.id.toString();
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
            chainId !== Number(chainIdToConnect) &&
            connector.id === currentEvmConnector?.id;

          try {
            if (isEvmConnected && connector.id !== currentEvmConnector?.id) {
              await currentConnector?.disconnect();
            }
            if (walletConnectedButNeedToSwitchChain) {
              await connector?.switchChain?.({
                chainId: Number(chainIdToConnect),
              });
            } else {
              if (!isEvmConnected) {
                await connectAsync({ connector, chainId: Number(chainIdToConnect) });
              }
            }

            if (sourceAsset === undefined) {
              const chain = chains?.find((x) => x.chainID === "1");
              const asset = assets?.find((x) => x.denom === "ethereum-native");
              setSourceAsset({
                chainID: chain?.chainID,
                chainName: chain?.chainName,
                ...asset,
              });
            }

            const account = await connector.getAccounts();

            const provider = await connector.getProvider();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const walletConnectMetadata = (provider as any)?.session?.peer
              ?.metadata as WalletConnectMetaData;

            setWCDeepLinkByChainType(ChainType.EVM);

            if (evmWallet === undefined) {
              callbacks?.onWalletConnected?.({
                walletName: connector.name,
                chainId: chainID,
                address: account[0],
              });

              setEvmWallet({
                id: account[0],
                walletName: connector.id,
                chainType: ChainType.EVM,
                logo: walletConnectMetadata?.icons[0] ?? connector?.icon,
              });
            }

            track("wallet connected", {
              walletName: connector.name,
              chainId: chainIdToConnect,
              chainType: ChainType.EVM,
            });

            return { address: account[0], logo: walletConnectMetadata?.icons?.[0] };
          } catch (e) {
            const error = e as Error;
            track("connect wallet error", {
              walletName: connector.name,
              chainId: chainIdToConnect,
              ChainType: ChainType.EVM,
              errorMessage: error?.message,
            });
            console.error(error);
            throw e;
          }
        };

        const minimalWallet: MinimalWallet = {
          walletName: connector.id,
          walletPrettyName: connector.name,
          walletChainType: ChainType.EVM,
          walletInfo: {
            logo: isWalletConnect ? walletConnectLogo : connector.icon,
          },
          connect: async (chainId) => {
            await connectWallet({ chainIdToConnect: chainId });
          },
          disconnect: async () => {
            await currentConnector?.disconnect();
            track("wallet disconnected", {
              walletName: connector.name,
              chainId: chainID,
              ChainType: ChainType.EVM,
            });
            setEvmWallet(undefined);
            callbacks?.onWalletDisconnected?.({
              walletName: connector.name,
              chainType: ChainType.EVM,
            });
          },
          getAddress: async ({ signRequired }) => {
            if (signRequired) {
              return connectWallet({
                chainIdToConnect: chainID,
              });
            }
            track("get address", {
              walletName: connector.name,
              chainId: chainID,
              ChainType: ChainType.EVM,
            });
            try {
              const account = await connector.getAccounts();
              if (account.length === 0) {
                throw new Error("No accounts found");
              }
              return { address: account[0] };
            } catch (_error) {
              return connectWallet({
                chainIdToConnect: chainID,
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
              chainId: chainID,
              ChainType: ChainType.Cosmos,
            });
            const { address } = await connectWallet({
              chainIdToConnect: chainID,
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
                chainId: chainID,
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
      chainId,
      sourceAsset,
      setWCDeepLinkByChainType,
      evmWallet,
      currentConnector,
      connectAsync,
      chains,
      assets,
      setSourceAsset,
      callbacks,
      setEvmWallet,
    ],
  );

  return { createEvmWallets };
};
