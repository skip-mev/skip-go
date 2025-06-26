import { atomWithMutation } from "jotai-tanstack-query";
import { skipChainsAtom } from "@/state/skipClient";
import { routeConfigAtom, skipRouteAtom } from "@/state/route";
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
import { setTransactionHistoryAtom, transactionHistoryAtom } from "./history";
import { ClientOperation, getClientOperations, SimpleStatus } from "@/utils/clientType";
import { errorWarningAtom, ErrorWarningType } from "./errorWarning";
import { isUserRejectedRequestError } from "@/utils/error";
import { sourceAssetAtom, swapSettingsAtom } from "./swapPage";
import { createExplorerLink } from "@/utils/explorerLink";
import { callbacksAtom } from "./callbacks";
import { setUser, setTag } from "@sentry/react";
import { track } from "@amplitude/analytics-browser";
import {
  ChainType,
  executeRoute,
  RouteResponse,
  TransactionCallbacks,
  UserAddress,
  TxStatusResponse,
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
  route?: RouteResponse;
  clientOperations: ClientOperation[];
  transactionDetailsArray: TransactionDetails[];
  transactionHistoryIndex: number;
  overallStatus: SimpleStatus;
  isValidatingGasBalance?: ValidatingGasBalanceData;
  transactionsSigned: number;
  timestamp: number;
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
    transactionDetailsArray: [],
    transactionHistoryIndex: 0,
    overallStatus: "unconfirmed",
    isValidatingGasBalance: undefined,
    transactionsSigned: 0,
    timestamp: -1,
  },
);

export const setOverallStatusAtom = atom(null, (_get, set, status: SimpleStatus) => {
  set(swapExecutionStateAtom, (state) => ({ ...state, overallStatus: status }));
});

export const clearIsValidatingGasBalanceAtom = atom(null, (_get, set) => {
  set(swapExecutionStateAtom, (state) => ({
    ...state,
    isValidatingGasBalance: undefined,
  }));
});

export const setSwapExecutionStateAtom = atom(null, (get, set) => {
  const { data: route } = get(skipRouteAtom);
  const { data: chains } = get(skipChainsAtom);
  const transactionHistory = get(transactionHistoryAtom);
  const callbacks = get(callbacksAtom);
  const transactionHistoryIndex = Array.isArray(transactionHistory) ? transactionHistory.length : 0;

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
    clientOperations: getClientOperations(route.operations),
    transactionHistoryIndex,
    overallStatus: "unconfirmed",
    isValidatingGasBalance: undefined,
    transactionsSigned: 0,
    timestamp: Date.now(),
  });

  set(submitSwapExecutionCallbacksAtom, {
    onTransactionSignRequested: async (props) => {
      track("execute route: transaction sign requested", { props });
      callbacks?.onTransactionSignRequested?.(props);
    },
    onTransactionUpdated: (txInfo) => {
      track("execute route: transaction updated", { txInfo });
      if (txInfo.status?.status !== "STATE_COMPLETED") {
        set(setTransactionDetailsAtom, {
          transactionDetails: txInfo,
        });
      }
    },
    onApproveAllowance: async ({ status, allowance }) => {
      track("execute route: approve allowance", { status, allowance });
      if (allowance && status === "pending") {
        set(setOverallStatusAtom, "approving");
      }
    },
    onTransactionBroadcast: async (txInfo) => {
      track("execute route: transaction broadcasted", { txInfo });
      setUser({ id: txInfo?.txHash });
      const chain = chains?.find((chain) => chain.chainId === txInfo.chainId);
      const explorerLink = createExplorerLink({
        chainId: txInfo.chainId,
        chainType: chain?.chainType,
        txHash: txInfo.txHash,
      });

      set(setTransactionDetailsAtom, {
        transactionDetails: { ...txInfo, explorerLink, status: undefined },
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
      track("execute route: transaction completed", { chainId, txHash, status });
      setTag("txCompleted", true);
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
    onTransactionSigned: async (txInfo) => {
      track("execute route: transaction signed");

      let transactionsSigned = 0;

      set(swapExecutionStateAtom, (prev) => {
        transactionsSigned = (prev.transactionsSigned ?? 0) + 1;
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
          transactionsSigned: transactionsSigned,
        };
      });

      const { timestamp } = get(swapExecutionStateAtom);

      set(setTransactionHistoryAtom, {
        timestamp: timestamp,
        signatures: transactionsSigned,
      });

      set(setOverallStatusAtom, "pending");
    },
    onError: (error: unknown) => {
      const currentPage = get(currentPageAtom);
      track("execute route: error", { error, route });
      callbacks?.onTransactionFailed?.({
        error: (error as Error)?.message,
      });

      if (isUserRejectedRequestError(error)) {
        track("expected error page: user rejected request");
        if (currentPage === Routes.SwapExecutionPage) {
          set(errorWarningAtom, {
            errorWarningType: ErrorWarningType.AuthFailed,
            onClickBack: () => {
              set(setOverallStatusAtom, "unconfirmed");
              set(clearIsValidatingGasBalanceAtom);
            },
          });
        }
      } else if ((error as Error)?.message?.toLowerCase().includes("relay fee quote has expired")) {
        track("error page: relay fee quote has expired");
        set(errorWarningAtom, {
          errorWarningType: ErrorWarningType.ExpiredRelayFeeQuote,
          error: error as Error,
          onClickBack: () => {
            set(setOverallStatusAtom, "unconfirmed");
          },
        });
      } else if (
        (error as Error)?.message?.toLowerCase().includes("insufficient balance for gas")
      ) {
        track("expected error page: insufficient gas balance");
        set(errorWarningAtom, {
          errorWarningType: ErrorWarningType.InsufficientBalanceForGas,
          error: error as Error,
          onClickBack: () => {
            set(setOverallStatusAtom, "unconfirmed");
          },
        });
      }
    },
    onValidateGasBalance: async (props) => {
      track("execute route: validate gas balance", { props });
      if (props.status === "pending") {
        set(setValidatingGasBalanceAtom, { status: "pending" });
      } else if (props.status === "completed") {
        set(setValidatingGasBalanceAtom, { status: "completed" });
        set(setOverallStatusAtom, "signing");
      }
    },
  });
});

