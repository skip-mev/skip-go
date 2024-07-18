import { ChainProvider } from '@cosmos-kit/react';
import React, { ComponentProps } from 'react';

import { getAssetLists, getChains } from '../../chains';
import { wallets } from '../../lib/cosmos-kit';
interface CosmosProviderProps {
  children: React.ReactNode;
}

type ChainProviderProps = ComponentProps<typeof ChainProvider>;

export const CosmosProvider: React.FC<CosmosProviderProps> = ({ children }) => {
  const chains = getChains() as ChainProviderProps['chains'];
  const assets = getAssetLists() as ChainProviderProps['assetLists'];
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
