import { skipChainsAtom } from '@/state/skipClient';
import {
  ChainAddress,
  chainAddressEffectAtom,
  chainAddressesAtom,
  swapExecutionStateAtom,
} from '@/state/swapExecutionPage';
import { walletsAtom } from '@/state/wallets';
import { useQuery } from '@tanstack/react-query';
import { useAtom, useAtomValue } from 'jotai';
import { useCreateCosmosWallets } from './useCreateCosmosWallets';
import { useCreateEvmWallets } from './useCreateEvmWallets';
import { useCreateSolanaWallets } from './useCreateSolanaWallets';
import { useCallback, useEffect, useMemo } from 'react';
import { getClientOperations } from '@/utils/clientType';
import NiceModal from '@ebay/nice-modal-react';
import { Modals } from '@/modals/registerModals';

export const useAutoSetAddress = () => {
  const [chainAddresses, setChainAddresses] = useAtom(chainAddressesAtom);
  const { route } = useAtomValue(swapExecutionStateAtom);
  const requiredChainAddresses = route?.requiredChainAddresses;

  const { data: chains } = useAtomValue(skipChainsAtom);
  const sourceWallet = useAtomValue(walletsAtom);

  useAtom(chainAddressEffectAtom);

  const { createCosmosWallets } = useCreateCosmosWallets();
  const { createEvmWallets } = useCreateEvmWallets();
  const { createSolanaWallets } = useCreateSolanaWallets();

  const signRequiredChains = useMemo(() => {
    if (!route?.operations) return;
    const operations = getClientOperations(route.operations);
    const signRequiredChains = operations
      .filter((o) => o.signRequired)
      .map((o) => o.fromChainID);
    return signRequiredChains;
  }, [route?.operations]);

  useEffect(() => {
    const res: Record<number, ChainAddress> = {};
    if (!route?.operations) return;
    route?.requiredChainAddresses?.forEach((chainID, index) => {
      res[index] = {
        chainID,
      };
    });
    setChainAddresses(res);
    //  we only want to run this once for preserve the chainAddresses chainID
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connectRequiredChains = useCallback(
    async (openModal?: boolean) => {
      if (!requiredChainAddresses) return;
      requiredChainAddresses.forEach(async (chainID, index) => {
        const chain = chains?.find((c) => c.chainID === chainID);
        if (!chain) {
          return;
        }
        const isSignRequired = signRequiredChains?.includes(chainID);
        const chainType = chain.chainType;
        switch (chainType) {
          case 'cosmos': {
            const wallets = createCosmosWallets(chainID);
            const wallet = wallets.find(
              (w) => w.walletName === sourceWallet.cosmos?.walletName
            );
            if (!wallet) {
              if (!openModal) return;
              if (chainAddresses[index].address) return;
              NiceModal.show(Modals.SetAddressModal, {
                signRequired: isSignRequired,
                chainId: chainID,
                chainAddressIndex: index,
              });
              return;
            }
            try {
              if (chainAddresses[index].address) return;
              const address = await wallet?.getAddress?.({
                signRequired: isSignRequired,
              });
              if (!address) {
                return;
              }
              setChainAddresses((prev) => ({
                ...prev,
                [index]: {
                  chainID,
                  address,
                  chainType: 'cosmos',
                  source: 'wallet',
                  wallet: {
                    walletName: wallet?.walletName,
                    walletPrettyName: wallet?.walletPrettyName,
                    walletChainType: wallet?.walletChainType,
                    walletInfo: wallet?.walletInfo,
                  },
                },
              }));
            } catch (_) {
              return;
            }
            break;
          }
          case 'svm': {
            const wallets = createSolanaWallets();
            const wallet = wallets.find(
              (w) => w.walletName === sourceWallet.svm?.walletName
            );
            if (!wallet) {
              if (!openModal) return;
              NiceModal.show(Modals.SetAddressModal, {
                signRequired: isSignRequired,
                chainId: chainID,
              });
              return;
            }
            try {
              const address = await wallet?.getAddress?.({
                signRequired: isSignRequired,
              });
              if (!address) {
                return;
              }
              setChainAddresses((prev) => ({
                ...prev,
                [index]: {
                  chainID,
                  address,
                  chainType: 'svm',
                  source: 'wallet',
                  wallet: {
                    walletName: wallet?.walletName,
                    walletPrettyName: wallet?.walletPrettyName,
                    walletChainType: wallet?.walletChainType,
                    walletInfo: wallet?.walletInfo,
                  },
                },
              }));
            } catch (_) {
              return;
            }

            break;
          }
          case 'evm': {
            const wallets = createEvmWallets(chainID);
            const wallet = wallets.find(
              (w) => w.walletName === sourceWallet.evm?.walletName
            );
            if (!wallet) {
              if (!openModal) return;
              NiceModal.show(Modals.SetAddressModal, {
                signRequired: isSignRequired,
                chainId: chainID,
              });
              return;
            }
            try {
              const address = await wallet?.getAddress?.({
                signRequired: isSignRequired,
              });
              if (!address) {
                return;
              }
              setChainAddresses((prev) => ({
                ...prev,
                [index]: {
                  chainID,
                  address,
                  chainType: 'evm',
                  source: 'wallet',
                  wallet: {
                    walletName: wallet?.walletName,
                    walletPrettyName: wallet?.walletPrettyName,
                    walletChainType: wallet?.walletChainType,
                    walletInfo: wallet?.walletInfo,
                  },
                },
              }));
            } catch (_) {
              return;
            }
            break;
          }
          default:
            break;
        }
      });
    },
    [
      chains,
      createCosmosWallets,
      createEvmWallets,
      createSolanaWallets,
      requiredChainAddresses,
      setChainAddresses,
      sourceWallet.cosmos,
      sourceWallet.evm,
      sourceWallet.svm,
      signRequiredChains,
      chainAddresses
    ]
  );

  useQuery({
    queryKey: [
      'auto-set-address',
      { requiredChainAddresses, chains, sourceWallet, signRequiredChains },
    ],
    enabled:
      !!requiredChainAddresses &&
      !!chains &&
      (!!sourceWallet.cosmos || !!sourceWallet.evm || !!sourceWallet.svm),
    queryFn: async () => {
      if (!requiredChainAddresses) return;
      await connectRequiredChains();
      return null;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return { connectRequiredChains };
};
