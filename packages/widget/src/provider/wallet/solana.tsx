import { WalletProvider } from '@solana/wallet-adapter-react';
import { solanaWallets } from '../../lib/solana-adapter';

interface SolanaProviderProps {
  children: React.ReactNode;
}

export const SolanaProvider: React.FC<SolanaProviderProps> = ({ children }) => {
  return (
    <WalletProvider
      wallets={solanaWallets}
      localStorageKey="ibc-fun-solana-wallet"
      autoConnect
      key="skip-widget-solana-wallet"
    >
      {children}
    </WalletProvider>
  );
};
