import { atomWithMutation, atomWithQuery } from "jotai-tanstack-query";
import { skipClient, skipRouteAtom } from "./skipClient";
import { atom } from "jotai";
import { RouteResponse, TxStatusResponse, UserAddress } from "@skip-go/client";
import { MinimalWallet } from "./wallets";
import { atomEffect } from "jotai-effect";
import { atomWithStorage } from "jotai/utils";

type SwapExecutionState = {
  userAddresses: UserAddress[];
  route?: RouteResponse;
  transactionDetailsArray: TransactionExecutionDetails[];
};
export type ChainAddress = {
  chainID: string;
  operationIndex?: number;
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
  }
);

export const transferEventsAtom = atom();

export const setSwapExecutionStateAtom = atom(null, (get, set) => {
  const { data: route } = get(skipRouteAtom);

  if (!route) return;

  set(swapExecutionStateAtom, {
    userAddresses: [],
    transactionDetailsArray: [],
    route,
  });

  set(submitSwapExecutionCallbacksAtom, {
    onTransactionUpdated: (transactionExecutionDetails) => {
      set(setTransactionDetailsArrayAtom, transactionExecutionDetails);
    },
  });
});

export const setTransactionDetailsArrayAtom = atom(
  null,
  (get, set, transactionExecutionDetails: TransactionExecutionDetails) => {
    const swapExecutionState = get(swapExecutionStateAtom);
    const { transactionDetailsArray } = swapExecutionState;

    const newTransactionDetailsArray = transactionDetailsArray;

    const transactionIndexFound = newTransactionDetailsArray.findIndex(
      (transaction) => transaction.txHash === transactionExecutionDetails.txHash
    );
    if (transactionIndexFound !== -1) {
      newTransactionDetailsArray[transactionIndexFound] = {
        ...newTransactionDetailsArray[transactionIndexFound],
        ...transactionExecutionDetails,
      };
    } else {
      newTransactionDetailsArray.push(transactionExecutionDetails);
    }

    set(swapExecutionStateAtom, {
      ...swapExecutionState,
      transactionDetailsArray: newTransactionDetailsArray,
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

export type OperationExecutionDetails = {
  status: ClientTransactionStatus;
  txIndex: number;
  txHash?: string;
  chainID?: string;
  explorerLink?: string;
};

export type TransactionExecutionDetails = {
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
  onTransactionUpdated?: (
    transactionExecutionDetails: TransactionExecutionDetails
  ) => void;
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
            transactionExecutionDetails: TransactionExecutionDetails
          ) => {
            submitSwapExecutionCallbacks?.onTransactionUpdated?.(
              transactionExecutionDetails
            );
          },
          onTransactionTracked: async (
            transactionExecutionDetails: TransactionExecutionDetails
          ) => {
            submitSwapExecutionCallbacks?.onTransactionUpdated?.(
              transactionExecutionDetails
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
      } catch (error) {
        console.error(error);
      }
      return null;
    },
    onError: (err: unknown) => {
      // handle errors;
      console.error(err);
    },
  };
});

export const skipTransactionStatusAtom = atomWithQuery((get) => {
  const skip = get(skipClient);
  const { transactionDetailsArray } = get(swapExecutionStateAtom);

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
    enabled: true,
    refetchInterval: 1000 * 2,
    keepPreviousData: true,
  };
});
