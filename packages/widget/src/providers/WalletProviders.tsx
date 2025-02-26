import { ReactNode } from "react";
import { CosmosProvider } from "./CosmosProvider";
import { EVMProvider } from "./EVMProvider";
import { SolanaProvider } from "./SolanaProvider";

export const WalletProviders = ({ children }: { children: ReactNode }) => {
  return (
    <CosmosProvider>
      <SolanaProvider>
        <EVMProvider>{children}</EVMProvider>
      </SolanaProvider>
    </CosmosProvider>
  );
};
