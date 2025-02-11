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
import { WalletConnectMetaData } from "./useCreateEvmWallets";

export const useCreateSolanaWallets = () => {
  const { data: chains } = useAtomValue(skipChainsAtom);
  const { data: assets } = useAtomValue(skipAssetsAtom);
  const setSourceAsset = useSetAtom(sourceAssetAtom);
  const setSvmWallet = useSetAtom(svmWalletAtom);
  const callbacks = useAtomValue(callbacksAtom);
  const mobile = isMobile();

  const createSolanaWallets = useCallback(() => {
    const wallets: MinimalWallet[] = [];

    for (const wallet of solanaWallets) {
      const isWalletConnect = wallet.name === "WalletConnect";

      const updateWalletState = (walletConnectMetadata?: WalletConnectMetaData) => {
        setSvmWallet({
          walletName: walletConnectMetadata?.name ?? wallet.name,
          chainType: ChainType.SVM,
          logo: walletConnectMetadata?.icons[0] ?? wallet.icon,
        });
      };

      const minimalWallet: MinimalWallet = {
        walletName: wallet.name,
        walletPrettyName: wallet.name,
        walletChainType: ChainType.SVM,
        walletInfo: {
          logo: isWalletConnect ? walletConnectLogo : wallet.icon,
        },
        connect: async (chainId?: string) => {
          try {
            await wallet.connect();
            const chain = chains?.find((x) => x.chainID === "solana");
            const asset = assets?.find(
              (x) =>
                x.denom.toLowerCase() ===
                "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v".toLowerCase(),
            );

            if (chainId === undefined) {
              setSourceAsset({
                chainID: chain?.chainID,
                chainName: chain?.chainName,
                ...asset,
              });
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const walletConnectMetadata = (wallet as any)?._wallet?._UniversalProvider?.session
              ?.peer?.metadata;

            const address = wallet.publicKey?.toBase58();
            updateWalletState(address, walletConnectMetadata);
            callbacks?.onWalletConnected?.({
              walletName: wallet.name,
              chainId: chain?.chainID,
              address,
            });
            return address;
          } catch (error) {
            console.error(error);
            throw error;
          } finally {
            window.localStorage.removeItem("WALLETCONNECT_DEEPLINK_CHOICE");
          }
        },
        getAddress: async ({ signRequired }) => {
          try {
            const isConnected = wallet.connected;
            if (!isConnected) {
              if (isWalletConnect && mobile) {
                await wallet.connect();
                const address = wallet.publicKey;
                if (!address) throw new Error("No address found");
                await wallet.disconnect();
                setSvmWallet(undefined);
                window.localStorage.removeItem("WALLETCONNECT_DEEPLINK_CHOICE");
                window.localStorage.removeItem("WCM_RECENT_WALLET_DATA");
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
  }, [setSvmWallet, chains, assets, callbacks, setSourceAsset, mobile]);
  return { createSolanaWallets };
};
