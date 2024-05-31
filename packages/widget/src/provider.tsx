import React from 'react';

import { CosmosProvider } from './provider/cosmos';
import { EVMProvider } from './provider/evm';

interface ProviderProps {
  children: React.ReactNode;
}

export const Provider: React.FC<ProviderProps> = ({ children }) => {
  return (
    <CosmosProvider>
      <EVMProvider>{children}</EVMProvider>
    </CosmosProvider>
  );
};
