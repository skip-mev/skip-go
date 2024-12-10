import { solanaWallets } from "@/constants/solana";
import { skipChainsAtom, skipAssetsAtom } from "@/state/skipClient";
import { sourceAssetAtom } from "@/state/swapPage";
import { MinimalWallet, svmWalletAtom } from "@/state/wallets";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";
import { ChainType } from "@skip-go/client";
import { allCallbacksAtom } from "@/state/callbacks";


export const useCreateSolanaWallets = () => {
  const { data: chains } = useAtomValue(skipChainsAtom);
  const { data: assets } = useAtomValue(skipAssetsAtom);
  const setSourceAsset = useSetAtom(sourceAssetAtom);
  const setSvmWallet = useSetAtom(svmWalletAtom);
  const allCallbacks = useAtomValue(allCallbacksAtom);

  const createSolanaWallets = useCallback(() => {
    const wallets: MinimalWallet[] = [];

    for (const wallet of solanaWallets) {
      const minimalWallet: MinimalWallet = {
        walletName: wallet.name,
        walletPrettyName: wallet.name,
        walletChainType: ChainType.SVM,
        walletInfo: {
          logo: wallet.icon,
        },
        connect: async () => {
          try {
            await wallet.connect();
            setSvmWallet({ walletName: wallet.name, chainType: ChainType.SVM });
            // TODO: onWalletConnected
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
            const asset = assets?.find((x) => x.denom.toLowerCase() ===
              "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v".toLowerCase());
            setSourceAsset({
              chainID: chain?.chainID,
              chainName: chain?.chainName,
              ...asset
            });
            // TODO: onWalletConnected
          } catch (error) {
            console.error(error);
            throw error;
          }
        },
        getAddress: async ({ signRequired }) => {
          try {
            const isConnected = wallet.connected;
            if (!isConnected) {
              await wallet.connect();
              setSvmWallet({ walletName: wallet.name, chainType: ChainType.SVM });
            }
            const address = wallet.publicKey;
            if (!address) throw new Error("No address found");
            if (signRequired) {
              setSvmWallet({ walletName: wallet.name, chainType: ChainType.SVM });
            }
            return address.toBase58();
          } catch (error) {
            console.error(error);
          }
        },
        disconnect: async () => {
          await wallet.disconnect();
          setSvmWallet(undefined);
          allCallbacks?.onWalletDisconnected?.({ chainType: "svm" });
        },
        isWalletConnected: wallet.connected,
        isAvailable: wallet.readyState === "Installed",
      };
      wallets.push(minimalWallet);
    }
    return wallets;
  }, [assets, chains, setSourceAsset, setSvmWallet]);
  return { createSolanaWallets };
};
