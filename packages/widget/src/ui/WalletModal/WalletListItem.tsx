import {
  useWallet,
  useWalletClient as useCosmosWalletClient,
} from '@cosmos-kit/react';
import { ComponentProps, useEffect, useMemo } from 'react';
import { create } from 'zustand';
import { MergedWalletClient } from '../../lib/cosmos-kit';
import { isMobile } from '../../utils/os';

const useStore = create<Record<string, true>>(() => ({}));

export function useTotalWallets() {
  return useStore((state) => Object.keys(state).length);
}

type Props = ComponentProps<'div'> & {
  chainType: string;
  walletName: string;
};

export const WalletListItem = ({
  children,
  chainType,
  walletName,
  ...props
}: Props) => {
  const Component = useMemo(() => {
    if (walletName === 'prax') return PenumbraWalletListItem;
    return chainType === 'cosmos' ? CosmosWalletListItem : EvmWalletListItem;
  }, [chainType]);
  return (
    <Component walletName={walletName} {...props}>
      {children}
    </Component>
  );
};

const CosmosWalletListItem = ({
  children,
  walletName,
  ...props
}: ComponentProps<'div'> & {
  walletName: string;
}) => {
  const { client } = useCosmosWalletClient(walletName);
  const { wallet } = useWallet(walletName);

  const walletClient = client as MergedWalletClient | undefined;
  const isWalletConnect = wallet?.mode === 'wallet-connect';
  const _isMobile = isMobile();

  const show = useMemo(() => {
    if (!walletClient) return false;
    if ('snapInstalled' in walletClient) {
      return walletClient.snapInstalled;
    }
    if (wallet?.prettyName.toLowerCase() === 'outer wallet') {
      return false;
    }
    if (_isMobile) {
      return isWalletConnect || walletClient;
    }
    if (!_isMobile) {
      return !isWalletConnect;
    }
    return true;
  }, [_isMobile, isWalletConnect, wallet?.prettyName, walletClient]);

  useEffect(() => {
    const unregister = () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      useStore.setState(({ [walletName]: _, ...latest }) => latest, true);
    };
    if (show) useStore.setState({ [walletName]: true });
    else unregister();
    return unregister;
  }, [show, walletName]);

  return <div {...props}>{show ? children : null}</div>;
};

const EvmWalletListItem = ({
  children,
  walletName,
  ...props
}: ComponentProps<'div'> & {
  walletName: string;
}) => {
  useEffect(() => {
    useStore.setState({ [walletName]: true });
  }, [walletName]);

  return <div {...props}>{children}</div>;
};

const PenumbraWalletListItem = ({
  children,
  walletName,
  ...props
}: ComponentProps<'div'> & {
  walletName: string;
}) => {
  return <div {...props}>{children}</div>;
};
