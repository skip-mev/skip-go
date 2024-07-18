import React from 'react';
import { CosmosProvider } from './wallet/cosmos';
import { EVMProvider } from './wallet/evm';
import { SolanaProvider } from './wallet/solana';
import { SkipProvider } from './skip-provider';
import { AssetsProvider } from './assets';
import { SkipRouterOptions } from '@skip-go/core';
import { WalletModalProvider } from '../ui/WalletModal';
import { Toaster, ToasterProps } from 'react-hot-toast';
import { DefaultRouteConfig } from '../hooks/use-swap-widget';
import { RouteConfig } from '../hooks/use-route';
import {
  endpointOptions as defaultEndpointOptions,
  apiURL as defaultApiURL,
} from '../constants/defaults';
import { useTheme } from 'styled-components';

interface WalletProviderProps {
  children: React.ReactNode;
}

export interface WidgetConfig {
  defaultRoute?: DefaultRouteConfig;
  routeConfig?: RouteConfig;
}
export interface SwapWidgetProviderProps extends SkipAPIProviderProps {
  children: React.ReactNode;
}
export interface SkipAPIProviderProps {
  children: React.ReactNode;
  endpointOptions?: SkipRouterOptions['endpointOptions'];
  apiURL?: string;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  return (
    <SolanaProvider>
      <CosmosProvider>
        <EVMProvider>
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
}) => {
  return (
    <SkipProvider apiURL={apiURL} endpointOptions={endpointOptions}>
      <AssetsProvider>{children}</AssetsProvider>
    </SkipProvider>
  );
};

export const SwapWidgetProvider: React.FC<SwapWidgetProviderProps> = ({
  children,
  ...skipApiProviderProps
}) => {
  return (
    <WalletProvider>
      <SkipAPIProvider {...skipApiProviderProps}>{children}</SkipAPIProvider>
    </WalletProvider>
  );
};
