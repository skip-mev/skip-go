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
import { solanaWallets } from "@/constants/solana";
import { track } from "@amplitude/analytics-browser";
import { useUpdateSourceAssetToDefaultForChainType } from "./useUpdateSourceAssetToDefaultForChainType";
import { ChainType } from "@skip-go/client";

export const useCreateSolanaWallets = () => {
  const { data: chains } = useAtomValue(skipChainsAtom);
  const sourceAsset = useAtomValue(sourceAssetAtom);
  const [svmWallet, setSvmWallet] = useAtom(svmWalletAtom);
  const callbacks = useAtomValue(callbacksAtom);
  const setWCDeepLinkByChainType = useSetAtom(setWalletConnectDeepLinkByChainTypeAtom);

  const setDefaultSourceAsset = useUpdateSourceAssetToDefaultForChainType();

  const createSolanaWallets = useCallback(() => {
    const wallets: MinimalWallet[] = [];

    for (const wallet of solanaWallets) {
      const isWalletConnect = wallet.name === "WalletConnect";

      const connectWallet = async () => {
        try {
          await wallet.connect();
          const chain = chains?.find((x) => x.chainId === "solana");

          if (sourceAsset === undefined) {
            setDefaultSourceAsset(ChainType.Svm);
          }

          const address = wallet.publicKey?.toBase58();

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const walletConnectMetadata = (wallet as any)?._wallet?._UniversalProvider?.session?.peer
            ?.metadata as WalletConnectMetaData;

          setWCDeepLinkByChainType(ChainType.Svm);

          if (svmWallet === undefined) {
            callbacks?.onWalletConnected?.({
              walletName: wallet.name,
              chainId: chain?.chainId,
              address,
            });
            setSvmWallet({
              id: address,
              walletName: wallet.name,
              chainType: ChainType.Svm,
              logo: walletConnectMetadata?.icons[0] ?? wallet.icon,
            });
          }
          track("wallet connected", {
            walletName: wallet.name,
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
        walletName: wallet.name,
        walletPrettyName: wallet.name,
        walletChainType: ChainType.Svm,
        walletInfo: {
          logo: isWalletConnect ? walletConnectLogo : wallet.icon,
        },
        connect: async () => {
          await connectWallet();
        },
        getAddress: async ({ signRequired }) => {
          try {
            if (signRequired) {
              throw new Error("always prompt wallet connection");
            }
            const address = wallet.publicKey;
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
          await wallet.disconnect();
          track("wallet disconnected", {
            walletName: wallet.name,
            chainType: ChainType.Svm,
          });
          setSvmWallet(undefined);
          callbacks?.onWalletDisconnected?.({
            walletName: wallet.name,
            chainType: ChainType.Svm,
          });
        },
        isWalletConnected: wallet.connected,
        isAvailable: wallet.readyState === "Installed" || wallet.readyState === "Loadable",
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
