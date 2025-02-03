import { config } from "@/constants/wagmi";
import React from "react";
import { Config, WagmiProvider } from "wagmi";

type EVMProviderProps = {
  children: React.ReactNode;
  wagmiConfig?: Config;
};

export const EVMProvider: React.FC<EVMProviderProps> = ({ children, wagmiConfig }) => {
  return (
    <WagmiProvider
      key={"skip-widget-wagmi-provider"}
      config={wagmiConfig ? wagmiConfig : config}
      reconnectOnMount={true}
    >
      {children}
    </WagmiProvider>
  );
};
