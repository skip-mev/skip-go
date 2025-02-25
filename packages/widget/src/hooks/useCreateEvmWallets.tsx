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
import { useAccount, useConnect, useConnectors, useSwitchChain } from "wagmi";
import { ChainType } from "@skip-go/client";
import { walletConnectLogo } from "@/constants/wagmi";
import { callbacksAtom } from "@/state/callbacks";

export const useCreateEvmWallets = () => {
  const { data: chains } = useAtomValue(skipChainsAtom);
  const { data: assets } = useAtomValue(skipAssetsAtom);
  const [sourceAsset, setSourceAsset] = useAtom(sourceAssetAtom);
  const setEvmWallet = useSetAtom(evmWalletAtom);
  const callbacks = useAtomValue(callbacksAtom);
  const setWCDeepLinkByChainType = useSetAtom(setWalletConnectDeepLinkByChainTypeAtom);

  const { connector: currentEvmConnector, isConnected: isEvmConnected, chainId } = useAccount();
  const { connectAsync } = useConnect();
  const { switchChain } = useSwitchChain();
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
          // const needToSwitchChain =
          //   isEvmConnected &&
          //   chainId !== Number(chainIdToConnect) &&
          //   connector.id === currentEvmConnector?.id;

          try {
            if (isEvmConnected && connector.id !== currentEvmConnector?.id) {
              await currentConnector?.disconnect();
            }
            switchChain?.({
              chainId: Number(chainIdToConnect),
            });
            await connectAsync({ connector, chainId: Number(chainIdToConnect) });

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
            callbacks?.onWalletConnected?.({
              walletName: connector.name,
              chainId: chainID,
              address: account[0],
            });

            return { address: account[0], logo: walletConnectMetadata?.icons?.[0] };
          } catch (error) {
            console.error(error);
            throw error;
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
            setEvmWallet(undefined);
            callbacks?.onWalletDisconnected?.({
              walletName: connector.name,
              chainType: ChainType.EVM,
            });
          },
          getAddress: async ({ signRequired }) => {
            try {
              if (signRequired) {
                throw new Error("always prompt wallet connection");
              }
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
            } catch (error) {
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
      callbacks,
      currentConnector,
      connectAsync,
      chains,
      assets,
      setSourceAsset,
      setEvmWallet,
    ],
  );

  return { createEvmWallets };
};
