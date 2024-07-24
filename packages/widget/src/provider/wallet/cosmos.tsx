import { ChainProvider } from '@cosmos-kit/react';
import React from 'react';

import { wallets } from '../../lib/cosmos-kit';
import { assets, chains } from '../../chains';
interface CosmosProviderProps {
  children: React.ReactNode;
}

export const CosmosProvider: React.FC<CosmosProviderProps> = ({ children }) => {
  return (
    <ChainProvider
      chains={chains}
      wallets={wallets}
      throwErrors={false}
      assetLists={assets}
      disableIframe={false}
      sessionOptions={{
        duration: 1000 * 60 * 60 * 24, // 1 day
      }}
      key={'skip-widget-chain-provider'}
    >
      {children}
    </ChainProvider>
  );
};
