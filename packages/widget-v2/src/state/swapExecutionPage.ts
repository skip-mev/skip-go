import { atomWithMutation, atomWithQuery } from "jotai-tanstack-query";
import { skipClient, skipRouteAtom } from "./skipClient";
import { atom } from "jotai";
import { RouteResponse, TxStatusResponse, UserAddress } from "@skip-go/client";
import { MinimalWallet } from "./wallets";
import { atomEffect } from "jotai-effect";

type SwapExecutionState = {
  userAddresses: UserAddress[];
  route?: RouteResponse;
  operationExecutionDetailsArray: OperationExecutionDetails[];
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

export const swapExecutionStateAtom = atom<SwapExecutionState>({
  route: undefined,
  userAddresses: [],
  operationExecutionDetailsArray: [],
  transactionDetailsArray: [],
});

export const setSwapExecutionStateAtom = atom(null, (get, set) => {
  const { data: route } = get(skipRouteAtom);

  if (!route) return;

  const operationExecutionDetailsArray = route.operations.map(
    (operation) =>
    ({
      status: "pending",
      txIndex: operation.txIndex,
    } as OperationExecutionDetails)
  );

  set(submitSwapExecutionCallbacksAtom, {
    onTransactionBroadcast: (
      transactionIndex,
      transactionExecutionDetails
    ) => {
      set(setOperationExecutionDetailsAtom, {
        transactionIndex,
        newOperationExecutionDetails: {
          txIndex: transactionIndex,
          status: "broadcasted",
          chainId: transactionExecutionDetails.chainID,
          explorerLink: transactionExecutionDetails.explorerLink,
          txHash: transactionExecutionDetails.txHash,
        }
      });
    },
    onTransactionTracked: (transactionIndex, transactionExecutionDetails) => {
      set(setOperationExecutionDetailsAtom, {
        transactionIndex,
        newOperationExecutionDetails: {
          txIndex: transactionIndex,
          status: "pending",
          chainId: transactionExecutionDetails.chainID,
          explorerLink: transactionExecutionDetails.explorerLink,
          txHash: transactionExecutionDetails.txHash,
        }
      });
    },
    onTransactionCompleted: (_chainID: string, txHash: string, status: TxStatusResponse) => {
      if (status.status === "STATE_COMPLETED") {
        set(setOperationExecutionDetailsAtom, {
          transactionHash: txHash,
          newOperationExecutionDetails: {
            status: "confirmed",
          }
        });
      }
    }
  });

  set(swapExecutionStateAtom, {
    userAddresses: [],
    transactionDetailsArray: [],
    route,
    operationExecutionDetailsArray,
  });
});

export const setOperationExecutionDetailsAtom = atom(
  null,
  (
    get,
    set,
    props: {
      transactionIndex?: number,
      transactionHash?: string,
      newOperationExecutionDetails: Partial<OperationExecutionDetails>
    },
  ) => {
    const { newOperationExecutionDetails, transactionHash } = props;
    let { transactionIndex } = props;

    const swapExecutionState = get(swapExecutionStateAtom);
    const { transactionDetailsArray, operationExecutionDetailsArray } = swapExecutionState;


    if (!transactionIndex) {
      const operationExecutionDetails = operationExecutionDetailsArray.find(operation => operation.txHash === transactionHash);
      if (!operationExecutionDetails) return;
      transactionIndex = operationExecutionDetails?.txIndex;
    }


    const newOperationExecutionDetailsArray = operationExecutionDetailsArray.map(operationExecutionDetails => {
      if (operationExecutionDetails.txIndex !== transactionIndex) {
        return operationExecutionDetails;
      }
      console.log(newOperationExecutionDetails);
      console.log({ ...operationExecutionDetails, ...newOperationExecutionDetails });
      return { ...operationExecutionDetails, ...newOperationExecutionDetails };
    });

    const newTransactionDetailsArray = transactionDetailsArray;
    transactionDetailsArray[transactionIndex] = {
      ...transactionDetailsArray,
      ...newOperationExecutionDetails,
      chainID: newOperationExecutionDetails.chainId,
    } as TransactionExecutionDetails;

    set(swapExecutionStateAtom, {
      ...swapExecutionState,
      transactionDetailsArray: newTransactionDetailsArray,
      operationExecutionDetailsArray: newOperationExecutionDetailsArray,
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
  txHash: string;
  chainId: string;
  explorerLink?: string;
};

export type TransactionExecutionDetails = {
  txHash: string;
  chainID: string;
  explorerLink?: string;
};

export type ClientTransactionStatus =
  | "pending"
  | "broadcasted"
  | "confirmed"
  | "failed";

type SubmitSwapExecutionCallbacks = {
  onTransactionBroadcast?: (
    transactionIndex: number,
    transactionExecutionDetails: TransactionExecutionDetails
  ) => void;
  onTransactionTracked?: (
    transactionIndex: number,
    transactionExecutionDetails: TransactionExecutionDetails
  ) => void;
  onTransactionCompleted?: (
    chainID: string,
    txHash: string,
    status: TxStatusResponse
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

      let transactionBroadcastCount = 0;
      let transactionTrackedCount = 0;

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
            console.log(submitSwapExecutionCallbacks, "broadcast");
            submitSwapExecutionCallbacks?.onTransactionBroadcast?.(
              transactionBroadcastCount,
              transactionExecutionDetails
            );
            transactionBroadcastCount++;
          },
          onTransactionTracked: async (
            transactionExecutionDetails: TransactionExecutionDetails
          ) => {
            console.log(submitSwapExecutionCallbacks, "tracked");
            submitSwapExecutionCallbacks?.onTransactionTracked?.(
              transactionTrackedCount,
              transactionExecutionDetails
            );
            transactionTrackedCount++;
          },
          onTransactionCompleted: async (...props) => {
            submitSwapExecutionCallbacks?.onTransactionCompleted?.(...props);
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

export const skipTransactionStatus = atomWithQuery((get) => {
  const skip = get(skipClient);
  const { route, transactionDetailsArray } = get(swapExecutionStateAtom);

  return {
    queryKey: ["skipTxStatus", transactionDetailsArray],
    queryFn: async () => {
      if (transactionDetailsArray.length !== route?.txsRequired) return;

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
