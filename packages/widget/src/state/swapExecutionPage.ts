import { atomWithMutation } from "jotai-tanstack-query";
import { skipChainsAtom } from "@/state/skipClient";
import { routeConfigAtom, skipRouteAtom, SwapRoute } from "@/state/route";
import { atom } from "jotai";
import {
  DEEPLINK_CHOICE,
  getConnectedSignersAtom,
  MinimalWallet,
  RECENT_WALLET_DATA,
  walletConnectDeepLinkByChainTypeAtom,
  walletsAtom,
} from "./wallets";
import { atomEffect } from "jotai-effect";
import { currentTransactionAtom, setTransactionHistoryAtom } from "./history";
import { ClientOperation, getClientOperations } from "@/utils/clientType";
import { errorWarningAtom, ErrorWarningType } from "./errorWarning";
import { isUserRejectedRequestError } from "@/utils/error";
import { sourceAssetAtom, swapSettingsAtom } from "./swapPage";
import { createExplorerLink } from "@/utils/explorerLink";
import { callbacksAtom } from "./callbacks";
import { track } from "@amplitude/analytics-browser";
import {
  ChainType,
  executeRoute,
  RouteResponse,
  TransactionCallbacks,
  UserAddress,
  TransactionDetails,
  executeMultipleRoutes,
} from "@skip-go/client";
import { currentPageAtom, Routes } from "./router";
import { LOCAL_STORAGE_KEYS } from "./localStorageKeys";
import { getWallet, WalletType } from "graz";
import { config } from "@/constants/wagmi";
import { WalletClient } from "viem";
import { getWalletClient } from "@wagmi/core";
import { atomWithStorageNoCrossTabSync } from "@/utils/storage";
import { Adapter } from "@solana/wallet-adapter-base";

type ValidatingGasBalanceData = {
  chainId?: string;
  txIndex?: number;
  status: "success" | "error" | "pending" | "completed";
};

type SwapExecutionState = {
  userAddresses: UserAddress[];
  route?: SwapRoute;
  clientOperations: ClientOperation[];
  currentTransactionId?: string;
  isValidatingGasBalance?: ValidatingGasBalanceData;
};

export type ChainAddress = {
  chainId: string;
  chainType?: ChainType;
  address?: string;
} & {
  source?: "input" | "parent" | "injected" | "wallet";
  wallet?: Pick<
    MinimalWallet,
    "walletName" | "walletPrettyName" | "walletChainType" | "walletInfo"
  >;
};

/**
 * route.requiredChainAddresses is a list of chainIDs that are required to have an address associated with them
 * the key in this atom is the index of the chainId in the requiredChainAddresses array
 */
export const chainAddressesAtom = atom<Record<number, ChainAddress>>({});

export const swapExecutionStateAtom = atomWithStorageNoCrossTabSync<SwapExecutionState>(
  LOCAL_STORAGE_KEYS.swapExecutionState,
  {
    route: undefined,
    clientOperations: [],
    userAddresses: [],
    currentTransactionId: undefined,
  },
);

export const setCurrentTransactionIdAtom = atom(null, (_get, set, transactionId?: string) => {
  set(swapExecutionStateAtom, (prev) => ({
    ...prev,
    currentTransactionId: transactionId,
  }));
});

