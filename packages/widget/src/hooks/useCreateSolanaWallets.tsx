import { solanaWallets } from "@/constants/solana";
import { skipChainsAtom, skipAssetsAtom } from "@/state/skipClient";
import { sourceAssetAtom } from "@/state/swapPage";
import { MinimalWallet, svmWalletAtom } from "@/state/wallets";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";
import { ChainType } from "@skip-go/client";
import { callbacksAtom } from "@/state/callbacks";
import { walletConnectLogo } from "@/constants/wagmi";
import { isMobile } from "@/utils/os";

export const useCreateSolanaWallets = () => {
  const { data: chains } = useAtomValue(skipChainsAtom);
  const { data: assets } = useAtomValue(skipAssetsAtom);
  const setSourceAsset = useSetAtom(sourceAssetAtom);
  const [svmWallet, setSvmWallet] = useAtom(svmWalletAtom);
  const callbacks = useAtomValue(callbacksAtom);
  const mobile = isMobile();

  const createSolanaWallets = useCallback(() => {
    const wallets: MinimalWallet[] = [];

    for (const wallet of solanaWallets) {
      const isWalletConnect = wallet.name === "WalletConnect";

      const updateWalletState = (address?: string) => {
        setSvmWallet({
          walletName: wallet.name,
          walletChainType: ChainType.SVM,
          walletPrettyName: wallet.name,
          walletInfo: {
            logo: isWalletConnect ? walletConnectLogo : wallet.icon,
          },
          address,
        });
      };

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
            const chain = chains?.find((x) => x.chainID === "solana");

            const address = wallet.publicKey?.toBase58();
            updateWalletState(address);
            callbacks?.onWalletConnected?.({
              walletName: wallet.name,
              chainId: chain?.chainID,
              address,
            });
          } catch (error) {
            console.error(error);
            throw error;
          } finally {
            window.localStorage.removeItem("WALLETCONNECT_DEEPLINK_CHOICE");
          }
        },
        connectEco: async () => {
          try {
            await wallet.connect();

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
            updateWalletState(address);
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
        getAddress: async () => {
          try {
            if (svmWallet?.address) {
              return svmWallet.address;
            } else {
              await wallet.connect();
              const address = wallet.publicKey?.toBase58();
              if (!address) throw new Error("No address found");

              updateWalletState(address);

              return address;
            }
          } catch (error) {
            console.error(error);
          } finally {
            window.localStorage.removeItem("WALLETCONNECT_DEEPLINK_CHOICE");
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
  }, [chains, setSvmWallet, callbacks, assets, setSourceAsset, svmWallet?.address]);
  return { createSolanaWallets };
};
