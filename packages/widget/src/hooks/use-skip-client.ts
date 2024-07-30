import { useContext } from 'react';
import { SkipContext } from '../provider/skip-provider';

export function useSkipClient() {
  const context = useContext(SkipContext);

  if (context === undefined) {
    throw new Error('useSkipClient must be used within a SkipProvider');
  }

  return context.skipClient;
}

export function useSkipConfig() {
  const context = useContext(SkipContext);

  if (context === undefined) {
    throw new Error('useSkipConfig  must be used within a SkipProvider');
  }

  return {
    apiURL: context.apiURL,
    endpointOptions: context.endpointOptions,
    makeDestinationWallets: context.makeDestinationWallets,
  };
}