export const setSwapExecutionStateAtom = atom(null, (get, set) => {
  const { data: route } = get(skipRouteAtom);
  const { data: chains } = get(skipChainsAtom);
  const callbacks = get(callbacksAtom);

  if (!route) return;

  const {
    requiredChainAddresses,
    sourceAssetDenom,
    sourceAssetChainId,
    destAssetDenom,
    destAssetChainId,
  } = route;

  const sourceAddress = requiredChainAddresses[0];
  const destinationAddress = requiredChainAddresses[requiredChainAddresses.length - 1];

  const initialChainAddresses: Record<number, ChainAddress> = {};

  route?.requiredChainAddresses?.forEach((chainId, index) => {
    initialChainAddresses[index] = {
      chainId,
      address: "",
    };
  });

  set(chainAddressesAtom, initialChainAddresses);

  set(swapExecutionStateAtom, {
    userAddresses: [],
    transactionDetailsArray: [],
    route,
    clientOperations: getClientOperations(route.mainRoute?.operations),
    currentTransactionId: undefined,
  });

  set(submitSwapExecutionCallbacksAtom, {
    onRouteStatusUpdated: async (routeStatus) => {
      console.log(routeStatus);
      set(setTransactionHistoryAtom, routeStatus);
    },
    onTransactionUpdated: (txInfo) => {
      track("execute route: transaction updated", { txInfo });
    },
    onApproveAllowance: async ({ status, allowance }) => {
      track("execute route: approve allowance", { status, allowance });
    },
    onTransactionSigned: async (txInfo) => {
      track("execute route: transaction signed");

      set(swapExecutionStateAtom, (prev) => {
        const clientOperations = prev.clientOperations;
        const signRequiredIndex = clientOperations.findIndex((operation) => {
          return (
            operation.signRequired &&
            (operation.chainId === txInfo.chainId || operation.fromChainId === txInfo.chainId)
          );
        });

        if (signRequiredIndex >= 0) {
          clientOperations[signRequiredIndex].signRequired = false;
        }

        return {
          ...prev,
          clientOperations: clientOperations,
        };
      });
    },
    onTransactionBroadcast: async (txInfo) => {
      track("execute route: transaction broadcasted", { txInfo });
      const chain = chains?.find((chain) => chain.chainId === txInfo.chainId);
      const explorerLink = createExplorerLink({
        chainId: txInfo.chainId,
        chainType: chain?.chainType,
        txHash: txInfo.txHash,
      });

      callbacks?.onTransactionBroadcasted?.({
        chainId: txInfo.chainId,
        txHash: txInfo.txHash,
        explorerLink: explorerLink ?? "",
        sourceAddress,
        destinationAddress,
        sourceAssetDenom,
        sourceAssetChainId,
        destAssetDenom,
        destAssetChainId,
      });
    },
    onTransactionCompleted: async ({ chainId, txHash, status }) => {
      track("execute route: transaction completed", {
        chainId,
        txHash,
        status,
      });
      const chain = chains?.find((chain) => chain.chainId === chainId);
      const explorerLink = createExplorerLink({
        chainId: chainId,
        chainType: chain?.chainType,
        txHash,
      });
      callbacks?.onTransactionComplete?.({
        chainId,
        txHash,
        explorerLink: explorerLink ?? "",
        sourceAddress,
        destinationAddress,
        sourceAssetDenom,
        sourceAssetChainId,
        destAssetDenom,
        destAssetChainId,
      });
    },
    onError: (error: unknown) => {
      const currentPage = get(currentPageAtom);
      set(setCurrentTransactionIdAtom);
      track("execute route: error", { error, route });
      callbacks?.onTransactionFailed?.({
        error: (error as Error)?.message,
      });

      if (isUserRejectedRequestError(error)) {
        track("expected error page: user rejected request");
        if (currentPage === Routes.SwapExecutionPage) {
          set(errorWarningAtom, {
            errorWarningType: ErrorWarningType.AuthFailed,
          });
        }
      } else if ((error as Error)?.message?.toLowerCase().includes("relay fee quote has expired")) {
        track("expected error page: relay fee quote has expired");
        set(errorWarningAtom, {
          errorWarningType: ErrorWarningType.ExpiredRelayFeeQuote,
        });
      } else if (
        (error as Error)?.message?.toLowerCase().includes("insufficient balance for gas")
      ) {
        track("expected error page: insufficient gas balance");
        set(errorWarningAtom, {
          errorWarningType: ErrorWarningType.InsufficientBalanceForGas,
          error: error as Error,
        });
      }
    },
    onValidateGasBalance: async (props) => {
      track("execute route: validate gas balance", { props });
    },
  });
});

export const setValidatingGasBalanceAtom = atom(
  null,
  (_get, set, isValidatingGasBalance: ValidatingGasBalanceData) => {
    set(swapExecutionStateAtom, (state) => ({
      ...state,
      isValidatingGasBalance,
    }));
  },
);

export const chainAddressEffectAtom = atomEffect((get, set) => {
  const chainAddresses = get(chainAddressesAtom);
  const addressesMatch = Object.values(chainAddresses).every(
    (chainAddress) => !!chainAddress.address,
  );
  if (!addressesMatch) return;

  const userAddresses = Object.values(chainAddresses).map((chainAddress) => {
    return {
      chainId: chainAddress.chainId,
      address: chainAddress.address as string,
    };
  });

  set(swapExecutionStateAtom, (prev) => ({
    ...prev,
    userAddresses,
  }));
});

type SubmitSwapExecutionCallbacks = TransactionCallbacks & {
  onTransactionUpdated?: (transactionDetails: TransactionDetails) => void;
  onError: (error: unknown, transactionDetailsArray?: TransactionDetails[]) => void;
};

export const submitSwapExecutionCallbacksAtom = atom<SubmitSwapExecutionCallbacks | undefined>();

export const simulateTxAtom = atom<boolean>();
export const batchSignTxsAtom = atom<boolean>(true);

