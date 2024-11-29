import { getCosmosWalletInfo } from '@/constants/graz';
import { solanaWallets } from '@/constants/solana';
import { skipChainsAtom } from '@/state/skipClient';
import {
  cosmosWalletAtom,
  evmWalletAtom,
  svmWalletAtom,
  walletsAtom,
} from '@/state/wallets';
import { useAccount as useCosmosAccount, WalletType } from 'graz';
import { useAtom, useAtomValue } from 'jotai';
import { useCallback, useEffect } from 'react';
import { useAccount as useEvmAccount, useConnectors } from 'wagmi';

export const useGetAccount = () => {
  const wallet = useAtomValue(walletsAtom);
  const [evmWallet, setEvmWallet] = useAtom(evmWalletAtom);
  const [cosmosWallet, setCosmosWallet] = useAtom(cosmosWalletAtom);
  const [svmWallet, setSvmWallet] = useAtom(svmWalletAtom);
  const { data: chains } = useAtomValue(skipChainsAtom);

  const { data: cosmosAccounts, walletType } = useCosmosAccount({
    multiChain: true,
  });

  const solanaWallet = solanaWallets.find(
    (w) => w.name === wallet.svm?.walletName
  );

  const evmAccount = useEvmAccount();
  const connectors = useConnectors();

  useEffect(() => {
    if (walletType && cosmosWallet === undefined) {
      setCosmosWallet({
        walletName: walletType,
        chainType: 'cosmos',
      });
    }
    if (solanaWallet && svmWallet === undefined) {
      setSvmWallet({
        walletName: solanaWallet.name,
        chainType: 'svm',
      });
    }
    if (evmAccount.connector && evmWallet === undefined) {
      setEvmWallet({
        walletName: evmAccount.connector.id,
        chainType: 'evm',
      });
    }
  }, [
    walletType,
    cosmosWallet,
    solanaWallet,
    svmWallet,
    evmAccount.connector,
    evmWallet,
    setCosmosWallet,
    setSvmWallet,
    setEvmWallet,
  ]);

  const getAccount = useCallback(
    // if checkChainType is true, it only check wallet connected no chainId is dependent
    (chainId?: string, checkChainType?: boolean) => {
      const chainType = chains?.find((c) => c.chainID === chainId)?.chainType;
      switch (chainType) {
        case 'cosmos':
          if (walletType && cosmosWallet === undefined) {
            setCosmosWallet({
              walletName: walletType,
              chainType: 'cosmos',
            });
          }
          break;
        case 'svm':
          if (solanaWallet && svmWallet === undefined) {
            setSvmWallet({
              walletName: solanaWallet.name,
              chainType: 'svm',
            });
          }
          break;
        case 'evm':
          if (evmAccount.connector && evmWallet === undefined) {
            setEvmWallet({
              walletName: evmAccount.connector.id,
              chainType: 'evm',
            });
          }
          break;
        default:
          break;
      }

      const getCosmosAccount = () => {
        if (!cosmosAccounts || !chainId) return;
        return cosmosAccounts[chainId];
      };
      const cosmosAccount = getCosmosAccount();

      switch (chainType) {
        case 'cosmos': {
          if (!cosmosAccount) return;
          if (!wallet.cosmos) return;
          const walletInfo = getCosmosWalletInfo(
            wallet.cosmos.walletName as WalletType
          );

          return {
            address: cosmosAccount.bech32Address,
            chainType,
            wallet: {
              name: wallet.cosmos.walletName,
              prettyName: walletInfo.name,
              logo: walletInfo.imgSrc,
              isLedger: cosmosAccount.isNanoLedger,
            },
          };
        }
        case 'evm':
          if (!wallet.evm) return;
          if (evmAccount.chainId !== Number(chainId) && !checkChainType) return;
          if (!evmAccount.address) return;
          if (!evmAccount.connector) return;
          return {
            address: evmAccount.address as string,
            currentConnectedEVMChainId: String(evmAccount.chainId),
            chainType,
            wallet: {
              name: evmAccount.connector.id,
              prettyName: evmAccount.connector.name,
              logo: connectors.find(
                (item) => item.id === evmAccount.connector?.id
              )?.icon,
            },
          };
        case 'svm': {
          if (!wallet.svm) return;
          if (!solanaWallet?.publicKey) return;
          return {
            address: solanaWallet.publicKey.toBase58(),
            chainType,
            wallet: {
              name: solanaWallet.name as string,
              prettyName: solanaWallet.name as string,
              logo: solanaWallet.icon,
            },
          };
        }
        default:
          return undefined;
      }
    },
    [
      chains,
      walletType,
      cosmosWallet,
      solanaWallet,
      svmWallet,
      evmAccount.connector,
      evmAccount.chainId,
      evmAccount.address,
      evmWallet,
      setCosmosWallet,
      setSvmWallet,
      setEvmWallet,
      cosmosAccounts,
      wallet.evm,
      wallet.cosmos,
      wallet.svm,
      connectors,
    ]
  );

  return getAccount;
};
