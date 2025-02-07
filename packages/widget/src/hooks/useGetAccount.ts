import { getCosmosWalletInfo } from "@/constants/graz";
import { solanaWallets } from "@/constants/solana";
import { skipChainsAtom } from "@/state/skipClient";
import {
  cosmosWalletAtom,
  evmWalletAtom,
  svmWalletAtom,
  walletsAtom,
  connectedAddressesAtom,
  WalletState,
} from "@/state/wallets";
import { useAccount as useCosmosAccount, WalletType } from "graz";
import { useAtom, useAtomValue } from "jotai";
import { useCallback, useEffect } from "react";
import { useAccount as useEvmAccount, useConnectors } from "wagmi";
import { ChainType } from "@skip-go/client";
import { walletConnectLogo } from "@/constants/wagmi";

export const useGetAccount = () => {
  const [evmWallet, setEvmWallet] = useAtom(evmWalletAtom);
  const [cosmosWallet, setCosmosWallet] = useAtom(cosmosWalletAtom);
  const [svmWallet, setSvmWallet] = useAtom(svmWalletAtom);
  const connectedAddress = useAtomValue(connectedAddressesAtom);
  const { data: chains } = useAtomValue(skipChainsAtom);

  const getAccount = useCallback(
    // if checkChainType is true, it only check wallet connected no chainId is dependent
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

      switch (chainType) {
        case ChainType.Cosmos: {
          if (!cosmosWallet) return;
          return cosmosWallet;
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
