import { Chain } from '@skip-go/client';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import {
  ChainAddresses,
  SetChainAddressesParam,
} from '../ui/PreviewRoute/types';
import {
  trackWallet,
  TrackWalletCtx,
  useTrackWallet,
} from '../store/track-wallet';
import { useMakeWallets } from './use-make-wallets';
import { useSkipConfig } from './use-skip-client';

export const useAutoSetAddress = ({
  chain,
  chainID,
  index,
  enabled,
  signRequired,
  chainAddresses,
  setChainAddresses,
}: {
  chain?: Chain;
  chainID: string;
  index: number;
  enabled?: boolean;
  signRequired?: boolean;
  chainAddresses: ChainAddresses;
  setChainAddresses: (v: SetChainAddressesParam) => void;
}): UseQueryResult => {
  const { connectedWallet } = useSkipConfig();
  const trackedWallets = useTrackWallet(chain?.chainType as TrackWalletCtx);
  const source = chainAddresses?.[0];
  const destination =
    chainAddresses?.[Object.values(chainAddresses).length - 1];
  const current = chainAddresses?.[index];
  const currentAcdress = current?.address;
  const isSameAsDestination =
    current?.source !== 'input' &&
    current?.source !== 'parent' &&
    destination?.source !== 'parent' &&
    destination?.source !== 'input' &&
    destination?.source?.walletName === current?.source?.walletName;
  const isSameAsSource =
    current?.source !== 'input' &&
    source?.source !== 'input' &&
    current?.source !== 'parent' &&
    source?.source !== 'parent' &&
    source?.source?.walletName === current?.source?.walletName;

  const { makeWallets } = useMakeWallets();

  return useQuery({
    queryKey: [
      'auto-set-address',
      {
        chainID,
        chainType: chain?.chainType,
        trackedWallets,
        index,
        destination,
        currentSource: current?.source,
        connectedWallet,
      },
    ],
    queryFn: async () => {
      if (current?.source === 'input' || current?.source === 'parent') {
        return null;
      }
      const wallets = makeWallets(chainID);
      const { cosmos, evm, svm } = trackWallet.get();
      if (chain?.chainType === 'cosmos') {
        // intermediary chain need to be signed and the source chain is same as the current chain
        if (
          index !== 0 &&
          signRequired &&
          source?.chainType === 'cosmos' &&
          cosmos &&
          !chain.chainID.includes('penumbra')
        ) {
          const walletSelected = wallets.find(
            (wallet) => wallet.walletName === cosmos?.walletName
          );
          const address = await walletSelected?.getAddress?.({
            signRequired,
          });
          if (walletSelected && address) {
            setChainAddresses({
              index,
              chainID,
              chainType: chain.chainType as TrackWalletCtx,
              address,
              source: walletSelected,
            });
          }
        }
        // destination chain is cosmos and the source is not input
        if (
          Boolean(destination?.address) &&
          destination?.chainType === 'cosmos' &&
          destination?.source !== 'input' &&
          destination?.source !== 'parent' &&
          index !== 0 &&
          !signRequired &&
          !chain.chainID.includes('penumbra')
        ) {
          const walletName = destination.source?.walletName;
          const walletSelected = wallets.find(
            (wallet) => wallet.walletName === walletName
          );
          const address = await walletSelected?.getAddress?.({});
          if (walletSelected && address) {
            setChainAddresses({
              index,
              chainID,
              chainType: chain.chainType as TrackWalletCtx,
              address,
              source: walletSelected,
            });
          }
        } else {
          const walletSelected = wallets.find(
            (wallet) => wallet.walletName === cosmos?.walletName
          );
          const address = await walletSelected?.getAddress?.({});
          if (walletSelected && address) {
            setChainAddresses({
              index,
              chainID,
              chainType: chain.chainType as TrackWalletCtx,
              address,
              source: walletSelected,
            });
          } else {
            if (connectedWallet?.cosmos?.getAddress) {
              const address = await connectedWallet.cosmos.getAddress(chainID);
              if (address) {
                setChainAddresses({
                  index,
                  chainID,
                  chainType: chain.chainType as TrackWalletCtx,
                  address,
                  source: 'parent',
                });
              }
            }
          }
        }
      }
      if (chain?.chainType === 'evm') {
        // intermediary chain need to be signed and the source chain is same as the current chain
        if (index !== 0 && signRequired && source?.chainType === 'evm' && evm) {
          const walletSelected = wallets.find(
            (wallet) => wallet.walletName === evm?.walletName
          );
          const address = await walletSelected?.getAddress?.({
            signRequired,
          });
          if (walletSelected && address) {
            setChainAddresses({
              index,
              chainID,
              chainType: chain.chainType as TrackWalletCtx,
              address,
              source: walletSelected,
            });
          }
        }
        // destination chain is evm and the source is not input
        if (
          Boolean(destination?.address) &&
          destination?.chainType === 'evm' &&
          destination?.source !== 'input' &&
          destination?.source !== 'parent' &&
          index !== 0
        ) {
          const walletName = destination.source?.walletName;
          const walletSelected = wallets.find(
            (wallet) => wallet.walletName === walletName
          );
          const address = await walletSelected?.getAddress?.({});
          if (walletSelected && address) {
            setChainAddresses({
              index,
              chainID,
              chainType: chain.chainType as TrackWalletCtx,
              address,
              source: walletSelected,
            });
          }
        } else {
          const walletSelected = wallets.find(
            (wallet) => wallet.walletName === evm?.walletName
          );
          const address = await walletSelected?.getAddress?.({});
          if (walletSelected && address) {
            setChainAddresses({
              index,
              chainID,
              chainType: chain.chainType as TrackWalletCtx,
              address,
              source: walletSelected,
            });
          } else {
            if (connectedWallet?.evm?.getAddress) {
              const address = await connectedWallet.evm.getAddress(chainID);
              if (address) {
                setChainAddresses({
                  index,
                  chainID,
                  chainType: chain.chainType as TrackWalletCtx,
                  address,
                  source: 'parent',
                });
              }
            }
          }
        }
      }

      if (chain?.chainType === 'svm') {
        if (
          Boolean(destination?.address) &&
          destination?.chainType === 'svm' &&
          destination?.source !== 'input' &&
          destination.source !== 'parent' &&
          index !== 0
        ) {
          const walletName = destination.source?.walletName;
          const walletSelected = wallets.find(
            (wallet) => wallet.walletName === walletName
          );
          const address = await walletSelected?.getAddress?.({});
          if (walletSelected && address) {
            setChainAddresses({
              index,
              chainID,
              chainType: chain.chainType as TrackWalletCtx,
              address,
              source: walletSelected,
            });
          }
        } else {
          const walletSelected = wallets.find(
            (wallet) => wallet.walletName === svm?.walletName
          );
          const address = await walletSelected?.getAddress?.({});
          if (walletSelected && address) {
            setChainAddresses({
              index,
              chainID,
              chainType: chain.chainType as TrackWalletCtx,
              address,
              source: walletSelected,
            });
          } else {
            if (connectedWallet?.svm?.getAddress) {
              const address = await connectedWallet.svm.getAddress(chainID);
              if (address) {
                setChainAddresses({
                  index,
                  chainID,
                  chainType: chain.chainType as TrackWalletCtx,
                  address,
                  source: 'parent',
                });
              }
            }
          }
        }
      }
      return null;
    },
    enabled:
      enabled &&
      !!chain?.chainType &&
      (!!trackedWallets || !!connectedWallet) &&
      (!currentAcdress || !isSameAsDestination || !isSameAsSource),
    retry: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
};
