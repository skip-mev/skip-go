import { ReactNode } from "react"
import { CosmosProvider } from "./CosmosProvider"
import { EVMProvider } from "./EVMProvider"
import { SolanaProvider } from "./SolanaProvider"

export const WalletProviders = (
  { children }: { children: ReactNode }
) => {
  return (
    <SolanaProvider>
      <CosmosProvider>
        <EVMProvider>
          {children}
        </EVMProvider>
      </CosmosProvider>
    </SolanaProvider>
  )
}