export const skipSubmitSwapExecutionAtom = atomWithMutation((get) => {
  const { route, userAddresses } = get(swapExecutionStateAtom);
  const submitSwapExecutionCallbacks = get(submitSwapExecutionCallbacksAtom);
  const simulateTx = get(simulateTxAtom);
  const batchSignTxs = get(batchSignTxsAtom);
  const swapSettings = get(swapSettingsAtom);
  const getSigners = get(getConnectedSignersAtom);
  const wallets = get(walletsAtom);

  const { timeoutSeconds } = get(routeConfigAtom);

  const { data: chains } = get(skipChainsAtom);
  const sourceAsset = get(sourceAssetAtom);
  const walletConnectDeepLinkByChainType = get(walletConnectDeepLinkByChainTypeAtom);

  const chainType = chains?.find((chain) => chain.chainId === sourceAsset?.chainId)?.chainType;

  if (chainType) {
    const { deeplink, recentWalletData } = walletConnectDeepLinkByChainType[chainType as ChainType];
    if (chainType === ChainType.Cosmos) {
      window.localStorage.removeItem(DEEPLINK_CHOICE);
      window.localStorage.removeItem(RECENT_WALLET_DATA);
    } else {
      window.localStorage.setItem(DEEPLINK_CHOICE, deeplink);
      window.localStorage.setItem(RECENT_WALLET_DATA, recentWalletData);
    }
  }

  return {
    gcTime: Infinity,
    mutationFn: async ({ getSvmSigner }: { getSvmSigner: () => Promise<Adapter> }) => {
      if (!route) return;
      console.log("Executing route", route);
      if (!userAddresses.length) return;

      const secondAddresses = [
        {
          chainId: "noble-1",
          address: "noble1qj83mw6k79k7wp2675t8xueytwcf7t6dr6r79x",
        },
        // {
        //   chainId: "elys-1",
        //   address: "elys1qj83mw6k79k7wp2675t8xueytwcf7t6dte03s2",
        // },
        {
          chainId: "osmosis-1",
          address: "osmo1qj83mw6k79k7wp2675t8xueytwcf7t6drz9xt6",
        },
      ];
      try {
        await executeMultipleRoutes({
          route: {
            mainRoute: route.mainRoute,
            ...(route?.feeRoute ? { secondRoute: route.feeRoute } : {}),
          },
          userAddresses: {
            mainRoute: userAddresses,
            ...(route?.feeRoute ? { secondRoute: secondAddresses } : {}),
          },
          timeoutSeconds,
          slippageTolerancePercent: swapSettings.slippage.toString(),
          useUnlimitedApproval: swapSettings.useUnlimitedApproval,
          simulate: simulateTx !== undefined ? simulateTx : route.sourceAssetChainId !== "984122",
          batchSignTxs: batchSignTxs !== undefined ? batchSignTxs : true,
          ...submitSwapExecutionCallbacks,
          getCosmosSigner: async (chainId) => {
            if (getSigners?.getCosmosSigner?.(chainId)) {
              return getSigners.getCosmosSigner(chainId);
            }
            if (!wallets.cosmos) {
              throw new Error("getCosmosSigner error: no cosmos wallet");
            }
            const wallet = getWallet(wallets.cosmos.walletName as WalletType);
            if (!wallet) {
              throw new Error("getCosmosSigner error: wallet not found");
            }
            const key = await wallet.getKey(chainId);
            return key.isNanoLedger
              ? wallet.getOfflineSignerOnlyAmino(chainId)
              : wallet.getOfflineSigner(chainId);
          },
          getEvmSigner: async (chainId) => {
            if (getSigners?.getEvmSigner?.(chainId)) {
              return getSigners.getEvmSigner(chainId);
            }
            const evmWalletClient = (await getWalletClient(config, {
              chainId: parseInt(chainId),
            })) as WalletClient;
            return evmWalletClient;
          },
          getSvmSigner: async () => {
            if (getSigners?.getSvmSigner) {
              return getSigners.getSvmSigner();
            }
            const adapter = await getSvmSigner();
            if (!adapter) {
              throw new Error("getSvmSigner error: no SVM wallet");
            }
            return adapter;
          },
        });
      } catch (error: unknown) {
        console.error(error);
        const currentTransaction = get(currentTransactionAtom);
        submitSwapExecutionCallbacks?.onError?.(error, currentTransaction?.transactionDetails);
      }
      return null;
    },
    onError: (error: unknown) => {
      console.error(error);
      const currentTransaction = get(currentTransactionAtom);
      submitSwapExecutionCallbacks?.onError?.(error, currentTransaction?.transactionDetails);
    },
  };
});
