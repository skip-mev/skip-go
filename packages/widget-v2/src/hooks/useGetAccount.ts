import { getCosmosWalletInfo } from "@/constants/graz";
import { solanaWallets } from "@/constants/solana";
import { skipChainsAtom } from "@/state/skipClient";
import { walletsAtom } from "@/state/wallets";
import { useAccount as useCosmosAccount, WalletType } from "graz";
import { useAtomValue } from "jotai";
import { useAccount as useEvmAccount } from "wagmi";

export const useGetAccount = () => {
  const wallet = useAtomValue(walletsAtom);
  const { data: chains } = useAtomValue(skipChainsAtom);

  const { data: cosmosAccounts } = useCosmosAccount({
    multiChain: true
  });

  const evmAccount = useEvmAccount();

  const getAccount = (chainId?: string) => {
    const chainType = chains?.find((c) => c.chainID === chainId)?.chainType;

    const cosmosAccount = chainId ? cosmosAccounts?.[chainId] : undefined;

    const solanaWallet = solanaWallets.find(
      (w) => w.name === wallet.svm?.walletName
    );

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
        if (evmAccount.chainId !== Number(chainId)) return;
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
  };

  return getAccount;
};
