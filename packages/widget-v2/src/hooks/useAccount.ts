import { getCosmosWalletInfo } from "@/constants/graz";
import { solanaWallets } from "@/constants/solana";
import { skipChainsAtom } from "@/state/skipClient";
import { cosmosWalletAtom, evmWalletAtom, svmWalletAtom, walletsAtom } from "@/state/wallets";
import { useAccount as useCosmosAccount, WalletType, } from "graz";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useMemo, useCallback } from "react";
import { useAccount as useEvmAccount, useConnectors } from "wagmi";

export const useAccount = () => {
  const wallet = useAtomValue(walletsAtom);
  const setEvmWallet = useSetAtom(evmWalletAtom);
  const setCosmosWallet = useSetAtom(cosmosWalletAtom);
  const setSvmWallet = useSetAtom(svmWalletAtom);
  const { data: chains } = useAtomValue(skipChainsAtom);

  const { data: cosmosAccounts, walletType } = useCosmosAccount({
    multiChain: true
  });

  const solanaWallet = solanaWallets.find(
    (w) => w.name === wallet.svm?.walletName
  );

  const evmAccount = useEvmAccount();
  const connectors = useConnectors();

  useEffect(() => {
    const chainType = chains?.find((c) => c.chainID === chainID)?.chainType;
    switch (chainType) {
      case "cosmos":
        if (walletType) {
          setCosmosWallet({
            walletName: walletType,
            chainType: "cosmos",
          });
        }
        break;
      case "svm":
        if (solanaWallet) {
          setSvmWallet({
            walletName: solanaWallet.name,
            chainType: "svm",
          });
        }
        break;
      case "evm":
        if (evmAccount.connector) {
          setEvmWallet({
            walletName: evmAccount.connector.id,
            chainType: "evm",
          });
        }
        break;
      default:
        break;
    }
  }, [chains, evmAccount.connector, setCosmosWallet, setEvmWallet, setSvmWallet, solanaWallet, walletType]);

  const getAccount = useCallback((chainID?: string) => {
    const chainType = chains?.find((c) => c.chainID === chainID)?.chainType;
    const getCosmosAccount = () => {
      if (!cosmosAccounts || !chainID) return;
      return cosmosAccounts[chainID];
    };
    const cosmosAccount = getCosmosAccount();

    switch (chainType) {
      case "cosmos":
        {
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
            }
          };
        }
      case "evm":
        if (!wallet.evm) return;
        if (evmAccount.chainId !== Number(chainID)) return;
        if (!evmAccount.address) return;
        if (!evmAccount.connector) return;
        return {
          address: evmAccount.address as string,
          chainType,
          wallet: {
            name: evmAccount.connector.id,
            prettyName: evmAccount.connector.name,
            logo: connectors.find(item => item.id === evmAccount.connector?.id)?.icon,
          }
        };
      case "svm":
        {
          if (!wallet.svm) return;
          if (!solanaWallet?.publicKey) return;
          return {
            address: solanaWallet.publicKey.toBase58(),
            chainType,
            wallet: {
              name: solanaWallet.name as string,
              prettyName: solanaWallet.name as string,
              logo: solanaWallet.icon,
            }
          };
        }
      default:
        return undefined;
    }
  }, [chains, wallet, evmAccount, connectors, cosmosAccounts, solanaWallet]);

  return getAccount;
};
