import { skipChainsAtom } from "@/state/skipClient";
import {
  cosmosWalletAtom,
  evmWalletAtom,
  svmWalletAtom,
  connectedAddressesAtom,
  WalletState,
  walletsAtom,
} from "@/state/wallets";
import { useAtomValue } from "jotai";
import { useCallback } from "react";
import { ChainType } from "@skip-go/client";
import { useAccount as useCosmosAccount, WalletType } from "graz";
import { useAccount as useEvmAccount, useConnectors } from "wagmi";

export const useGetAccount = () => {
  const wallets = useAtomValue(walletsAtom);
  const evmWallet = useAtomValue(evmWalletAtom);
  const cosmosWallet = useAtomValue(cosmosWalletAtom);
  const svmWallet = useAtomValue(svmWalletAtom);
  const connectedAddress = useAtomValue(connectedAddressesAtom);
  const { data: chains } = useAtomValue(skipChainsAtom);

  const evmAccount = useEvmAccount();

  const { data: cosmosAccounts, walletType } = useCosmosAccount({
    multiChain: true,
  });

  const getAccount = useCallback(
    (chainId?: string, checkChainType?: boolean) => {
      if (!chainId) return;
      const chainType = chains?.find((c) => c.chainID === chainId)?.chainType;
      if (connectedAddress && connectedAddress[chainId]) {
        return {
          address: connectedAddress[chainId],
          chainType: chainType,
          walletName: "injected",
          walletPrettyName: "injected",
        } as WalletState;
      }

      const getCosmosAccount = () => {
        if (!cosmosAccounts || !chainId) return;
        return cosmosAccounts[chainId];
      };
      const cosmosAccount = getCosmosAccount();

      switch (chainType) {
        case ChainType.Cosmos: {
          if (!cosmosAccount) return;
          if (!wallets.cosmos) return;

          return {
            ...cosmosWallet,
            address: cosmosAccount.bech32Address,
          };
        }
        case ChainType.EVM: {
          if (!wallets.evm) return;
          if (evmAccount.chainId !== Number(chainId) && !checkChainType) return;
          if (!evmAccount.address) return;
          if (!evmAccount.connector) return;

          return { ...evmWallet, address: evmAccount.address as string };
        }
        case ChainType.SVM: {
          if (!svmWallet) return;
          return svmWallet;
        }
        default:
          return undefined;
      }
    },
    [chains, connectedAddress, cosmosAccounts, cosmosWallet, evmWallet, svmWallet, wallets.cosmos],
  );

  return getAccount;
};
