import { solanaWallets } from "@/constants/solana";
import { WalletProvider } from "@solana/wallet-adapter-react";
import { SyncSolanaWalletsWithAtom } from "./SyncSolanaWalletsWithAtom";

export const SolanaProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WalletProvider
      wallets={solanaWallets}
      autoConnect={true}
      localStorageKey="skip-go-widget-solana-wallet"
    >
      <SyncSolanaWalletsWithAtom />
      {children}
    </WalletProvider>
  );
};
