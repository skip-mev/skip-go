import { atomWithMutation } from "jotai-tanstack-query";
import { skipChainsAtom, skipClient, skipSwapVenuesAtom } from "@/state/skipClient";
import { skipRouteAtom } from "@/state/route";
import { atom } from "jotai";
import {
  TransactionCallbacks,
  RouteResponse,
  TxStatusResponse,
  UserAddress,
  ChainType,
} from "@skip-go/client";
import { MinimalWallet } from "./wallets";
import { atomEffect } from "jotai-effect";
import { setTransactionHistoryAtom, transactionHistoryAtom } from "./history";
import { SimpleStatus } from "@/utils/clientType";
import { errorAtom, ErrorType } from "./errorPage";
import { atomWithStorageNoCrossTabSync } from "@/utils/misc";
import { isUserRejectedRequestError } from "@/utils/error";
import { CosmosGasAmount, slippageAtom } from "./swapPage";
import { createExplorerLink } from "@/utils/explorerLink";
import { callbacksAtom } from "./callbacks";
import { setUser } from "@sentry/react";

type ValidatingGasBalanceData = {
  chainID?: string;
  txIndex?: number;
  status: "success" | "error" | "pending" | "completed";
};

type SwapExecutionState = {
  userAddresses: UserAddress[];
  route?: RouteResponse;
  transactionDetailsArray: TransactionDetails[];
  transactionHistoryIndex: number;
  overallStatus: SimpleStatus;
  isValidatingGasBalance?: ValidatingGasBalanceData;
};

export type ChainAddress = {
  chainID: string;
  chainType?: ChainType;
  address?: string;
} & {
  source?: "wallet" | "input" | "parent" | "injected";
  wallet?: Pick<
    MinimalWallet,
    "walletName" | "walletPrettyName" | "walletChainType" | "walletInfo"
  >;
};

/**
 * route.requiredChainAddresses is a list of chainIDs that are required to have an address associated with them
 * the key in this atom is the index of the chainID in the requiredChainAddresses array
 */
export const chainAddressesAtom = atom<Record<number, ChainAddress>>({});

export const setUserAddressAtom = atom(
  null,
  (_get, set, userAddress: UserAddress, index: number) => {
    set(swapExecutionStateAtom, (state) => {
      const newUserAddress = [...state.userAddresses];
      if (index > -1) {
        newUserAddress[index] = userAddress;
        console.log("update user address", newUserAddress);
      }
      return { ...state, userAddresses: newUserAddress };
    });
  },
);

export const swapExecutionStateAtom = atomWithStorageNoCrossTabSync<SwapExecutionState>(
  "swapExecutionState",
  {
    route: undefined,
    userAddresses: [],
    transactionDetailsArray: [],
    transactionHistoryIndex: 0,
    overallStatus: "unconfirmed",
    isValidatingGasBalance: undefined,
  },
);

export const setOverallStatusAtom = atom(null, (_get, set, status: SimpleStatus) => {
  set(swapExecutionStateAtom, (state) => ({ ...state, overallStatus: status }));
});

