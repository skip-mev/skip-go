import { skipChainsAtom } from "@/state/skipClient";
import { sourceAssetAtom } from "@/state/swapPage";
import {
  MinimalWallet,
  setWalletConnectDeepLinkByChainTypeAtom,
  svmWalletAtom,
  WalletConnectMetaData,
} from "@/state/wallets";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";
import { callbacksAtom } from "@/state/callbacks";
import { walletConnectLogo } from "@/constants/wagmi";
import { track } from "@amplitude/analytics-browser";
import { useUpdateSourceAssetToDefaultForChainType } from "./useUpdateSourceAssetToDefaultForChainType";
import { ChainType } from "@skip-go/client";
import { useWallet } from "@solana/wallet-adapter-react";

export const useCreateSolanaWallets = () => {
  const { data: chains } = useAtomValue(skipChainsAtom);
  const sourceAsset = useAtomValue(sourceAssetAtom);
  const [svmWallet, setSvmWallet] = useAtom(svmWalletAtom);
  const callbacks = useAtomValue(callbacksAtom);
  const setWCDeepLinkByChainType = useSetAtom(setWalletConnectDeepLinkByChainTypeAtom);

  const { wallets: solanaWallets } = useWallet();

  const setDefaultSourceAsset = useUpdateSourceAssetToDefaultForChainType();

  const createSolanaWallets = useCallback(() => {
    const wallets: MinimalWallet[] = [];

    for (const wallet of solanaWallets) {
      const adapter = wallet.adapter;
      const isWalletConnect = adapter.name === "WalletConnect";

      const connectWallet = async () => {
        try {
          await adapter.connect();
          const chain = chains?.find((x) => x.chainId === "solana");

          if (sourceAsset === undefined) {
            setDefaultSourceAsset(ChainType.Svm);
          }

          const address = adapter.publicKey?.toBase58();

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const walletConnectMetadata = (adapter as any)?._wallet?._UniversalProvider?.session?.peer
            ?.metadata as WalletConnectMetaData;

          setWCDeepLinkByChainType(ChainType.Svm);

          if (svmWallet === undefined) {
            callbacks?.onWalletConnected?.({
              walletName: adapter.name,
              chainId: chain?.chainId,
              address,
            });
            setSvmWallet({
              id: address,
              walletName: adapter.name,
              chainType: ChainType.Svm,
              logo: walletConnectMetadata?.icons[0] ?? adapter.icon,
            });
          }
          track("wallet connected", {
            walletName: adapter.name,
            chainType: ChainType.Svm,
            chainId: chain?.chainId,
            address,
          });

          return { address, logo: walletConnectMetadata?.icons?.[0] };
        } catch (error) {
          console.error(error);
          throw error;
        }
      };

      const minimalWallet: MinimalWallet = {
        walletName: adapter.name,
        walletPrettyName: adapter.name,
        walletChainType: ChainType.Svm,
        walletInfo: {
          logo: isWalletConnect ? walletConnectLogo : adapter.icon,
        },
        connect: async () => {
          await connectWallet();
        },
        getAddress: async ({ signRequired }) => {
          try {
            if (signRequired) {
              throw new Error("always prompt wallet connection");
            }
            const address = adapter.publicKey;
            if (!address) {
              throw new Error("Address not found");
            }
            return { address: address.toBase58() };
          } catch (error) {
            console.error(error);
            return connectWallet();
          }
        },
        disconnect: async () => {
          await adapter.disconnect();
          track("wallet disconnected", {
            walletName: adapter.name,
            chainType: ChainType.Svm,
          });
          setSvmWallet(undefined);
          callbacks?.onWalletDisconnected?.({
            walletName: adapter.name,
            chainType: ChainType.Svm,
          });
        },
        isWalletConnected: adapter.connected,
        isAvailable: adapter.readyState === "Installed" || adapter.readyState === "Loadable",
      };
      wallets.push(minimalWallet);
    }
    return wallets;
  }, [
    chains,
    sourceAsset,
    setWCDeepLinkByChainType,
    svmWallet,
    setDefaultSourceAsset,
    callbacks,
    setSvmWallet,
  ]);
  return { createSolanaWallets };
};
