import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { LedgerWalletAdapter } from "@solana/wallet-adapter-ledger";
import { WalletConnectWalletAdapter } from "@walletconnect/solana-adapter";

export const solanaWallets = [
  new LedgerWalletAdapter(),
  new WalletConnectWalletAdapter({
    network: WalletAdapterNetwork.Mainnet,
    options: {
      projectId: "ff1b9e9bd6329cfb07642bd7f4d11a8c",
    },
  }),
];
