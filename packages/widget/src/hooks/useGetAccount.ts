import { getCosmosWalletInfo } from "@/constants/graz";
import { skipChainsAtom } from "@/state/skipClient";
import { evmWalletAtom, svmWalletAtom, walletsAtom, connectedAddressesAtom } from "@/state/wallets";
import { useAccount as useCosmosAccount, WalletType } from "graz";
import { useAtomValue } from "jotai";
import { useCallback } from "react";
import { useAccount as useEvmAccount, useConnectors } from "wagmi";
import { walletConnectLogo } from "@/constants/wagmi";
import { ChainType } from "@skip-go/client";
import { useWallet } from "@solana/wallet-adapter-react";

export const useGetAccount = () => {
  const wallet = useAtomValue(walletsAtom);
  const evmWallet = useAtomValue(evmWalletAtom);
  const svmWallet = useAtomValue(svmWalletAtom);
  const connectedAddress = useAtomValue(connectedAddressesAtom);
  const { data: chains } = useAtomValue(skipChainsAtom);

  const { data: cosmosAccounts } = useCosmosAccount();

  const { wallets: _wallets } = useWallet();

  const solanaWallet = _wallets.map((i) => i.adapter).find((wallet) => wallet.connected === true);

  const evmAccount = useEvmAccount();
  const connectors = useConnectors();

  const getAccount = useCallback(
    // if checkChainType is true, it only check wallet connected no chainId is dependent
    (chainId?: string, checkChainType?: boolean, chainType?: string) => {
      if (!chainId) return;
      const chain = chains?.find((c) => c.chainId === chainId);
      chainType ??= chain?.chainType;
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
            address: cosmosAccount?.bech32Address,
            chainType,
            wallet: {
              name: wallet.cosmos.walletName,
              prettyName: walletInfo.name,
              logo: walletInfo.imgSrc,
              isLedger: cosmosAccount?.isNanoLedger,
            },
          };
        }
        case ChainType.Evm: {
          if (evmAccount.chainId !== Number(chainId) && !checkChainType) return;
          if (!evmAccount.address) return;
          if (!evmAccount.connector) return;

          const getLogo = () => {
            if (evmAccount?.connector?.id === "walletConnect") {
              return evmWallet?.logo ?? walletConnectLogo;
            }

            if (evmAccount?.connector?.id.includes("keplr")) {
              return getCosmosWalletInfo(WalletType.KEPLR).imgSrc;
            }
            return connectors.find((item) => item.id === evmAccount.connector?.id)?.icon;
          };
          return {
            address: evmAccount.address as string,
            currentConnectedEVMChainId: String(evmAccount.chainId),
            chainType,
            wallet: {
              name: evmAccount.connector.id,
              prettyName: evmAccount.connector.name,
              logo: getLogo(),
            },
          };
        }
        case ChainType.Svm: {
          if (!solanaWallet?.publicKey) return;

          const getLogo = () => {
            if (solanaWallet.name === "WalletConnect") {
              return svmWallet?.logo ?? walletConnectLogo;
            }

            return solanaWallet.icon;
          };

          return {
            address: solanaWallet.publicKey.toBase58(),
            chainType,
            wallet: {
              name: solanaWallet.name as string,
              prettyName: solanaWallet.name as string,
              logo: getLogo(),
            },
          };
        }
        default:
          return undefined;
      }
    },
    [
      chains,
      connectedAddress,
      cosmosAccounts,
      wallet.cosmos,
      evmAccount.chainId,
      evmAccount.address,
      evmAccount.connector,
      connectors,
      evmWallet?.logo,
      solanaWallet?.publicKey,
      solanaWallet?.name,
      solanaWallet?.icon,
      svmWallet?.logo,
    ],
  );

  return getAccount;
};
