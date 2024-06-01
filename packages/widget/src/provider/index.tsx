import React from 'react';
import { CosmosProvider } from './cosmos';
import { EVMProvider } from './evm';
import { SolanaProvider } from './solana';
import { SkipProvider } from './skip-provider';
import { AssetsProvider } from './assets';

interface WalletProviderProps {
  children: React.ReactNode;
}
interface SkipProviderProps {
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

export const SkipAPIProvider: React.FC<SkipProviderProps> = ({ children }) => {
  return (
    <SkipProvider>
      <AssetsProvider>{children}</AssetsProvider>
    </SkipProvider>
  );
};

export const WidgetProvider: React.FC<SkipProviderProps> = ({ children }) => {
  return (
    <WalletProvider>
      <SkipAPIProvider>{children}</SkipAPIProvider>
    </WalletProvider>
  );
};
