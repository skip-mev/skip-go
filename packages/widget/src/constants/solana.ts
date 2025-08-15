import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { LedgerWalletAdapter } from "@solana/wallet-adapter-ledger";

export const solanaWallets = [new LedgerWalletAdapter()];

export const addWalletConnectWalletAdapter = async () => {
  const { WalletConnectWalletAdapter } = await import("@walletconnect/solana-adapter");
  if (!solanaWallets.some((wallet) => wallet.name === "WalletConnect")) {
    solanaWallets.push(
      new WalletConnectWalletAdapter({
        network: WalletAdapterNetwork.Mainnet,
        options: {
          projectId: "ff1b9e9bd6329cfb07642bd7f4d11a8c",
        },
      })
    );
  }
};
