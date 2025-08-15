import { WalletProvider } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";

import { solanaWallets } from "@/constants/solana";
import { WalletAdapter, WalletAdapterNetwork } from "@solana/wallet-adapter-base";

export const SolanaProvider = ({ children }: { children: React.ReactNode }) => {
  const query = useQuery({
    queryKey: ["solanaWallets"],
    queryFn: async () => {
      const wallets: WalletAdapter[] = [...solanaWallets];
      // Ensure the WalletConnect wallet adapter is added only once
      const { WalletConnectWalletAdapter } = await import("@walletconnect/solana-adapter");
      if (!wallets.some((wallet) => wallet.name === "WalletConnect")) {
        wallets.push(
          new WalletConnectWalletAdapter({
            network: WalletAdapterNetwork.Mainnet,
            options: {
              projectId: "ff1b9e9bd6329cfb07642bd7f4d11a8c",
            },
          }),
        );
      }
      return wallets;
    },
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
