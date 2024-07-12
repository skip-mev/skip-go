const {
  CoinbaseWalletAdapter,
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TrustWalletAdapter,
} = await import('@solana/wallet-adapter-wallets');

export const solanaWallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
  new CoinbaseWalletAdapter(),
  new TrustWalletAdapter(),
  new LedgerWalletAdapter(),
];
