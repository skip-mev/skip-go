import { useEffect } from "react";
import { atom, useAtomValue, useSetAtom, useStore } from "jotai";
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

type SourceSelection = {
  chainId?: string;
  walletName?: WalletType;
  sourceChanged: boolean;
  approvalRequested: boolean;
};

// Keep attempts and pending requests across page remounts within the widget store.
const connectionAtom = atom<{
  selection?: SourceSelection;
  pending?: SourceSelection;
  signal?: AbortSignal;
}>({});

connectionAtom.onMount = (setConnection) => {
  const controller = new AbortController();
  setConnection((current) => ({ ...current, signal: controller.signal }));
  // Stop follow-up work on unmount, but retain the lock until the request settles.
  return () => controller.abort();
};

export const useConnectToMissingCosmosChain = () => {
  const store = useStore();
  const sourceAsset = useAtomValue(sourceAssetAtom);
  const wallets = useAtomValue(walletsAtom);
  const extraChainIdsToConnect = useAtomValue(extraCosmosChainIdsToConnectPerWalletAtom);
  const { data: accounts } = useAccount();
  const hasApprovedSourceAccount = Boolean(sourceAsset?.chainId && accounts?.[sourceAsset.chainId]);
  const { pending, signal } = useAtomValue(connectionAtom);
  const isAskingToApproveConnection = pending !== undefined;

  const addExtraChainIdsToConnectForWalletType = useSetAtom(
    addExtraChainIdsToConnectForWalletTypeAtom,
  );

  useEffect(() => {
    const connectToMissingCosmosChain = async () => {
      const chainId = sourceAsset?.chainId;
      const walletName = wallets?.cosmos?.walletName as WalletType | undefined;
      if (!signal || signal.aborted) return;
      const previousSelection = store.get(connectionAtom).selection;
      const selection =
        previousSelection &&
        previousSelection.chainId === chainId &&
        previousSelection.walletName === walletName
          ? previousSelection
          : {
              chainId,
              walletName,
              sourceChanged: Boolean(
                previousSelection?.chainId && previousSelection.chainId !== chainId,
              ),
              approvalRequested: false,
            };

      if (selection !== previousSelection) {
        store.set(connectionAtom, (current) => ({ ...current, selection }));
      }

      if (!chainId || !walletName || sourceAsset?.isEvm || sourceAsset?.isSvm) return;

      const wallet = getWallet(walletName);
      const additionalChainIds = extraChainIdsToConnect[walletName] ?? [];
      const chainIdsToConnect = [...getInitialChainIds(walletName), ...additionalChainIds];
      const walletConnect = isWalletConnect(walletName);

      if (walletConnect ? hasApprovedSourceAccount : chainIdsToConnect.includes(chainId)) return;
      if (walletConnect && !selection.sourceChanged) return;
      if (selection.approvalRequested || store.get(connectionAtom).pending) return;

      const requestedSelection = { ...selection, approvalRequested: true };
      try {
        const chainInfo = getChainInfo({ chainId });
        if (chainInfo) {
          // Let StrictMode subscription cleanup finish before opening a wallet request.
          await Promise.resolve();
          if (
            signal.aborted ||
            store.get(connectionAtom).selection !== selection ||
            store.get(connectionAtom).pending ||
            store.get(sourceAssetAtom)?.chainId !== chainId ||
            store.get(walletsAtom).cosmos?.walletName !== walletName
          )
            return;

          store.set(connectionAtom, (current) => ({
            ...current,
            selection: requestedSelection,
            pending: requestedSelection,
          }));

          if (!walletConnect) {
            await wallet.experimentalSuggestChain(chainInfo);
          }
          if (
            signal.aborted ||
            store.get(connectionAtom).selection !== requestedSelection ||
            store.get(sourceAssetAtom)?.chainId !== chainId ||
            store.get(walletsAtom).cosmos?.walletName !== walletName
          )
            return;

          const response = await connect({
            chainId,
            walletType: walletName,
            autoReconnect: false,
          });
          if (
            signal.aborted ||
            store.get(connectionAtom).selection !== requestedSelection ||
            store.get(sourceAssetAtom)?.chainId !== chainId ||
            store.get(walletsAtom).cosmos?.walletName !== walletName
          )
            return;

          if (!response.accounts[chainId]) {
            throw new Error(`Wallet did not approve ${chainId}`);
          }

          addExtraChainIdsToConnectForWalletType({
            walletName,
            chainId,
          });
        }
      } catch (error) {
        track("connect wallet error", {
          walletName,
          chainId,
          ChainType: ChainType.Cosmos,
          errorMessage: error instanceof Error ? error.message : String(error),
        });
      } finally {
        if (store.get(connectionAtom).pending === requestedSelection) {
          store.set(connectionAtom, (current) => ({ ...current, pending: undefined }));
        }
      }
    };

    void connectToMissingCosmosChain();
  }, [
    sourceAsset,
    wallets,
    extraChainIdsToConnect,
    hasApprovedSourceAccount,
    isAskingToApproveConnection,
    signal,
    store,
    addExtraChainIdsToConnectForWalletType,
  ]);

  return { hasApprovedSourceAccount, isAskingToApproveConnection };
};
