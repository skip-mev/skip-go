import { seiPrecompileAddrABI } from "@/constants/abis";
import { skipChainsAtom, skipAssetsAtom } from "@/state/skipClient";
import { sourceAssetAtom } from "@/state/swapPage";
import { evmWalletAtom, MinimalWallet } from "@/state/wallets";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";
import { createPublicClient, http } from "viem";
import { sei } from "viem/chains";
import { useAccount, useConnect, useConnectors, useDisconnect } from "wagmi";
import { ChainType } from "@skip-go/client";
import { walletConnectLogo } from "@/constants/wagmi";
import { callbacksAtom } from "@/state/callbacks";
import { isMobile } from "@/utils/os";

export const useCreateEvmWallets = () => {
  const { data: chains } = useAtomValue(skipChainsAtom);
  const { data: assets } = useAtomValue(skipAssetsAtom);
  const setSourceAsset = useSetAtom(sourceAssetAtom);
  const setEvmWallet = useSetAtom(evmWalletAtom);
  const callbacks = useAtomValue(callbacksAtom);

  const {
    connector: currentEvmConnector,
    address: evmAddress,
    isConnected: isEvmConnected,
    chainId,
  } = useAccount();
  const { connectAsync } = useConnect();
  const connectors = useConnectors();
  const currentConnector = connectors.find((connector) => connector.id === currentEvmConnector?.id);
  const { disconnectAsync } = useDisconnect();
  const mobile = isMobile();

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
          if (isWalletConnect && mobile) {
            if (isEvmConnected) {
              return evmAddress;
            }
            const res = await connectAsync({
              connector,
              chainId: Number(chainID),
            });
            await disconnectAsync();
            setEvmWallet(undefined);
            window.localStorage.removeItem("WALLETCONNECT_DEEPLINK_CHOICE");
            window.localStorage.removeItem("WCM_RECENT_WALLET_DATA");
            return res.accounts[0];
          }
          if (
            signRequired &&
            isEvmConnected &&
            chainId !== Number(chainID) &&
            connector.id === currentEvmConnector?.id
          ) {
            await connector?.switchChain?.({
              chainId: Number(chainID),
            });
            return evmAddress;
          }
          if (connector.id !== currentEvmConnector?.id || !isEvmConnected) {
            const res = await connectAsync({
              connector,
              chainId: Number(chainID),
            });
            setEvmWallet({
              walletName: connector.id,
              chainType: ChainType.EVM,
            });
            return res.accounts[0];
          } else if (evmAddress && isEvmConnected && signRequired) {
            setEvmWallet({
              walletName: connector.id,
              chainType: ChainType.EVM,
            });
          }
          return evmAddress;
        };

        const minimalWallet: MinimalWallet = {
          walletName: connector.id,
          walletPrettyName: connector.name,
          walletChainType: ChainType.EVM,
          walletInfo: {
            logo: isWalletConnect ? walletConnectLogo : connector.icon,
          },
          connectEco: async () => {
            if (
              isEvmConnected &&
              chainId !== Number(1) &&
              connector.id === currentEvmConnector?.id
            ) {
              await connector?.switchChain?.({
                chainId: Number(1),
              });
              return;
            }
            if (isEvmConnected && connector.id !== currentEvmConnector?.id) {
              await currentConnector?.disconnect();
            }
            try {
              await connectAsync({ connector, chainId: Number(1) });
              setEvmWallet({
                walletName: connector.id,
                chainType: ChainType.EVM,
              });
              const chain = chains?.find((x) => x.chainID === "1");
              const asset = assets?.find((x) => x.denom === "ethereum-native");
              setSourceAsset({
                chainID: chain?.chainID,
                chainName: chain?.chainName,
                ...asset,
              });
              const account = await connector.getAccounts();
              callbacks?.onWalletConnected?.({
                walletName: connector.name,
                chainId: chain?.chainID,
                address: account[0],
              });
            } catch (error) {
              console.error(error);
              throw error;
            }
          },
          connect: async () => {
            if (
              isEvmConnected &&
              chainId !== Number(chainID) &&
              connector.id === currentEvmConnector?.id
            ) {
              await connector?.switchChain?.({
                chainId: Number(chainID),
              });
              return;
            }
            if (isEvmConnected && connector.id !== currentEvmConnector?.id) {
              await currentConnector?.disconnect();
            }
            try {
              await connectAsync({ connector, chainId: Number(chainID) });
              setEvmWallet({
                walletName: connector.id,
                chainType: ChainType.EVM,
              });
              const account = await connector.getAccounts();
              callbacks?.onWalletConnected?.({
                walletName: connector.name,
                chainId: chainID,
                address: account[0],
              });
            } catch (error) {
              console.error(error);
              throw error;
            }
          },
          getAddress: async ({ signRequired, context }) => {
            try {
              const address = await evmGetAddress({ signRequired, context });
              return address;
            } catch (error) {
              console.error(error);
              throw error;
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
      mobile,
      isEvmConnected,
      chainId,
      evmAddress,
      connectAsync,
      disconnectAsync,
      setEvmWallet,
      currentConnector,
      chains,
      assets,
      setSourceAsset,
      callbacks,
    ],
  );

  return { createEvmWallets };
};
