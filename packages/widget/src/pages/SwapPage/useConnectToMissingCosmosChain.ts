import { useEffect, useRef, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { track } from "@amplitude/analytics-browser";
import { ChainType } from "@skip-go/client";
import {
  extraCosmosChainIdsToConnectPerWalletAtom,
  addExtraChainIdsToConnectForWalletTypeAtom,
  getInitialChainIds,
} from "@/hooks/useCreateCosmosWallets";
import { sourceAssetAtom } from "@/state/swapPage";
import { walletsAtom } from "@/state/wallets";
import { WalletType, getWallet, connect, getChainInfo, isWalletConnect, useAccount } from "graz";

export const useConnectToMissingCosmosChain = () => {
  const sourceAsset = useAtomValue(sourceAssetAtom);
  const wallets = useAtomValue(walletsAtom);
  const extraChainIdsToConnect = useAtomValue(extraCosmosChainIdsToConnectPerWalletAtom);
  const { data: accounts } = useAccount();
  const hasApprovedSourceAccount = Boolean(
    sourceAsset?.chainId && accounts?.[sourceAsset.chainId],
  );

  const [isAskingToApproveConnection, setIsAskingToApproveConnection] = useState(false);
  const previousSourceChainIdRef = useRef(sourceAsset?.chainId);

  const addExtraChainIdsToConnectForWalletType = useSetAtom(
    addExtraChainIdsToConnectForWalletTypeAtom,
  );

  useEffect(() => {
    const connectToMissingCosmosChain = async () => {
      const walletName = wallets?.cosmos?.walletName as WalletType | undefined;
      const previousSourceChainId = previousSourceChainIdRef.current;
      previousSourceChainIdRef.current = sourceAsset?.chainId;

      if (!sourceAsset?.chainId || !walletName || sourceAsset.isEvm || sourceAsset.isSvm) return;

      const wallet = getWallet(walletName);
      const additionalChainIds = extraChainIdsToConnect[walletName] ?? [];
      const chainIdsToConnect = [...getInitialChainIds(walletName), ...additionalChainIds];
      const walletConnect = isWalletConnect(walletName);

      if (
        walletConnect
          ? accounts?.[sourceAsset.chainId]
          : chainIdsToConnect.includes(sourceAsset.chainId)
      )
        return;
      if (walletConnect && (!previousSourceChainId || previousSourceChainId === sourceAsset.chainId))
        return;

      setIsAskingToApproveConnection(true);

      try {
        const chainInfo = getChainInfo({ chainId: sourceAsset.chainId });
        if (chainInfo) {
          if (!walletConnect) {
            await wallet.experimentalSuggestChain(chainInfo);
          }

          const response = await connect({
            chainId: sourceAsset.chainId,
            walletType: walletName,
            autoReconnect: false,
          });

          if (!response.accounts[sourceAsset.chainId]) {
            throw new Error(`Wallet did not approve ${sourceAsset.chainId}`);
          }

          addExtraChainIdsToConnectForWalletType({
            walletName,
            chainId: sourceAsset.chainId,
          });
        }
      } catch (error) {
        track("connect wallet error", {
          walletName,
          chainId: sourceAsset.chainId,
          ChainType: ChainType.Cosmos,
          errorMessage: error instanceof Error ? error.message : String(error),
        });
      } finally {
        setIsAskingToApproveConnection(false);
      }
    };

    void connectToMissingCosmosChain();
  }, [
    sourceAsset,
    wallets,
    extraChainIdsToConnect,
    accounts,
    addExtraChainIdsToConnectForWalletType,
  ]);

  return { hasApprovedSourceAccount, isAskingToApproveConnection };
};
