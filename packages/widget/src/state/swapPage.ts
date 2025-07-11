import { atom } from "jotai";
import { ClientAsset, skipAssetsAtom } from "@/state/skipClient";
import { getSigningStargateClient } from "@skip-go/client";
import { setRouteToDefaultRouteAtom, skipRouteAtom } from "@/state/route";
import { atomWithDebounce } from "@/utils/atomWithDebounce";
import { RoutePreference } from "./types";
import { atomEffect } from "jotai-effect";
import { callbacksAtom } from "./callbacks";
import { jotaiStore } from "@/widget/Widget";
import { currentPageAtom, Routes } from "./router";
import { errorWarningAtom } from "./errorWarning";
import { getConnectedSignersAtom, walletsAtom } from "./wallets";
import { getWallet, WalletType } from "graz";
import { LOCAL_STORAGE_KEYS } from "./localStorageKeys";
import {
  extraCosmosChainIdsToConnectPerWalletAtom,
  getInitialChainIds,
} from "@/hooks/useCreateCosmosWallets";
import { atomWithStorageNoCrossTabSync } from "@/utils/storage";

export type AssetAtom = Partial<ClientAsset> & {
  amount?: string;
  locked?: boolean;
};

export const {
  debouncedValueAtom: debouncedSourceAssetAmountAtom,
  valueInitialized: debouncedSourceAssetAmountValueInitializedAtom,
  clearTimeoutAtom: cleanupDebouncedSourceAssetAmountAtom,
} = atomWithDebounce<string | undefined>();

export const {
  debouncedValueAtom: debouncedDestinationAssetAmountAtom,
  valueInitialized: debouncedDestinationAssetAmountValueInitializedAtom,
  clearTimeoutAtom: cleanupDebouncedDestinationAssetAmountAtom,
} = atomWithDebounce<string | undefined>();

export const onRouteUpdatedEffect: ReturnType<typeof atomEffect> = atomEffect((get) => {
  const sourceAsset = get(sourceAssetAtom);
  const destinationAsset = get(destinationAssetAtom);
  const { data } = get(skipRouteAtom);

  const callbacks = get(callbacksAtom);

  if (callbacks?.onRouteUpdated) {
    callbacks?.onRouteUpdated({
      srcChainId: sourceAsset?.chainId,
      srcAssetDenom: sourceAsset?.denom,
      destChainId: destinationAsset?.chainId,
      destAssetDenom: destinationAsset?.denom,
      amountIn: sourceAsset?.amount,
      amountOut: destinationAsset?.amount,
      requiredChainAddresses: data?.requiredChainAddresses,
    });
  }
});

export const preloadSigningStargateClientEffect: ReturnType<typeof atomEffect> = atomEffect(
  (get) => {
    (async () => {
      const sourceAsset = get(sourceAssetAtom);
      const wallets = get(walletsAtom);
      const getSigners = get(getConnectedSignersAtom);
      const extraChainIdsToConnect = get(extraCosmosChainIdsToConnectPerWalletAtom);

      const walletName = wallets?.cosmos?.walletName as WalletType | undefined;
      const signer = getSigners?.getCosmosSigner ?? (walletName && getWallet(walletName));

      if (!sourceAsset?.chainId || !wallets.cosmos || !signer || !walletName) return;

      const additionalChainIds = extraChainIdsToConnect[walletName] ?? [];
      const chainIdsToConnect = [...getInitialChainIds(walletName), ...additionalChainIds];

      if (!chainIdsToConnect.includes(sourceAsset.chainId)) return;

      await getSigningStargateClient({
        chainId: sourceAsset.chainId,
        getOfflineSigner: async (chainId) => {
          if (getSigners?.getCosmosSigner?.(chainId)) {
            return getSigners.getCosmosSigner(chainId);
          }

          if (!wallets.cosmos) throw new Error("getCosmosSigner error: no cosmos wallet");

          const wallet = getWallet(wallets.cosmos.walletName as WalletType);
          if (!wallet) throw new Error("getCosmosSigner error: wallet not found");
          if (!wallet?.getKey) throw new Error("getCosmosSigner error: getKey not found");

          const key = await wallet.getKey(chainId);
          return key.isNanoLedger
            ? wallet.getOfflineSignerOnlyAmino(chainId)
            : wallet.getOfflineSigner(chainId);
        },
      });
    })();
  },
);

