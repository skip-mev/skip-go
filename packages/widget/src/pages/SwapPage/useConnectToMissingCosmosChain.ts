import { useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { WalletType, useAccount } from "graz";
import { extraCosmosChainIdsToConnectPerWalletAtom } from "@/hooks/useCreateCosmosWallets";
import { sourceAssetAtom } from "@/state/swapPage";
import { walletsAtom } from "@/state/wallets";
import {
  cosmosSourceConnectionAtom,
  connectToMissingCosmosChainAtom,
} from "@/state/cosmosSourceConnection";

export const useConnectToMissingCosmosChain = () => {
  const sourceAsset = useAtomValue(sourceAssetAtom);
  const wallets = useAtomValue(walletsAtom);
  const extraChainIdsToConnect = useAtomValue(extraCosmosChainIdsToConnectPerWalletAtom);
  const { data: accounts } = useAccount();
  const hasApprovedSourceAccount = Boolean(sourceAsset?.chainId && accounts?.[sourceAsset.chainId]);
  const { pending, signal } = useAtomValue(cosmosSourceConnectionAtom);
  const isAskingToApproveConnection = pending !== undefined;

  const requestConnection = useSetAtom(connectToMissingCosmosChainAtom);

  useEffect(() => {
    void requestConnection({
      chainId: sourceAsset?.chainId,
      walletName: wallets?.cosmos?.walletName as WalletType | undefined,
      hasApprovedSourceAccount,
    });
  }, [
    sourceAsset,
    wallets,
    extraChainIdsToConnect,
    hasApprovedSourceAccount,
    isAskingToApproveConnection,
    signal,
    requestConnection,
  ]);

  return { hasApprovedSourceAccount, isAskingToApproveConnection };
};
