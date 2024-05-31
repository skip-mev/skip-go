import React from "react";
import { WagmiProvider } from "wagmi";

import { config } from "../lib/wagmi";

interface EVMProviderProps {
  children: React.ReactNode;
}

export const EVMProvider: React.FC<EVMProviderProps> = ({ children }) => {
  return <WagmiProvider config={config}>{children}</WagmiProvider>;
};