export const sourceAssetAtom = atomWithStorageNoCrossTabSync<AssetAtom | undefined>(
  LOCAL_STORAGE_KEYS.sourceAsset,
  undefined,
);

export const resetWidget = ({ onlyClearInputValues }: { onlyClearInputValues?: boolean } = {}) => {
  const { set } = jotaiStore;

  if (onlyClearInputValues) {
    set(clearAssetInputAmountsAtom);
  } else {
    set(sourceAssetAtom, undefined);
    set(debouncedSourceAssetAmountAtom, "", undefined, true);

    set(destinationAssetAtom, undefined);
    set(debouncedDestinationAssetAmountAtom, "", undefined, true);
  }

  set(setRouteToDefaultRouteAtom);
  set(currentPageAtom, Routes.SwapPage);
  set(errorWarningAtom, undefined);
};

type SetAssetProps = {
  type: "source" | "destination";
  chainId: string;
  denom: string;
  amount?: number;
};

/**
 * Sets the selected asset (source or destination) in the global state
 * @param {"source" | "destination"} options.type - Indicates whether to update the source or destination asset.
 * @param {string} options.chainId - The chain Id of the asset.
 * @param {string} options.denom - The denom (token identifier) of the asset.
 * @param {number} options.amount - Optional amount to associate with the asset.
 */
export const setAsset = ({ type, ...assetDetails }: SetAssetProps) => {
  const { set, get } = jotaiStore;

  const { data: skipAssets } = get(skipAssetsAtom);
  const assetFound = skipAssets?.find(
    (asset) => asset?.chainId === assetDetails.chainId && asset?.denom === assetDetails?.denom,
  );

  const assetAmount = assetDetails?.amount?.toString();

  switch (type) {
    case "source":
      set(sourceAssetAtom, { ...assetFound, amount: assetAmount });
      if (assetAmount) {
        set(sourceAssetAmountAtom, assetAmount);
      }
      break;
    case "destination":
      set(destinationAssetAtom, { ...assetFound, amount: assetAmount });
      if (assetAmount) {
        set(destinationAssetAmountAtom, assetAmount);
      }
  }
};

export const sourceAssetAmountAtom = atom(
  (get) => get(sourceAssetAtom)?.amount ?? "",
  (_get, set, newAmount: string) => {
    set(sourceAssetAtom, (prev) => ({ ...prev, amount: newAmount }));
    set(debouncedSourceAssetAmountAtom, newAmount);
    set(swapDirectionAtom, "swap-in");
    if (newAmount === "") {
      set(destinationAssetAtom, (prev) => ({ ...prev, amount: newAmount }));
      set(debouncedDestinationAssetAmountAtom, newAmount, undefined, true);
    }
  },
);

export const destinationAssetAtom = atomWithStorageNoCrossTabSync<AssetAtom | undefined>(
  LOCAL_STORAGE_KEYS.destinationAsset,
  undefined,
);

export const destinationAssetAmountAtom = atom(
  (get) => get(destinationAssetAtom)?.amount ?? "",
  (_get, set, newAmount: string, callback?: () => void) => {
    set(destinationAssetAtom, (prev) => ({ ...prev, amount: newAmount }));
    set(debouncedDestinationAssetAmountAtom, newAmount, callback);
    set(swapDirectionAtom, "swap-out");

    if (newAmount === "") {
      set(sourceAssetAtom, (prev) => ({ ...prev, amount: newAmount }));
      set(debouncedSourceAssetAmountAtom, newAmount, undefined, true);
    }
  },
);

export const clearAssetInputAmountsAtom = atom(null, (_get, set) => {
  set(sourceAssetAtom, (prev) => ({ ...prev, amount: "" }));
  set(debouncedSourceAssetAmountAtom, "", undefined, true);

  set(destinationAssetAtom, (prev) => ({ ...prev, amount: "" }));
  set(debouncedDestinationAssetAmountAtom, "", undefined, true);
});