export const setValidatingGasBalanceAtom = atom(
  null,
  (_get, set, isValidatingGasBalance: ValidatingGasBalanceData) => {
    set(swapExecutionStateAtom, (state) => ({ ...state, isValidatingGasBalance }));
  },
);

type SetTransactionDetailsProps = {
  transactionDetails: TransactionDetails;
  status?: SimpleStatus;
};

export const setTransactionDetailsAtom = atom(
  null,
  (get, set, { transactionDetails, status }: SetTransactionDetailsProps) => {
    const swapExecutionState = get(swapExecutionStateAtom);
    const { transactionDetailsArray, route } = swapExecutionState;

    const newTransactionDetailsArray = [...transactionDetailsArray];

    const transactionIndexFound = newTransactionDetailsArray.findIndex(
      (transaction) => transaction.txHash.toLowerCase() === transactionDetails.txHash.toLowerCase(),
    );
    if (transactionIndexFound !== -1) {
      newTransactionDetailsArray[transactionIndexFound] = {
        ...newTransactionDetailsArray[transactionIndexFound],
        ...transactionDetails,
      };
    } else {
      newTransactionDetailsArray.push(transactionDetails);
    }
    set(swapExecutionStateAtom, {
      ...swapExecutionState,
      transactionDetailsArray: newTransactionDetailsArray,
    });

    set(setTransactionHistoryAtom, {
      route: route as RouteResponse,
      transactionDetails: newTransactionDetailsArray,
      transferEvents: [],
      isSettled: false,
      isSuccess: false,
      timestamp: swapExecutionState?.timestamp,
      ...(status && { status }),
    });
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

export type TransactionDetails = {
  txHash: string;
  chainId: string;
  explorerLink?: string;
  status?: TxStatusResponse;
};

type SubmitSwapExecutionCallbacks = TransactionCallbacks & {
  onTransactionUpdated?: (transactionDetails: TransactionDetails) => void;
  onError: (error: unknown, transactionDetailsArray?: TransactionDetails[]) => void;
};

export const submitSwapExecutionCallbacksAtom = atom<SubmitSwapExecutionCallbacks | undefined>();

export const simulateTxAtom = atom<boolean>();
export const batchSignTxsAtom = atom<boolean>(true);

export const skipSubmitSwapExecutionAtom = atomWithMutation((get) => {
  const { route, userAddresses, transactionDetailsArray } = get(swapExecutionStateAtom);
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
      if (!userAddresses.length) return;
      try {
        await executeRoute({
          route,
          userAddresses,
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
        submitSwapExecutionCallbacks?.onError?.(error, transactionDetailsArray);
      }
      return null;
    },
    onError: (error: unknown) => {
      console.error(error);
      submitSwapExecutionCallbacks?.onError?.(error, transactionDetailsArray);
    },
  };
});
