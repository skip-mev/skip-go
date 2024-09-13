import { getCosmosWalletInfo } from "@/constants/graz";
import { skipChainsAtom } from "@/state/skipClient";
import { walletsAtom } from "@/state/wallets";
import { useWallet as useSolanaWallet } from "@solana/wallet-adapter-react";
import { useAccount as useCosmosAccount, WalletType } from "graz";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { useAccount as useEvmAccount } from "wagmi";


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

  const evmAccount = useEvmAccount();
  const { wallets: solanaWallets } = useSolanaWallet();

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
              name: wallet.cosmos,
              prettyName: walletInfo.name,
              logo: walletInfo.imgSrc,
              isLedger: cosmosAccount.isNanoLedger,
            }
          };
        }
      case "evm":
        if (!evmAccount.address) return;
        if (!evmAccount.connector) return;
        return {
          address: evmAccount.address as string,
          chainType,
          wallet: {
            name: evmAccount.connector.id,
            prettyName: evmAccount.connector.name,
            logo: evmAccount.connector.icon,
          }
        };
      case "svm":
        {
          const solanaWallet = solanaWallets.find(
            (w) => w.adapter.name === wallet.svm?.walletName
          );
          if (!solanaWallet?.adapter.publicKey) return;
          return {
            address: solanaWallet.adapter.publicKey.toBase58(),
            chainType,
            wallet: {
              name: solanaWallet.adapter.name as string,
              prettyName: solanaWallet.adapter.name as string,
              logo: solanaWallet.adapter.icon,
            }
          };
        }
      default:
        return undefined;
    }
  }, [chainType, cosmosAccount, evmAccount.address, evmAccount.connector, solanaWallets, wallet.cosmos, wallet.svm?.walletName]);

  return account;
};
