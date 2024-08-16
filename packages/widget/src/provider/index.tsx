import React from 'react';
import { CosmosProvider } from './wallet/cosmos';
import { EVMProvider } from './wallet/evm';
import { SolanaProvider } from './wallet/solana';
import { SkipProvider } from './skip-provider';
import { AssetsProvider } from './assets';
import { ChainAffiliates, SkipClientOptions } from '@skip-go/client';
import { WalletModalProvider } from '../ui/WalletModal';
import { DefaultRouteConfig } from '../hooks/use-swap-widget';
import { RouteConfig } from '../hooks/use-route';
import {
  endpointOptions as defaultEndpointOptions,
  apiURL as defaultApiURL,
} from '../constants/defaults';
import { MinimalWallet } from '../hooks/use-make-wallets';
import { Config } from 'wagmi';

interface WalletProviderProps {
  wagmiConfig?: Config;
  children: React.ReactNode;
}

export interface WidgetConfig {
  defaultRoute?: DefaultRouteConfig;
  routeConfig?: RouteConfig;
}
export interface SwapWidgetProviderProps extends SkipAPIProviderProps {
  wagmiConfig?: Config;
  children: React.ReactNode;
}
export interface SkipAPIProviderProps {
  children: React.ReactNode;
  endpointOptions?: SkipClientOptions['endpointOptions'];
  apiURL?: string;
  makeDestinationWallets?: (chainID: string) => MinimalWallet[];
  chainIDsToAffiliates?: Record<string, ChainAffiliates>;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({
  children,
  wagmiConfig,
}) => {
  return (
    <SolanaProvider>
      <CosmosProvider>
        <EVMProvider wagmiConfig={wagmiConfig}>
          <WalletModalProvider>{children}</WalletModalProvider>
        </EVMProvider>
      </CosmosProvider>
    </SolanaProvider>
  );
};

export const SkipAPIProvider: React.FC<SkipAPIProviderProps> = ({
  children,
  endpointOptions = defaultEndpointOptions,
  apiURL = defaultApiURL,
  makeDestinationWallets,
  chainIDsToAffiliates,
}) => {
  return (
    <SkipProvider
      apiURL={apiURL}
      endpointOptions={endpointOptions}
      makeDestinationWallets={makeDestinationWallets}
      chainIDsToAffiliates={chainIDsToAffiliates}
    >
      <AssetsProvider>{children}</AssetsProvider>
    </SkipProvider>
  );
};

export const SwapWidgetProvider: React.FC<SwapWidgetProviderProps> = ({
  children,
  wagmiConfig,
  ...skipApiProviderProps
}) => {
  return (
    <WalletProvider wagmiConfig={wagmiConfig}>
      <SkipAPIProvider {...skipApiProviderProps}>{children}</SkipAPIProvider>
    </WalletProvider>
  );
};
