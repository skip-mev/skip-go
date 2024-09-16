import { getCosmosWalletInfo } from "@/constants/graz";
import { solanaWallets } from "@/constants/solana";
import { skipChainsAtom } from "@/state/skipClient";
import { Account, accountsAtom, walletsAtom } from "@/state/wallets";
import { useAccount as useCosmosAccount, WalletType } from "graz";
import { useAtomValue, useSetAtom } from "jotai";
import { useMemo } from "react";
import { useAccount as useEvmAccount } from "wagmi";

export const useAccount = () => {
  const wallet = useAtomValue(walletsAtom);
  const { data: chains } = useAtomValue(skipChainsAtom);
  const setAccounts = useSetAtom(accountsAtom);
  const chainTypes = chains?.map((c) => c.chainType);

  const { data: cosmosAccounts } = useCosmosAccount({
    multiChain: true,
  });

  const solanaWallet = solanaWallets.find(
    (w) => w.name === wallet.svm?.walletName
  );

  const evmAccount = useEvmAccount();

  const cosmosAccountArrayWithType = Object.values(cosmosAccounts ?? {}).map(account => ({ ...account, type: "cosmos" }));
  const solanaAccountArrayWithType = solanaWallets.map(wallet => ({ ...wallet, type: "svm" }));
  const evmAccountWithType = { ...evmAccount, type: "evm" };


  const allAccounts = [...cosmosAccountArrayWithType, ...solanaAccountArrayWithType, evmAccountWithType];

  console.log(allAccounts);

  // const accounts = useMemo(() => {
  //   return allAccounts?.map((account: any) => {
  //     switch (account.type) {
  //       case "cosmos": {
  //         if (!cosmosAccounts) return;
  //         if (!wallet.cosmos) return;
  //         const walletInfo = getCosmosWalletInfo(
  //           wallet.cosmos.walletName as WalletType
  //         );

  //         return {
  //           address: account.bech32Address,
  //           chainType: type,
  //           wallet: {
  //             name: wallet.cosmos,
  //             prettyName: walletInfo.name,
  //             logo: walletInfo.imgSrc,
  //             isLedger: cosmosAccount.isNanoLedger,
  //           },
  //         };
  //       }
  //       case "evm":
  //         if (evmAccount.chainId !== Number(chainIDs)) return;
  //         if (!evmAccount.address) return;
  //         if (!evmAccount.connector) return;
  //         return {
  //           address: evmAccount.address as string,
  //           chainType: type,
  //           wallet: {
  //             name: evmAccount.connector.id,
  //             prettyName: evmAccount.connector.name,
  //             logo: evmAccount.connector.icon,
  //           },
  //         };
  //       case "svm": {
  //         if (!solanaWallet?.publicKey) return;
  //         return {
  //           address: solanaWallet.publicKey.toBase58(),
  //           chainType: type,
  //           wallet: {
  //             name: solanaWallet.name as string,
  //             prettyName: solanaWallet.name as string,
  //             logo: solanaWallet.icon,
  //           },
  //         };
  //       }
  //       default:
  //         return;
  //     }
  //   }).filter(account => account) as Account[];
  // }, [
  //   chainIDs,
  //   chainTypes,
  //   cosmosAccount,
  //   evmAccount.address,
  //   evmAccount.chainId,
  //   evmAccount.connector,
  //   solanaWallet?.icon,
  //   solanaWallet?.name,
  //   solanaWallet?.publicKey,
  //   wallet.cosmos,
  // ]);
  // setAccounts(accounts);
  // return accounts;
  return [];
};
