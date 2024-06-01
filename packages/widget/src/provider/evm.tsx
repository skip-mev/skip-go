import React from 'react';
import { WagmiProvider } from 'wagmi';

import { config } from '../lib/wagmi';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { persister, queryClient } from '../lib/react-query';

interface EVMProviderProps {
  children: React.ReactNode;
}

export const EVMProvider: React.FC<EVMProviderProps> = ({ children }) => {
  return (
    <WagmiProvider
      key={'skip-widget-wagmi-provider'}
      config={config}
      reconnectOnMount={true}
    >
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister,
        }}
        key={'skip-widget'}
      >
        {children}
      </PersistQueryClientProvider>
    </WagmiProvider>
  );
};