export const isWaitingForNewRouteAtom = atom((get) => {
  const sourceAmount = get(sourceAssetAmountAtom);
  const destinationAmount = get(destinationAssetAmountAtom);
  const debouncedSourceAmount = get(debouncedSourceAssetAmountAtom);
  const debouncedDestinationAmount = get(debouncedDestinationAssetAmountAtom);

  const { isLoading } = get(skipRouteAtom);
  if (isLoading) return true;

  const direction = get(swapDirectionAtom);

  const sourceAmountIsValidNumber = !isNaN(parseFloat(sourceAmount));
  const destinationAmountIsValidNumber = !isNaN(parseFloat(destinationAmount));
  const sourceAmountHasChanged = sourceAmount !== debouncedSourceAmount;
  const destinationAmountHasChanged = destinationAmount !== debouncedDestinationAmount;

  if (direction === "swap-in") {
    return sourceAmountHasChanged && sourceAmountIsValidNumber;
  } else if (direction === "swap-out") {
    return destinationAmountHasChanged && destinationAmountIsValidNumber;
  }
});

export type SwapDirection = "swap-in" | "swap-out";

export const swapDirectionAtom = atomWithStorageNoCrossTabSync<SwapDirection>(
  "swapDirection",
  "swap-in",
);

export const isInvertingSwapAtom = atom(false);

export const invertSwapAtom = atom(null, (get, set) => {
  const sourceAsset = get(sourceAssetAtom);
  const destinationAsset = get(destinationAssetAtom);
  const clonedSourceAsset = { ...sourceAsset };
  const clonedDestinationAsset = { ...destinationAsset };
  const swapDirection = get(swapDirectionAtom);
  const callbacks = get(callbacksAtom);
  set(isInvertingSwapAtom, true);

  set(sourceAssetAtom, clonedDestinationAsset);
  set(sourceAssetAmountAtom, destinationAsset?.amount ?? "");

  set(destinationAssetAtom, clonedSourceAsset);
  set(destinationAssetAmountAtom, sourceAsset?.amount ?? "", () => {
    const newSwapDirection = swapDirection === "swap-in" ? "swap-out" : "swap-in";
    set(swapDirectionAtom, newSwapDirection);

    set(isInvertingSwapAtom, false);
    callbacks?.onSourceAndDestinationSwapped?.({
      srcChainId: clonedDestinationAsset?.chainId,
      srcAssetDenom: clonedDestinationAsset?.denom,
      destChainId: clonedSourceAsset?.chainId,
      destAssetDenom: clonedSourceAsset?.denom,
      amountIn: clonedDestinationAsset?.amount,
      amountOut: clonedSourceAsset?.amount,
    });
  });
});

export type ChainFilter = {
  source?: Record<string, string[] | undefined>;
  destination?: Record<string, string[] | undefined>;
};

export const filterAtom = atom<ChainFilter>();

export const filterOutAtom = atom<ChainFilter>();

export const EVM_GAS_AMOUNT = 150_000;

export const COSMOS_GAS_AMOUNT = {
  DEFAULT: 300_000,
  SWAP: 2_800_000,
  CARBON: 1_000_000,
};

export const defaultSwapSettings = {
  slippage: 1,
  routePreference: RoutePreference.FASTEST,
  useUnlimitedApproval: false,
};

export const swapSettingsAtom = atomWithStorageNoCrossTabSync(
  "swapSettingsAtom",
  defaultSwapSettings,
);

export const slippageAtom = atom(
  (get) => get(swapSettingsAtom).slippage,
  (_get, set, newSlippage: number) => {
    set(swapSettingsAtom, (prev) => ({ ...prev, slippage: newSlippage }));
  },
);

export const routePreferenceAtom = atom(
  (get) => get(swapSettingsAtom).routePreference,
  (_get, set, newRoutePreference: RoutePreference) => {
    set(swapSettingsAtom, (prev) => ({ ...prev, routePreference: newRoutePreference }));
  },
);

export const goFastWarningAtom = atomWithStorageNoCrossTabSync("showGoFastWarning", true);
