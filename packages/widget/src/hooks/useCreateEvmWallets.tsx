import { seiPrecompileAddrABI } from "@/constants/abis";
import { skipChainsAtom, skipAssetsAtom } from "@/state/skipClient";
import { sourceAssetAtom } from "@/state/swapPage";
import { evmWalletAtom, MinimalWallet } from "@/state/wallets";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";
import { createPublicClient, http } from "viem";
import { sei } from "viem/chains";
import { useAccount, useConnect, useConnectors } from "wagmi";
import { ChainType } from "@skip-go/client";
import { walletConnectLogo } from "@/constants/wagmi";
import { callbacksAtom } from "@/state/callbacks";

export type WalletConnectMetaData = {
  name: string;
  description: string;
  icons: string[];
  redirect: {
    native: string;
    universal: string;
  };
  url: string;
  publicKey: string;
};

export const useCreateEvmWallets = () => {
  const { data: chains } = useAtomValue(skipChainsAtom);
  const { data: assets } = useAtomValue(skipAssetsAtom);
  const [sourceAsset, setSourceAsset] = useAtom(sourceAssetAtom);
  const [evmWallet, setEvmWallet] = useAtom(evmWalletAtom);
  const callbacks = useAtomValue(callbacksAtom);

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

        const evmGetAddress: MinimalWallet["getAddress"] = async ({ signRequired }) => {
          if (evmWallet?.address) {
            return evmWallet?.address;
          } else {
            const walletConnectedButNeedToSwitchChain =
              signRequired &&
              isEvmConnected &&
              chainId !== Number(chainID) &&
              connector.id === currentEvmConnector?.id;
            console.log("walletConnectedButNeedToSwitchChain", walletConnectedButNeedToSwitchChain);
            if (walletConnectedButNeedToSwitchChain) {
              await connector?.switchChain?.({
                chainId: Number(chainID),
              });
              return evmWallet?.address;
            }

            const res = await connectAsync({
              connector,
              chainId: Number(chainID),
            });

            const provider = await connector.getProvider();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const walletConnectMetadata = (provider as any).session?.peer?.metadata;

            updateWalletState(res.accounts[0], walletConnectMetadata);
            return res.accounts[0];
          }
        };

        const updateWalletState = (
          address: string,
          walletConnectMetadata: WalletConnectMetaData,
        ) => {
          console.log({
            walletName: connector.id,
            walletPrettyName: walletConnectMetadata?.name ?? connector.name,
            walletChainType: ChainType.EVM,
            walletInfo: {
              logo: walletConnectMetadata?.icons[0] ?? connector.icon,
            },
            address: address,
            chainId,
          });

          setEvmWallet({
            walletName: connector.id,
            walletPrettyName: walletConnectMetadata?.name ?? connector.name,
            walletChainType: ChainType.EVM,
            walletInfo: {
              logo: walletConnectMetadata?.icons[0] ?? connector.icon,
            },
            address: address.toLowerCase(),
            chainId: chainID,
          });
        };

        const minimalWallet: MinimalWallet = {
          walletName: connector.id,
          walletPrettyName: connector.name,
          walletChainType: ChainType.EVM,
          walletInfo: {
            logo: isWalletConnect ? walletConnectLogo : connector.icon,
          },
          connect: async (chainIdToConnect = "1") => {
            if (connector) {
              console.log(connector);
              await connector.disconnect();
            }
            if (
              isEvmConnected &&
              chainId !== Number(chainIdToConnect) &&
              connector.id === currentEvmConnector?.id
            ) {
              await connector?.switchChain?.({
                chainId: Number(chainIdToConnect),
              });
              const account = await connector.getAccounts();

              const provider = await connector.getProvider();
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const walletConnectMetadata = (provider as any).session?.peer?.metadata;
              console.log(provider.connector);

              updateWalletState(account[0], walletConnectMetadata);
              return;
            }

            try {
              const response = await connectAsync({ connector, chainId: Number(chainIdToConnect) });
              const account = await connector.getAccounts();
              const provider = await connector.getProvider();
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const walletConnectMetadata = (provider as any).session?.peer?.metadata;

              updateWalletState(response.accounts[0], walletConnectMetadata);

              if (!sourceAsset) {
                const chain = chains?.find((x) => x.chainID === "1");
                const asset = assets?.find((x) => x.denom === "ethereum-native");
                setSourceAsset({
                  chainID: chain?.chainID,
                  chainName: chain?.chainName,
                  ...asset,
                });
              }

              callbacks?.onWalletConnected?.({
                walletName: connector.name,
                chainId: chainID,
                address: account[0],
              });
            } catch (error) {
              console.error(error);
              throw error;
            } finally {
              window.localStorage.removeItem("WALLETCONNECT_DEEPLINK_CHOICE");
            }
          },
          disconnect: async () => {
            await currentConnector?.disconnect();
            setEvmWallet(undefined);
            callbacks?.onWalletDisconnected?.({
              walletName: connector.name,
              chainType: ChainType.EVM,
            });
          },
          isWalletConnected: connector.id === currentEvmConnector?.id,
        };

        if (isSei) {
          const isMultiChainWallet =
            connector.name.toLowerCase().includes("keplr") ||
            connector.name.toLowerCase().includes("leap") ||
            connector.name.toLowerCase().includes("cosmostation");
          minimalWallet.walletPrettyName = `${connector.name} ${isMultiChainWallet ? "(EVM)" : ""}`;
          minimalWallet.getAddress = async ({ signRequired, context }) => {
            const address = await evmGetAddress({ signRequired, context });
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
              return seiAddress;
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
      evmWallet?.address,
      isEvmConnected,
      chainId,
      connectAsync,
      setEvmWallet,
      sourceAsset,
      callbacks,
      chains,
      assets,
      setSourceAsset,
      currentConnector,
    ],
  );

  return { createEvmWallets };
};
