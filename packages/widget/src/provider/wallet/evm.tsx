import React from 'react';
import { WagmiProvider } from 'wagmi';

import { config } from '../../lib/wagmi';
import { queryClient } from '../../lib/react-query';
import { QueryClientProvider } from '@tanstack/react-query';

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
      <QueryClientProvider client={queryClient} key={'skip-widget'}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
};
