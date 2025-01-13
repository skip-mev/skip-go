import { getCosmosWalletInfo } from "@/constants/graz";
import { solanaWallets } from "@/constants/solana";
import { skipChainsAtom } from "@/state/skipClient";
import {
  cosmosWalletAtom,
  evmWalletAtom,
  svmWalletAtom,
  walletsAtom,
  connectedAddressesAtom,
} from "@/state/wallets";
import { useAccount as useCosmosAccount, WalletType } from "graz";
import { useAtom, useAtomValue } from "jotai";
import { useCallback, useEffect } from "react";
import { useAccount as useEvmAccount, useConnectors } from "wagmi";
import { ChainType } from "@skip-go/client";
import { walletConnectLogo } from "@/constants/wagmi";

export const useGetAccount = () => {
  const wallet = useAtomValue(walletsAtom);
  const [evmWallet, setEvmWallet] = useAtom(evmWalletAtom);
  const [cosmosWallet, setCosmosWallet] = useAtom(cosmosWalletAtom);
  const [svmWallet, setSvmWallet] = useAtom(svmWalletAtom);
  const connectedAddress = useAtomValue(connectedAddressesAtom);
  const { data: chains } = useAtomValue(skipChainsAtom);

  const { data: cosmosAccounts, walletType } = useCosmosAccount({
    multiChain: true,
  });

  const solanaWallet = solanaWallets.find((w) => w.name === wallet.svm?.walletName);

  const evmAccount = useEvmAccount();
  const connectors = useConnectors();

  useEffect(() => {
    if (walletType && cosmosWallet === undefined) {
      setCosmosWallet({
        walletName: walletType,
        chainType: ChainType.Cosmos,
      });
    }
    if (solanaWallet && svmWallet === undefined) {
      setSvmWallet({
        walletName: solanaWallet.name,
        chainType: ChainType.SVM,
      });
    }
    if (evmAccount.connector && evmWallet === undefined) {
      setEvmWallet({
        walletName: evmAccount.connector.id,
        chainType: ChainType.EVM,
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
      if (!chainId) return;
      const chainType = chains?.find((c) => c.chainID === chainId)?.chainType;
      if (connectedAddress && connectedAddress[chainId]) {
        return {
          address: connectedAddress[chainId],
          chainType: chainType,
          wallet: {
            name: "injected",
            prettyName: "injected",
          },
        };
      }
      switch (chainType) {
        case ChainType.Cosmos:
          if (walletType && cosmosWallet === undefined) {
            setCosmosWallet({
              walletName: walletType,
              chainType: ChainType.Cosmos,
            });
          }
          break;
        case ChainType.SVM:
          if (solanaWallet && svmWallet === undefined) {
            setSvmWallet({
              walletName: solanaWallet.name,
              chainType: ChainType.SVM,
            });
          }
          break;
        case ChainType.EVM:
          if (evmAccount.connector && evmWallet === undefined) {
            setEvmWallet({
              walletName: evmAccount.connector.id,
              chainType: ChainType.EVM,
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
        case ChainType.Cosmos: {
          if (!cosmosAccount) return;
          if (!wallet.cosmos) return;
          const walletInfo = getCosmosWalletInfo(wallet.cosmos.walletName as WalletType);

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
        case ChainType.EVM:
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
              logo:
                evmAccount.connector.id === "walletConnect"
                  ? walletConnectLogo
                  : connectors.find((item) => item.id === evmAccount.connector?.id)?.icon,
            },
          };
        case ChainType.SVM: {
          if (!wallet.svm) return;
          if (!solanaWallet?.publicKey) return;
          return {
            address: solanaWallet.publicKey.toBase58(),
            chainType,
            wallet: {
              name: solanaWallet.name as string,
              prettyName: solanaWallet.name as string,
              logo: solanaWallet.name === "WalletConnect" ? walletConnectLogo : solanaWallet.icon,
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
      connectedAddress,
    ],
  );

  return getAccount;
};
