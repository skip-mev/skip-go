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

export const swapExecutionStateAtom = atomWithStorage<SwapExecutionState>("swapExecutionState", {
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
      txIndex: operation.txIndex,
      explorerLink: undefined,
    } as OperationExecutionDetails)
  );

  set(swapExecutionStateAtom, {
    userAddresses: [],
    transactionDetailsArray: [],
    route,
    operationExecutionDetailsArray,
  });

  set(submitSwapExecutionCallbacksAtom, {
    onTransactionBroadcast: (
      transactionIndex,
      transactionExecutionDetails
    ) => {
      console.log("broadcasted");
      set(setOperationExecutionDetailsAtom, {
        transactionIndex,
        status: "broadcasted",
        transactionExecutionDetails
      });
    },
    onTransactionTracked: (transactionIndex, transactionExecutionDetails) => {
      console.log("tracked");
      set(setOperationExecutionDetailsAtom, {
        transactionIndex,
        status: "pending",
        transactionExecutionDetails
      });
    },
    onTransactionCompleted: (_chainID: string, txHash: string, status: TxStatusResponse) => {
      console.log(txHash, status);
      if (status.status === "STATE_COMPLETED") {
        console.log("transaction completed");
        set(setOperationExecutionDetailsAtom, {
          transactionHash: txHash,
          status: "confirmed",
        });
      }
    }
  });
});

export const setOperationExecutionDetailsAtom = atom(
  null,
  (
    get,
    set,
    props: {
      status: ClientTransactionStatus,
      transactionIndex?: number,
      transactionHash?: string,
      transactionExecutionDetails?: Partial<TransactionExecutionDetails>
    },
  ) => {
    const swapExecutionState = get(swapExecutionStateAtom);
    const { transactionDetailsArray, operationExecutionDetailsArray } = swapExecutionState;
    const { transactionHash, transactionExecutionDetails, status } = props;
    const { transactionIndex } = props;

    const newOperationExecutionDetailsArray = operationExecutionDetailsArray.map(operationExecutionDetails => {
      if (operationExecutionDetails.txIndex === transactionIndex || operationExecutionDetails.txHash === transactionHash) {
        operationExecutionDetails.status = status;
        switch (status) {
          case "pending":
          case "broadcasted":
            operationExecutionDetails.txHash = transactionExecutionDetails?.txHash;
            operationExecutionDetails.chainID = transactionExecutionDetails?.chainID;
            operationExecutionDetails.explorerLink = transactionExecutionDetails?.explorerLink;
            break;
          case "confirmed":
          default:
            break;
        }
      }

      return operationExecutionDetails;
    });


    // if (!transactionIndex) {
    //   const operationExecutionDetails = operationExecutionDetailsArray.find(operation => operation.txHash === transactionHash);
    //   if (operationExecutionDetails?.txIndex) {
    //     transactionDetailsArray[operationExecutionDetails?.txIndex] = {
    //       ...transactionDetailsArray[operationExecutionDetails?.txIndex],
    //       ...transactionExecutionDetails,
    //     } as TransactionExecutionDetails;
    //   }
    // }

    console.log(newOperationExecutionDetailsArray, transactionDetailsArray);
    set(swapExecutionStateAtom, {
      ...swapExecutionState,
      transactionDetailsArray: transactionDetailsArray,
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
  txHash?: string;
  chainID?: string;
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
            submitSwapExecutionCallbacks?.onTransactionBroadcast?.(
              transactionBroadcastCount,
              transactionExecutionDetails
            );
            transactionBroadcastCount++;
          },
          onTransactionTracked: async (
            transactionExecutionDetails: TransactionExecutionDetails
          ) => {
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
