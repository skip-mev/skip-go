import { ReactNode } from "react";
import { CosmosProvider } from "./CosmosProvider";
import { EVMProvider } from "./EVMProvider";

export const WalletProviders = (
  { children }: { children: ReactNode }
) => {
  return (
    <EVMProvider>
      <CosmosProvider>
        {children}
      </CosmosProvider>
    </EVMProvider>
  );
};
