import { solanaWallets } from "@/constants/solana";
import { MinimalWallet, svmWalletAtom } from "@/state/wallets";
import { useSetAtom } from "jotai";
import { useCallback } from "react";


export const useCreateSolanaWallets = () => {
  const setSvmWallet = useSetAtom(svmWalletAtom);
  const createSolanaWallets = useCallback(() => {
    const wallets: MinimalWallet[] = [];

    for (const wallet of solanaWallets) {
      const minimalWallet: MinimalWallet = {
        walletName: wallet.name,
        walletPrettyName: wallet.name,
        walletChainType: "svm",
        walletInfo: {
          logo: wallet.icon,
        },
        connect: async () => {
          try {
            await wallet.connect();
            setSvmWallet({ walletName: wallet.name, chainType: "svm" });
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
              setSvmWallet({ walletName: wallet.name, chainType: "svm" });
            }
            const address = wallet.publicKey;
            if (!address) throw new Error("No address found");
            if (signRequired) {
              setSvmWallet({ walletName: wallet.name, chainType: "svm" });
            }
            return address.toBase58();
          } catch (error) {
            console.error(error);
          }
        },
        disconnect: async () => {
          await wallet.disconnect();
          setSvmWallet(undefined);
          // TODO: onWalletDisconnected
        },
        isWalletConnected: wallet.connected,
        isAvailable: wallet.readyState === "Installed",
      };
      wallets.push(minimalWallet);
    }
    return wallets;
  }, [setSvmWallet]);
  return { createSolanaWallets };
};
