import { solanaWallets } from "@/constants/solana";
import React, { useMemo } from "react";
import { WalletProvider } from "@solana/wallet-adapter-react";

type SolanaProviderProps = {
  children: React.ReactNode;
};

export const SolanaProvider = ({ children }: SolanaProviderProps) => {
  const wallets = useMemo(() => solanaWallets, []);

  return <WalletProvider wallets={wallets}>{children}</WalletProvider>;
};
