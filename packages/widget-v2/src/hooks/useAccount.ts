import { getCosmosWalletInfo } from "@/constants/graz";
import { solanaWallets } from "@/constants/solana";
import { skipChainsAtom } from "@/state/skipClient";
import { walletsAtom } from "@/state/wallets";
import { useAccount as useCosmosAccount, WalletType, } from "graz";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { useAccount as useEvmAccount, useConnectors } from "wagmi";

export const useAccount = (chainID?: string) => {
  const wallet = useAtomValue(walletsAtom);
  const { data: chains } = useAtomValue(skipChainsAtom);
  const chainType = chains?.find((c) => c.chainID === chainID)?.chainType;

  const { data: cosmosAccounts } = useCosmosAccount({
    multiChain: true
  });
  const cosmosAccount = useMemo(() => {
    if (!cosmosAccounts || !chainID) return;
    return cosmosAccounts[chainID];
  }, [cosmosAccounts, chainID]);

  const solanaWallet = solanaWallets.find(
    (w) => w.name === wallet.svm?.walletName
  );

  const evmAccount = useEvmAccount();
  const connectors = useConnectors();

  const account = useMemo(() => {
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
  }, [chainType, evmAccount.chainId, evmAccount.address, evmAccount.connector, chainID, connectors, cosmosAccount, wallet.cosmos, solanaWallet?.publicKey, solanaWallet?.name, solanaWallet?.icon]);

  return account;
};
