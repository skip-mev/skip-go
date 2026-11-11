import { atom } from "jotai";
import { track } from "@amplitude/analytics-browser";
import { ChainType } from "@skip-go/client";
import { WalletType, getWallet, connect, getChainInfo, isWalletConnect } from "graz";
import {
  extraCosmosChainIdsToConnectPerWalletAtom,
  addExtraChainIdsToConnectForWalletTypeAtom,
  getInitialChainIds,
} from "@/hooks/useCreateCosmosWallets";
import { sourceAssetAtom } from "./swapPage";
import { walletsAtom } from "./wallets";

type SourceSelection = {
  chainId?: string;
  walletName?: WalletType;
  sourceChanged: boolean;
  approvalRequested: boolean;
};

// Keep attempts and pending requests across page remounts within the widget store.
export const cosmosSourceConnectionAtom = atom<{
  selection?: SourceSelection;
  pending?: SourceSelection;
  signal?: AbortSignal;
}>({});

cosmosSourceConnectionAtom.onMount = (setConnection) => {
  const controller = new AbortController();
  setConnection((current) => ({ ...current, signal: controller.signal }));
  // Stop follow-up work on unmount, but retain the lock until the request settles.
  return () => controller.abort();
};

export const connectToMissingCosmosChainAtom = atom(
  null,
  async (
    get,
    set,
    account: Pick<SourceSelection, "chainId" | "walletName"> & {
      hasApprovedSourceAccount: boolean;
    },
  ) => {
    const sourceAsset = get(sourceAssetAtom);
    const chainId = sourceAsset?.chainId;
    const walletName = get(walletsAtom).cosmos?.walletName as WalletType | undefined;
    if (account.chainId !== chainId || account.walletName !== walletName) return;

    const extraChainIdsToConnect = get(extraCosmosChainIdsToConnectPerWalletAtom);
    const { signal } = get(cosmosSourceConnectionAtom);
    if (!signal || signal.aborted) return;
    const previousSelection = get(cosmosSourceConnectionAtom).selection;
    const selection =
      previousSelection &&
      previousSelection.chainId === chainId &&
      previousSelection.walletName === walletName
        ? previousSelection
        : {
            chainId,
            walletName,
            sourceChanged: Boolean(
              previousSelection?.chainId &&
                previousSelection.chainId !== chainId &&
                !account.hasApprovedSourceAccount,
            ),
            approvalRequested: false,
          };

    if (selection !== previousSelection) {
      set(cosmosSourceConnectionAtom, (current) => ({ ...current, selection }));
    }

    if (!chainId || !walletName || sourceAsset?.isEvm || sourceAsset?.isSvm) return;

    const wallet = getWallet(walletName);
    const additionalChainIds = extraChainIdsToConnect[walletName] ?? [];
    const chainIdsToConnect = [...getInitialChainIds(walletName), ...additionalChainIds];
    const walletConnect = isWalletConnect(walletName);

    if (walletConnect ? account.hasApprovedSourceAccount : chainIdsToConnect.includes(chainId))
      return;
    if (walletConnect && !selection.sourceChanged) return;
    if (selection.approvalRequested || get(cosmosSourceConnectionAtom).pending) return;

    const requestedSelection = { ...selection, approvalRequested: true };
    try {
      const chainInfo = getChainInfo({ chainId });
      if (chainInfo) {
        // Let StrictMode subscription cleanup finish before opening a wallet request.
        await Promise.resolve();
        if (
          signal.aborted ||
          get(cosmosSourceConnectionAtom).selection !== selection ||
          get(cosmosSourceConnectionAtom).pending ||
          get(sourceAssetAtom)?.chainId !== chainId ||
          get(walletsAtom).cosmos?.walletName !== walletName
        )
          return;

        set(cosmosSourceConnectionAtom, (current) => ({
          ...current,
          selection: requestedSelection,
          pending: requestedSelection,
        }));

        if (!walletConnect) {
          await wallet.experimentalSuggestChain(chainInfo);
        }
        if (
          signal.aborted ||
          get(cosmosSourceConnectionAtom).selection !== requestedSelection ||
          get(sourceAssetAtom)?.chainId !== chainId ||
          get(walletsAtom).cosmos?.walletName !== walletName
        )
          return;

        const response = await connect({
          chainId,
          walletType: walletName,
          autoReconnect: false,
        });
        if (
          signal.aborted ||
          get(cosmosSourceConnectionAtom).selection !== requestedSelection ||
          get(sourceAssetAtom)?.chainId !== chainId ||
          get(walletsAtom).cosmos?.walletName !== walletName
        )
          return;

        if (!response.accounts[chainId]) {
          throw new Error(`Wallet did not approve ${chainId}`);
        }

        set(addExtraChainIdsToConnectForWalletTypeAtom, {
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
      if (get(cosmosSourceConnectionAtom).pending === requestedSelection) {
        set(cosmosSourceConnectionAtom, (current) => ({ ...current, pending: undefined }));
      }
    }
  },
);
