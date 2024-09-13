import {
  CoinbaseWalletAdapter,
  LedgerWalletAdapter,
  SolflareWalletAdapter,
  TrustWalletAdapter,
} from "@solana/wallet-adapter-wallets";

export const solanaWallets = [
  new SolflareWalletAdapter(),
  new CoinbaseWalletAdapter(),
  new TrustWalletAdapter(),
  new LedgerWalletAdapter(),
];
