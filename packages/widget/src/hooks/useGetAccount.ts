import { skipChainsAtom } from "@/state/skipClient";
import {
  cosmosWalletAtom,
  evmWalletAtom,
  svmWalletAtom,
  connectedAddressesAtom,
  WalletState,
} from "@/state/wallets";
import { useAtomValue } from "jotai";
import { useCallback } from "react";
import { ChainType } from "@skip-go/client";

export const useGetAccount = () => {
  const evmWallet = useAtomValue(evmWalletAtom);
  const cosmosWallet = useAtomValue(cosmosWalletAtom);
  const svmWallet = useAtomValue(svmWalletAtom);
  const connectedAddress = useAtomValue(connectedAddressesAtom);
  const { data: chains } = useAtomValue(skipChainsAtom);

  const getAccount = useCallback(
    (chainId?: string) => {
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

      switch (chainType) {
        case ChainType.Cosmos: {
          if (!cosmosWallet) return;
          return {
            ...cosmosWallet,
            address: cosmosWallet?.addressMap?.[chainId]?.bech32Address,
          };
        }
        case ChainType.EVM: {
          if (!evmWallet) return;
          return evmWallet;
        }
        case ChainType.SVM: {
          if (!svmWallet) return;
          return svmWallet;
        }
        default:
          return undefined;
      }
    },
    [chains, connectedAddress, cosmosWallet, evmWallet, svmWallet],
  );

  return getAccount;
};
