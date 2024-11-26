import { ReactNode } from "react";
import { CosmosProvider } from "./CosmosProvider";
import { EVMProvider } from "./EVMProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const queryClient = new QueryClient();
export const WalletProviders = (
  { children }: { children: ReactNode }
) => {
  return (
    <CosmosProvider>
      <EVMProvider>
        <QueryClientProvider client={queryClient} key={"skip-widget"}>
          {children}
        </QueryClientProvider>
      </EVMProvider>
    </CosmosProvider>
  );
};
