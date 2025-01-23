import { solanaWallets } from "@/constants/solana";
import { skipChainsAtom, skipAssetsAtom } from "@/state/skipClient";
import { sourceAssetAtom } from "@/state/swapPage";
import { MinimalWallet, evmWalletAtom, svmWalletAtom } from "@/state/wallets";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";
import { ChainType } from "@skip-go/client";
import { callbacksAtom } from "@/state/callbacks";
import { walletConnectLogo } from "@/constants/wagmi";
import { isMobile } from "@/utils/os";

export const useCreateSolanaWallets = () => {
  const { data: chains } = useAtomValue(skipChainsAtom);
  const { data: assets } = useAtomValue(skipAssetsAtom);
  const setSourceAsset = useSetAtom(sourceAssetAtom);
  const setSvmWallet = useSetAtom(svmWalletAtom);
  const callbacks = useAtomValue(callbacksAtom);
  const mobile = isMobile();
  const evmWallet = useAtomValue(evmWalletAtom);

  const createSolanaWallets = useCallback(() => {
    const wallets: MinimalWallet[] = [];

    for (const wallet of solanaWallets) {
      const isWalletConnect = wallet.name === "WalletConnect";
      const minimalWallet: MinimalWallet = {
        walletName: wallet.name,
        walletPrettyName: wallet.name,
        walletChainType: ChainType.SVM,
        walletInfo: {
          logo: isWalletConnect ? walletConnectLogo : wallet.icon,
        },
        connect: async () => {
          try {
            await wallet.connect();
            setSvmWallet({ walletName: wallet.name, chainType: ChainType.SVM });
            const chain = chains?.find((x) => x.chainID === "solana");

            const address = wallet.publicKey?.toBase58();
            callbacks?.onWalletConnected?.({
              walletName: wallet.name,
              chainId: chain?.chainID,
              address,
            });
          } catch (error) {
            console.error(error);
            throw error;
          }
        },
        connectEco: async () => {
          try {
            await wallet.connect();
            setSvmWallet({ walletName: wallet.name, chainType: ChainType.SVM });
            const chain = chains?.find((x) => x.chainID === "solana");
            const asset = assets?.find(
              (x) =>
                x.denom.toLowerCase() ===
                "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v".toLowerCase(),
            );
            setSourceAsset({
              chainID: chain?.chainID,
              chainName: chain?.chainName,
              ...asset,
            });
            const address = wallet.publicKey?.toBase58();
            callbacks?.onWalletConnected?.({
              walletName: wallet.name,
              chainId: chain?.chainID,
              address,
            });
          } catch (error) {
            console.error(error);
            throw error;
          }
        },
        getAddress: async ({ signRequired }) => {
          let currentWCDeepLinkChoice: string | undefined;
          let currentWCRecentWalletData: string | undefined;
          try {
            const isConnected = wallet.connected;
            if (!isConnected) {
              if (isWalletConnect && mobile) {
                if (evmWallet) {
                  currentWCDeepLinkChoice =
                    window.localStorage.getItem("WALLETCONNECT_DEEPLINK_CHOICE") || undefined;
                  currentWCRecentWalletData =
                    window.localStorage.getItem("WCM_RECENT_WALLET_DATA") || undefined;
                }
                await wallet.connect();
                const address = wallet.publicKey;
                if (!address) throw new Error("No address found");
                await wallet.disconnect();
                setSvmWallet(undefined);
                if (currentWCDeepLinkChoice) {
                  window.localStorage.setItem(
                    "WALLETCONNECT_DEEPLINK_CHOICE",
                    currentWCDeepLinkChoice,
                  );
                } else {
                  window.localStorage.removeItem("WALLETCONNECT_DEEPLINK_CHOICE");
                }
                if (currentWCRecentWalletData) {
                  window.localStorage.setItem("WCM_RECENT_WALLET_DATA", currentWCRecentWalletData);
                } else {
                  window.localStorage.removeItem("WCM_RECENT_WALLET_DATA");
                }
                return address.toBase58();
              }

              await wallet.connect();
              setSvmWallet({
                walletName: wallet.name,
                chainType: ChainType.SVM,
              });
            }
            const address = wallet.publicKey;
            if (!address) throw new Error("No address found");
            if (signRequired) {
              setSvmWallet({
                walletName: wallet.name,
                chainType: ChainType.SVM,
              });
            }
            return address.toBase58();
          } catch (error) {
            if (currentWCDeepLinkChoice) {
              window.localStorage.setItem("WALLETCONNECT_DEEPLINK_CHOICE", currentWCDeepLinkChoice);
            }
            if (currentWCRecentWalletData) {
              window.localStorage.setItem("WCM_RECENT_WALLET_DATA", currentWCRecentWalletData);
            }
            console.error(error);
          }
        },
        disconnect: async () => {
          await wallet.disconnect();
          setSvmWallet(undefined);
          callbacks?.onWalletDisconnected?.({
            walletName: wallet.name,
            chainType: ChainType.SVM,
          });
        },
        isWalletConnected: wallet.connected,
        isAvailable: wallet.readyState === "Installed" || wallet.readyState === "Loadable",
      };
      wallets.push(minimalWallet);
    }
    return wallets;
  }, [setSvmWallet, chains, callbacks, assets, setSourceAsset, mobile, evmWallet]);
  return { createSolanaWallets };
};
