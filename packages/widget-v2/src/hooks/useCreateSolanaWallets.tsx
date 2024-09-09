import { MinimalWallet, svmWalletAtom } from "@/state/wallets";
import { useWallet } from "@solana/wallet-adapter-react";
import { useSetAtom } from "jotai";


export const useSolanaWallets = () => {
  const { wallets: solanaWallets } = useWallet();
  const setSvmWallet = useSetAtom(svmWalletAtom);
  const createSolanaWallets = () => {
    const wallets: MinimalWallet[] = [];

    for (const wallet of solanaWallets) {
      const minimalWallet: MinimalWallet = {
        walletName: wallet.adapter.name,
        walletPrettyName: wallet.adapter.name,
        walletChainType: "svm",
        walletInfo: {
          logo: wallet.adapter.icon,
        },
        connect: async () => {
          try {
            await wallet.adapter.connect();
            setSvmWallet({ walletName: wallet.adapter.name, chainType: "svm" });
            // TODO: onWalletConnected
          } catch (error) {
            console.error(error);
          }
        },
        getAddress: async ({ signRequired }) => {
          try {
            const isConnected = wallet.adapter.connected;
            if (!isConnected) {
              await wallet.adapter.connect();
              setSvmWallet({ walletName: wallet.adapter.name, chainType: "svm" });
            }
            const address = wallet.adapter.publicKey;
            if (!address) throw new Error("No address found");
            if (signRequired) {
              setSvmWallet({ walletName: wallet.adapter.name, chainType: "svm" });
            }
            return address.toBase58();
          } catch (error) {
            console.error(error);
          }
        },
        disconnect: async () => {
          await wallet.adapter.disconnect();
          setSvmWallet(undefined);
          // TODO: onWalletDisconnected
        },
        isWalletConnected: wallet.adapter.connected,
        isAvailable: wallet.readyState === "Installed",
      };
      wallets.push(minimalWallet);
    }
  }
  return createSolanaWallets
};
