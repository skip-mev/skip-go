import { WalletProvider } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";

import { addWalletConnectWalletAdapter, solanaWallets } from "@/constants/solana";

export const SolanaProvider = ({ children }: { children: React.ReactNode }) => {
  const query = useQuery({
    queryKey: ["solanaWallets"],
    queryFn: async () => {
      await addWalletConnectWalletAdapter();
      return [...solanaWallets];
    },
    initialData: solanaWallets,
    staleTime: Infinity,
    enabled: typeof window !== "undefined",
  });

  return (
    <WalletProvider
      wallets={query.data ?? solanaWallets}
      autoConnect={true}
      localStorageKey="skip-go-widget-solana-wallet"
    >
      {children}
    </WalletProvider>
  );
};
