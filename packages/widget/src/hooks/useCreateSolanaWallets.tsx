import { solanaWallets } from "@/constants/solana";
import { skipChainsAtom, skipAssetsAtom } from "@/state/skipClient";
import { sourceAssetAtom } from "@/state/swapPage";
import { MinimalWallet, svmWalletAtom } from "@/state/wallets";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";
import { ChainType } from "@skip-go/client";
import { callbacksAtom } from "@/state/callbacks";
import { walletConnectLogo } from "@/constants/wagmi";
import { WalletConnectMetaData } from "./useCreateEvmWallets";
import { useStoreAndRestoreWalletConnectLocalStorage } from "./useStoreAndRestoreWalletConnectLocalStorage";

export const useCreateSolanaWallets = () => {
  const { data: chains } = useAtomValue(skipChainsAtom);
  const { data: assets } = useAtomValue(skipAssetsAtom);
  const setSourceAsset = useSetAtom(sourceAssetAtom);
  const setSvmWallet = useSetAtom(svmWalletAtom);
  const callbacks = useAtomValue(callbacksAtom);
  const { storeWalletConnectLocalStorageValues, restoreWalletConnectLocalStorageValues } =
    useStoreAndRestoreWalletConnectLocalStorage();

  const createSolanaWallets = useCallback(() => {
    const wallets: MinimalWallet[] = [];

    for (const wallet of solanaWallets) {
      const isWalletConnect = wallet.name === "WalletConnect";

      const updateSourceWallet = (walletConnectMetadata?: WalletConnectMetaData) => {
        setSvmWallet({
          walletName: walletConnectMetadata?.name ?? wallet.name,
          chainType: ChainType.SVM,
          logo: walletConnectMetadata?.icons[0] ?? wallet.icon,
        });
      };

      const connectWallet = async ({
        chainIdToConnect,
        shouldUpdateSourceWallet = true,
      }: {
        chainIdToConnect?: string;
        shouldUpdateSourceWallet?: boolean;
      }) => {
        try {
          await wallet.connect();
          const chain = chains?.find((x) => x.chainID === "solana");
          const asset = assets?.find(
            (x) =>
              x.denom.toLowerCase() ===
              "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v".toLowerCase(),
          );

          if (chainIdToConnect === undefined) {
            setSourceAsset({
              chainID: chain?.chainID,
              chainName: chain?.chainName,
              ...asset,
            });
          }

          const address = wallet.publicKey?.toBase58();

          if (shouldUpdateSourceWallet) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const walletConnectMetadata = (wallet as any)?._wallet?._UniversalProvider?.session
              ?.peer?.metadata;
            updateSourceWallet(walletConnectMetadata);
            callbacks?.onWalletConnected?.({
              walletName: wallet.name,
              chainId: chain?.chainID,
              address,
            });
          }

          return address;
        } catch (error) {
          console.error(error);
          throw error;
        } finally {
          window.localStorage.removeItem("WALLETCONNECT_DEEPLINK_CHOICE");
        }
      };

      const minimalWallet: MinimalWallet = {
        walletName: wallet.name,
        walletPrettyName: wallet.name,
        walletChainType: ChainType.SVM,
        walletInfo: {
          logo: isWalletConnect ? walletConnectLogo : wallet.icon,
        },
        connect: async (chainId) => connectWallet({ chainIdToConnect: chainId }),
        getAddress: async () => {
          try {
            const address = wallet.publicKey;
            if (!address) {
              throw new Error("Address not found");
            }
            return address.toBase58();
          } catch (error) {
            console.error(error);
            storeWalletConnectLocalStorageValues();
            const address = connectWallet({ shouldUpdateSourceWallet: false });
            restoreWalletConnectLocalStorageValues();
            return address;
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
  }, [setSvmWallet, chains, assets, callbacks, setSourceAsset]);
  return { createSolanaWallets };
};
