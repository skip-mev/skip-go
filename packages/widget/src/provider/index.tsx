import React from 'react';
import { CosmosProvider } from './wallet/cosmos';
import { EVMProvider } from './wallet/evm';
import { SolanaProvider } from './wallet/solana';
import { SkipProvider } from './skip-provider';
import { AssetsProvider } from './assets';

interface WalletProviderProps {
  children: React.ReactNode;
}
interface WidgetProviderProps {
  children: React.ReactNode;
}
interface SkipAPIProviderProps {
  children: React.ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  return (
    <SolanaProvider>
      <CosmosProvider>
        <EVMProvider>{children}</EVMProvider>
      </CosmosProvider>
    </SolanaProvider>
  );
};

export const SkipAPIProvider: React.FC<SkipAPIProviderProps> = ({
  children,
}) => {
  return (
    <SkipProvider>
      <AssetsProvider>{children}</AssetsProvider>
    </SkipProvider>
  );
};

export const WidgetProvider: React.FC<WidgetProviderProps> = ({ children }) => {
  return (
    <WalletProvider>
      <SkipAPIProvider>{children}</SkipAPIProvider>
    </WalletProvider>
  );
};