export const setSwapExecutionStateAtom = atom(null, (get, set) => {
  const { data: route } = get(skipRouteAtom);
  const { data: chains } = get(skipChainsAtom);
  const transactionHistory = get(transactionHistoryAtom);
  const callbacks = get(callbacksAtom);
  const transactionHistoryIndex = transactionHistory.length;

  if (!route) return;

  const {
    requiredChainAddresses,
    sourceAssetDenom,
    sourceAssetChainID,
    destAssetDenom,
    destAssetChainID,
  } = route;

  const sourceAddress = requiredChainAddresses[0];
  const destinationAddress = requiredChainAddresses[requiredChainAddresses.length - 1];

  set(swapExecutionStateAtom, {
    userAddresses: route?.requiredChainAddresses.map((chainId) => ({
      chainID: chainId,
      address: "",
    })),
    transactionDetailsArray: [],
    route,
    transactionHistoryIndex,
    overallStatus: "unconfirmed",
    isValidatingGasBalance: undefined,
  });
  set(submitSwapExecutionCallbacksAtom, {
    onTransactionUpdated: (txInfo) => {
      if (txInfo.status?.status !== "STATE_COMPLETED") {
        set(setTransactionDetailsAtom, txInfo, transactionHistoryIndex);
      }
    },
    onApproveAllowance: async ({ status, allowance }) => {
      if (allowance && status === "pending") {
        set(setOverallStatusAtom, "approving");
      }
    },
    onTransactionBroadcast: async (txInfo) => {
      setUser({ id: txInfo?.txHash });
      const chain = chains?.find((chain) => chain.chainID === txInfo.chainID);
      const explorerLink = createExplorerLink({
        chainID: txInfo.chainID,
        chainType: chain?.chainType,
        txHash: txInfo.txHash,
      });
      set(
        setTransactionDetailsAtom,
        { ...txInfo, explorerLink, status: undefined },
        transactionHistoryIndex,
      );
      callbacks?.onTransactionBroadcasted?.({
        chainId: txInfo.chainID,
        txHash: txInfo.txHash,
        explorerLink: explorerLink ?? "",
        sourceAddress,
        destinationAddress,
        sourceAssetDenom,
        sourceAssetChainID,
        destAssetDenom,
        destAssetChainID,
      });
    },
    onTransactionCompleted: async (chainId: string, txHash: string) => {
      const chain = chains?.find((chain) => chain.chainID === chainId);
      const explorerLink = createExplorerLink({
        chainID: chainId,
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
        sourceAssetChainID,
        destAssetDenom,
        destAssetChainID,
      });
    },
    onTransactionSigned: async () => {
      set(setOverallStatusAtom, "pending");
    },
    onError: (error: unknown, transactionDetailsArray) => {
      callbacks?.onTransactionFailed?.({
        error: (error as Error)?.message,
      });

      const lastTransaction = transactionDetailsArray?.[transactionDetailsArray?.length - 1];
      if (isUserRejectedRequestError(error)) {
        set(errorAtom, {
          errorType: ErrorType.AuthFailed,
          onClickBack: () => {
            set(setOverallStatusAtom, "unconfirmed");
          },
        });
      } else if (lastTransaction?.explorerLink) {
        set(errorAtom, {
          errorType: ErrorType.TransactionFailed,
          onClickBack: () => {
            set(setOverallStatusAtom, "unconfirmed");
          },
          explorerLink: lastTransaction?.explorerLink ?? "",
          txHash: lastTransaction?.txHash ?? "",
          onClickContactSupport: () => {
            window.open("https://skip.build/discord", "_blank");
          },
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

export const setValidatingGasBalanceAtom = atom(
  null,
  (_get, set, isValidatingGasBalance: ValidatingGasBalanceData) => {
    set(swapExecutionStateAtom, (state) => ({ ...state, isValidatingGasBalance }));
  },
);

export const setTransactionDetailsAtom = atom(
  null,
  (get, set, transactionDetails: TransactionDetails, transactionHistoryIndex: number) => {
    const swapExecutionState = get(swapExecutionStateAtom);
    const { transactionDetailsArray, route } = swapExecutionState;

    const newTransactionDetailsArray = transactionDetailsArray;

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

    set(setTransactionHistoryAtom, transactionHistoryIndex, {
      route,
      transactionDetails: newTransactionDetailsArray,
      timestamp: Date.now(),
      status: "unconfirmed",
    });
  },
);

export type TransactionDetails = {
  txHash: string;
  chainID: string;
  explorerLink?: string;
  status?: TxStatusResponse;
};

type SubmitSwapExecutionCallbacks = TransactionCallbacks & {
  onTransactionUpdated?: (transactionDetails: TransactionDetails) => void;
  onError: (error: unknown, transactionDetailsArray?: TransactionDetails[]) => void;
};

export const submitSwapExecutionCallbacksAtom = atom<SubmitSwapExecutionCallbacks | undefined>();

export const fallbackGasAmountFnAtom = atom((get) => {
  const swapVenues = get(skipSwapVenuesAtom)?.data;

  return async (chainId: string, chainType: ChainType): Promise<number | undefined> => {
    if (chainType !== ChainType.Cosmos) return undefined;

    const isSwapChain = swapVenues?.some((venue) => venue.chainID === chainId) ?? false;
    const defaultGasAmount = Math.ceil(
      isSwapChain ? CosmosGasAmount.SWAP : CosmosGasAmount.DEFAULT,
    );

    // Special case for carbon-1
    if (chainId === "carbon-1") {
      return CosmosGasAmount.CARBON;
    }

    return defaultGasAmount;
  };
});

export const simulateTxAtom = atom<boolean>();

export const skipSubmitSwapExecutionAtom = atomWithMutation((get) => {
  const skip = get(skipClient);
  const { route, userAddresses, transactionDetailsArray } = get(swapExecutionStateAtom);
  const submitSwapExecutionCallbacks = get(submitSwapExecutionCallbacksAtom);
  const slippage = get(slippageAtom);
  const getFallbackGasAmount = get(fallbackGasAmountFnAtom);
  const simulateTx = get(simulateTxAtom);

  return {
    gcTime: Infinity,
    mutationFn: async () => {
      if (!route) return;
      if (!userAddresses.length) return;

      try {
        console.log(userAddresses);
        await skip.executeRoute({
          route,
          userAddresses,
          slippageTolerancePercent: slippage.toString(),
          simulate: simulateTx !== undefined ? simulateTx : route.sourceAssetChainID !== "984122",
          getFallbackGasAmount,
          ...submitSwapExecutionCallbacks,
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
