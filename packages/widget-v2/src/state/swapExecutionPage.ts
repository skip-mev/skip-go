import { atomWithMutation, atomWithQuery } from "jotai-tanstack-query";
import { skipClient, skipRouteAtom } from "./skipClient";
import { atom } from "jotai";
import { RouteResponse, TxStatusResponse, UserAddress } from "@skip-go/client";
import { MinimalWallet } from "./wallets";
import { atomEffect } from "jotai-effect";
import { atomWithStorage } from "jotai/utils";
import { setTransactionHistoryAtom, transactionHistoryAtom } from "./history";
import { SimpleStatus } from "@/utils/clientType";
import { errorAtom, ErrorType } from "./errorPage";

type SwapExecutionState = {
  userAddresses: UserAddress[];
  route?: RouteResponse;
  transactionDetailsArray: TransactionDetails[];
  transactionHistoryIndex: number;
  overallStatus?: SimpleStatus;
};
export type ChainAddress = {
  chainID: string;
  chainType?: "evm" | "cosmos" | "svm";
  address?: string;
} & (
    | { source?: "input" | "parent" }
    | {
      source?: "wallet";
      wallet: Pick<
        MinimalWallet,
        "walletName" | "walletPrettyName" | "walletChainType" | "walletInfo"
      >;
    }
  );

/**
 * route.requiredChainAddresses is a list of chainIDs that are required to have an address associated with them
 * the key in this atom is the index of the chainID in the requiredChainAddresses array
 */
export const chainAddressesAtom = atom<Record<number, ChainAddress>>({});

export const swapExecutionStateAtom = atomWithStorage<SwapExecutionState>(
  "swapExecutionState",
  {
    route: undefined,
    userAddresses: [],
    transactionDetailsArray: [],
    transactionHistoryIndex: 0,
    overallStatus: undefined,
  }
);

export const setOverallStatusAtom = atom(null, (_get, set, status?: SimpleStatus) => {
  set(swapExecutionStateAtom, (state) => ({ ...state, overallStatus: status }));
});

export const setSwapExecutionStateAtom = atom(null, (get, set) => {
  const { data: route } = get(skipRouteAtom);
  const transactionHistory = get(transactionHistoryAtom);
  const transactionHistoryIndex = transactionHistory.length;

  if (!route) return;

  set(swapExecutionStateAtom, {
    userAddresses: [],
    transactionDetailsArray: [],
    route,
    transactionHistoryIndex,
  });

  set(submitSwapExecutionCallbacksAtom, {
    onTransactionUpdated: (transactionDetails) => {
      set(setTransactionDetailsArrayAtom, transactionDetails, transactionHistoryIndex);
    },
    onError: (error: unknown) => {
      if ((error as Error).message === "Request rejected") {
        set(errorAtom, {
          errorType: ErrorType.AuthFailed,
          onClickBack: () => {
            set(errorAtom, undefined);
            set(setOverallStatusAtom, undefined);
          }
        });
      }
    }
  });
});

export const setTransactionDetailsArrayAtom = atom(
  null,
  (get, set, transactionDetails: TransactionDetails, transactionHistoryIndex: number) => {
    const swapExecutionState = get(swapExecutionStateAtom);
    const { transactionDetailsArray, route } = swapExecutionState;

    const newTransactionDetailsArray = transactionDetailsArray;

    const transactionIndexFound = newTransactionDetailsArray.findIndex(
      (transaction) => transaction.txHash === transactionDetails.txHash
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

    set(setTransactionHistoryAtom, transactionHistoryIndex, {
      route,
      transactionDetails: newTransactionDetailsArray,
      timestamp: Date.now(),
      status: "broadcasted",
    });
  }
);

export const chainAddressEffectAtom = atomEffect((get, set) => {
  const chainAddresses = get(chainAddressesAtom);
  if (
    !Object.values(chainAddresses).every(
      (chainAddress) => !!chainAddress.address
    )
  )
    return;
  const userAddresses = Object.values(chainAddresses).map((chainAddress) => {
    return {
      chainID: chainAddress.chainID,
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
  chainID: string;
  explorerLink?: string;
  status?: TxStatusResponse;
};

export type ClientTransactionStatus =
  | "pending"
  | "broadcasted"
  | "completed"
  | "failed";

type SubmitSwapExecutionCallbacks = {
  onTransactionUpdated?: (transactionDetails: TransactionDetails) => void;
  onError: (error: unknown) => void;
};

export const submitSwapExecutionCallbacksAtom = atom<
  SubmitSwapExecutionCallbacks | undefined
>();

export const skipSubmitSwapExecutionAtom = atomWithMutation((get) => {
  const skip = get(skipClient);
  const { route, userAddresses } = get(swapExecutionStateAtom);
  const submitSwapExecutionCallbacks = get(submitSwapExecutionCallbacksAtom);

  return {
    gcTime: Infinity,
    mutationFn: async () => {
      if (!route) return;
      if (!userAddresses.length) return;

      try {
        await skip.executeRoute({
          route,
          userAddresses,
          validateGasBalance: route.sourceAssetChainID !== "984122",
          // getFallbackGasAmount: async (chainID, chainType) => {
          //   if (chainType === "cosmos") {
          //     return Number(useSettingsStore.getState().customGasAmount);
          //   }
          // },
          onTransactionBroadcast: async (
            transactionDetails: TransactionDetails
          ) => {
            submitSwapExecutionCallbacks?.onTransactionUpdated?.(
              transactionDetails
            );
          },
          onTransactionTracked: async (
            transactionDetails: TransactionDetails
          ) => {
            submitSwapExecutionCallbacks?.onTransactionUpdated?.(
              transactionDetails
            );
          },
          onTransactionCompleted: async (chainID, txHash, status) => {
            submitSwapExecutionCallbacks?.onTransactionUpdated?.({
              chainID,
              txHash,
              status,
            });
          },
        });
      } catch (error: unknown) {
        console.error(error);
        submitSwapExecutionCallbacks?.onError?.(error);
      }
      return null;
    },
    onError: (error: unknown) => {
      console.error(error);
      submitSwapExecutionCallbacks?.onError?.(error);
    },
  };
});

export const skipTransactionStatusAtom = atomWithQuery((get) => {
  const skip = get(skipClient);
  const { transactionDetailsArray, overallStatus } = get(swapExecutionStateAtom);

  return {
    queryKey: ["skipTxStatus", transactionDetailsArray],
    queryFn: async () => {
      return Promise.all(
        transactionDetailsArray.map(async (transaction) => {
          return skip.transactionStatus({
            chainID: transaction.chainID,
            txHash: transaction.txHash,
          });
        })
      );
    },
    enabled: overallStatus !== "completed" && overallStatus !== "failed",
    refetchInterval: 1000 * 2,
    keepPreviousData: true,
  };
});
