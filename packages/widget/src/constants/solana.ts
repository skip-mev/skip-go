import { BackpackWalletAdapter } from "@solana/wallet-adapter-backpack";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { CoinbaseWalletAdapter } from "@solana/wallet-adapter-coinbase";
import { LedgerWalletAdapter } from "@solana/wallet-adapter-ledger";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
import { TrustWalletAdapter } from "@solana/wallet-adapter-trust";
import { WalletConnectWalletAdapter } from '@walletconnect/solana-adapter'

export const solanaWallets = [
  new PhantomWalletAdapter(),
  new BackpackWalletAdapter(),
  new SolflareWalletAdapter(),
  new CoinbaseWalletAdapter(),
  new TrustWalletAdapter(),
  new LedgerWalletAdapter(),
  new WalletConnectWalletAdapter({
    network: WalletAdapterNetwork.Mainnet,
    options: {
      projectId: "ff1b9e9bd6329cfb07642bd7f4d11a8c",
    },
  }),
];
