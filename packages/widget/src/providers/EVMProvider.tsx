import { createWagmiConfig } from "@/constants/wagmi";
import { walletConnectAtom } from "@/state/wallets";
import { useAtomValue } from "jotai";
import React from "react";
import { Config, WagmiProvider } from "wagmi";

type EVMProviderProps = {
  children: React.ReactNode;
  wagmiConfig?: Config;
}

export const EVMProvider: React.FC<EVMProviderProps> = ({
  children,
  wagmiConfig,
}) => {
  const { options, walletConnectModal } = useAtomValue(walletConnectAtom);
  const config = createWagmiConfig({
    options,
    walletConnectModal,
  });
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
