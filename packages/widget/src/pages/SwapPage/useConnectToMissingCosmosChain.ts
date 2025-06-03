import { useEffect, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  extraCosmosChainIdsToConnectPerWalletAtom,
  addExtraChainIdsToConnectForWalletTypeAtom,
  getInitialChainIds,
} from "@/hooks/useCreateCosmosWallets";
import { sourceAssetAtom } from "@/state/swapPage";
import { walletsAtom } from "@/state/wallets";
import { WalletType, getWallet, connect, getChainInfo } from "graz";

export const useConnectToMissingCosmosChain = () => {
  const sourceAsset = useAtomValue(sourceAssetAtom);
  const wallets = useAtomValue(walletsAtom);
  const extraChainIdsToConnect = useAtomValue(extraCosmosChainIdsToConnectPerWalletAtom);

  const [isAskingToApproveConnection, setIsAskingToApproveConnection] = useState(false);

  const setExtraChainId = useSetAtom(addExtraChainIdsToConnectForWalletTypeAtom);

  useEffect(() => {
    const connectToMissingCosmosChain = async () => {
      const walletName = wallets?.cosmos?.walletName as WalletType | undefined;

      if (!sourceAsset?.chainId || !walletName || sourceAsset.isEvm || sourceAsset.isSvm) return;

      const wallet = getWallet(walletName);
      const additionalChainIds = extraChainIdsToConnect[walletName] ?? [];
      const chainIdsToConnect = [...getInitialChainIds(walletName), ...additionalChainIds];

      if (chainIdsToConnect.includes(sourceAsset.chainId)) return;

      setIsAskingToApproveConnection(true);

      try {
        const chainInfo = getChainInfo({ chainId: sourceAsset.chainId });
        if (chainInfo) {
          await wallet.experimentalSuggestChain(chainInfo);

          await connect({
            chainId: sourceAsset.chainId,
            walletType: walletName,
            autoReconnect: false,
          });

          setExtraChainId({
            walletName,
            chainId: sourceAsset.chainId,
          });
        }
      } finally {
        setIsAskingToApproveConnection(false);
      }
    };

    connectToMissingCosmosChain();
  }, [sourceAsset, wallets, extraChainIdsToConnect, setExtraChainId]);

  return { isAskingToApproveConnection };
};
