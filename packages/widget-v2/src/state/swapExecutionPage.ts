import { atomWithMutation } from "jotai-tanstack-query";
import { skipClient } from "@/state/skipClient";
import { skipRouteAtom } from "@/state/route";
import { atom } from "jotai";
import { TransactionCallbacks, RouteResponse, TxStatusResponse, UserAddress, ChainType } from "@skip-go/client";
import { MinimalWallet } from "./wallets";
import { atomEffect } from "jotai-effect";
import { setTransactionHistoryAtom, transactionHistoryAtom } from "./history";
import { SimpleStatus } from "@/utils/clientType";
import { errorAtom, ErrorType } from "./errorPage";
import { atomWithStorageNoCrossTabSync } from "@/utils/misc";
import { isUserRejectedRequestError } from "@/utils/error";
import { swapSettingsAtom } from "./swapPage";

type ValidatingGasBalanceData = {
  chainID?: string;
  txIndex?: number;
  status: "success" | "error" | "pending" | "completed"
}

type SwapExecutionState = {
  userAddresses: UserAddress[];
  route?: RouteResponse;
  transactionDetailsArray: TransactionDetails[];
  transactionHistoryIndex: number;
  overallStatus: SimpleStatus;
  isValidatingGasBalance?: ValidatingGasBalanceData
};


export type ChainAddress = {
  chainID: string;
  chainType?: ChainType;
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

export const swapExecutionStateAtom = atomWithStorageNoCrossTabSync<SwapExecutionState>(
  "swapExecutionState",
  {
    route: undefined,
    userAddresses: [],
    transactionDetailsArray: [],
    transactionHistoryIndex: 0,
    overallStatus: "unconfirmed",
    isValidatingGasBalance: undefined,
  }
);

export const setOverallStatusAtom = atom(null, (_get, set, status: SimpleStatus) => {
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
    overallStatus: "unconfirmed",
    isValidatingGasBalance: undefined,
  });

  set(submitSwapExecutionCallbacksAtom, {
    onTransactionUpdated: (transactionDetails) => {
      if (!transactionDetails.isTxCompleted) {
        set(setTransactionDetailsArrayAtom, transactionDetails, transactionHistoryIndex);
      }
    },
    onTransactionSigned: async (transactionDetails) => {
      set(setTransactionDetailsArrayAtom, { ...transactionDetails, explorerLink: undefined, status: undefined }, transactionHistoryIndex);
    },
    onError: (error: unknown, transactionDetailsArray) => {
      const lastTransaction = transactionDetailsArray?.[transactionDetailsArray?.length - 1];
      if (isUserRejectedRequestError(error)) {
        set(errorAtom, {
          errorType: ErrorType.AuthFailed,
          onClickBack: () => {
            set(setOverallStatusAtom, "unconfirmed");
          }
        });
      } else if (lastTransaction?.explorerLink) {
        set(errorAtom, {
          errorType: ErrorType.TransactionFailed,
          onClickBack: () => {
            set(setOverallStatusAtom, "unconfirmed");
          },
          explorerLink: lastTransaction?.explorerLink ?? "",
          transactionHash: lastTransaction?.txHash ?? "",
          onClickContactSupport: () => {
            window.open("https://skip.build/discord", "_blank");
          }
        });
      } else {
        set(errorAtom, {
          errorType: ErrorType.Unexpected,
          error: error as Error,
          onClickBack: () => {
            set(setOverallStatusAtom, "unconfirmed");
          },
        });
      }
    },
    onValidateGasBalance: async (props) => {
      set(setValidatingGasBalanceAtom, props);
    },
  });
});

export const setValidatingGasBalanceAtom = atom(null, (_get, set, isValidatingGasBalance: ValidatingGasBalanceData) => {
  set(swapExecutionStateAtom, (state) => ({ ...state, isValidatingGasBalance }));
});

export const setTransactionDetailsArrayAtom = atom(
  null,
  (get, set, transactionDetails: TransactionDetails, transactionHistoryIndex: number) => {
    const swapExecutionState = get(swapExecutionStateAtom);
    const { transactionDetailsArray, route } = swapExecutionState;

    const newTransactionDetailsArray = transactionDetailsArray;

    const transactionIndexFound = newTransactionDetailsArray.findIndex(
      (transaction) => transaction.txHash.toLowerCase() === transactionDetails.txHash.toLowerCase()
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
      status: "unconfirmed",
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
  isTxCompleted?: boolean;
};

type SubmitSwapExecutionCallbacks = {
  onTransactionUpdated?: (transactionDetails: TransactionDetails) => void;
  onError: (error: unknown, transactionDetailsArray?: TransactionDetails[]) => void;
  onValidateGasBalance?: TransactionCallbacks["onValidateGasBalance"];
  onTransactionSigned?: TransactionCallbacks["onTransactionSigned"];
};

export const submitSwapExecutionCallbacksAtom = atom<
  SubmitSwapExecutionCallbacks | undefined
>();

export const skipSubmitSwapExecutionAtom = atomWithMutation((get) => {
  const skip = get(skipClient);
  const { route, userAddresses, transactionDetailsArray } = get(swapExecutionStateAtom);
  const submitSwapExecutionCallbacks = get(submitSwapExecutionCallbacksAtom);
  const swapSettings = get(swapSettingsAtom);

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
          getFallbackGasAmount: async (_chainID, chainType) => {
            if (chainType === "cosmos") {
              return swapSettings.customGasAmount;
            }
          },
          onValidateGasBalance: async (props) => {
            submitSwapExecutionCallbacks?.onValidateGasBalance?.(
              props
            );
          },
          onTransactionSigned: async (props) => {
            submitSwapExecutionCallbacks?.onTransactionSigned?.(
              props
            );
          },
          onTransactionCompleted: async (chainID, txHash, status) => {
            submitSwapExecutionCallbacks?.onTransactionUpdated?.({
              chainID,
              txHash,
              status,
              isTxCompleted: true,
            });
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
