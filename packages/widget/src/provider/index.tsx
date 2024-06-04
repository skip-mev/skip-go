import React from 'react';
import { CosmosProvider } from './wallet/cosmos';
import { EVMProvider } from './wallet/evm';
import { SolanaProvider } from './wallet/solana';
import { SkipProvider } from './skip-provider';
import { AssetsProvider } from './assets';
import { SkipRouterOptions } from '@skip-router/core';

interface WalletProviderProps {
  children: React.ReactNode;
}
interface WidgetProviderProps extends SkipAPIProviderProps {
  children: React.ReactNode;
}
interface SkipAPIProviderProps {
  children: React.ReactNode;
  endpointOptions?: SkipRouterOptions['endpointOptions'];
  apiURL?: string;
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
  endpointOptions,
  apiURL,
}) => {
  return (
    <SkipProvider apiURL={apiURL} endpointOptions={endpointOptions}>
      <AssetsProvider>{children}</AssetsProvider>
    </SkipProvider>
  );
};

export const WidgetProvider: React.FC<WidgetProviderProps> = ({
  children,
  ...props
}) => {
  return (
    <WalletProvider>
      <SkipAPIProvider {...props}>{children}</SkipAPIProvider>
    </WalletProvider>
  );
};
