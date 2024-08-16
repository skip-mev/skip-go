import React from 'react';
import { Config, WagmiProvider } from 'wagmi';

import { config } from '../../lib/wagmi';
import { queryClient } from '../../lib/react-query';
import { QueryClientProvider } from '@tanstack/react-query';

interface EVMProviderProps {
  children: React.ReactNode;
  wagmiConfig?: Config;
}

export const EVMProvider: React.FC<EVMProviderProps> = ({
  children,
  wagmiConfig,
}) => {
  return (
    <WagmiProvider
      key={'skip-widget-wagmi-provider'}
      config={!!wagmiConfig ? wagmiConfig : config}
      reconnectOnMount={true}
    >
      <QueryClientProvider client={queryClient} key={'skip-widget'}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
};
