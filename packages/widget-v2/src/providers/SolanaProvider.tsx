import { solanaWallets } from "@/constants/solana";
import { WalletProvider } from "@solana/wallet-adapter-react";

type SolanaProviderProps = {
  children: React.ReactNode;
}

export const SolanaProvider: React.FC<SolanaProviderProps> = ({ children }) => {
  return (
    <WalletProvider
      wallets={solanaWallets}
      localStorageKey="skip-go-solana-wallet"
      autoConnect
      key="skip-go-solana-wallet"
    >
      {children}
    </WalletProvider>
  );
};
