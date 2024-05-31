import React from 'react';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

import { CosmosProvider } from './provider/cosmos';
import { EVMProvider } from './provider/evm';
import { queryClient, persister } from './lib/react-query';

interface ProviderProps {
  children: React.ReactNode;
}

export const Provider: React.FC<ProviderProps> = ({ children }) => {
  return (
    <CosmosProvider>
      <EVMProvider>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister }}
          key={'skip-widget'}
        >
          {children}
        </PersistQueryClientProvider>
      </EVMProvider>
    </CosmosProvider>
  );
};
