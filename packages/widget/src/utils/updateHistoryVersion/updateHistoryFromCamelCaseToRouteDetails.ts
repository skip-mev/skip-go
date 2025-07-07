/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { HISTORY_VERSION, transactionHistoryVersionAtom } from "@/state/history";
import { LOCAL_STORAGE_KEYS } from "@/state/localStorageKeys";
import { jotaiStore } from "@/widget/Widget";
import { Route, TxStatusResponse, TransferAssetRelease, TransactionState } from "@skip-go/client";
import { v4 as uuidv4 } from "uuid";

export const updateHistoryFromCamelCaseToRouteDetails = () => {
  const { set } = jotaiStore;

  try {
    const transactionHistoryVersion: number = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEYS.transactionHistoryVersion) ?? "0",
    );
    const transactionHistory: TransactionHistoryItem[] = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEYS.transactionHistory) ?? "[]",
    );
    if (!transactionHistory) {
      throw new Error("transactionHistory not found in localStorage");
    }

    if (transactionHistoryVersion === HISTORY_VERSION.camelCase) {
      const updatedTransactionHistory = transactionHistory.map(
        (txHistoryItem: TransactionHistoryItem) => {
          return {
            id: uuidv4(),
            timestamp: txHistoryItem.timestamp,
            route: getSimpleRoute(txHistoryItem.route),
            status: txHistoryItem.status,
            txsRequired: txHistoryItem.route?.txsRequired,
            txsSigned: txHistoryItem.signatures,
            transactionDetails: getTransactionDetailsWithSimpleTransactionDetailsStatus(
              txHistoryItem.transactionDetails,
            ),
            transferEvents: txHistoryItem.transferEvents,
            transferAssetRelease:
              txHistoryItem.transferAssetRelease ??
              txHistoryItem.transactionDetails?.at(-1)?.status?.transferAssetRelease,
          };
        },
      );

      localStorage.setItem(
        LOCAL_STORAGE_KEYS.transactionHistory,
        JSON.stringify(updatedTransactionHistory),
      );
      console.info(
        `updated from transactionHistoryVersion ${HISTORY_VERSION.camelCase} to ${HISTORY_VERSION.routeDetails}`,
      );
      set(transactionHistoryVersionAtom, HISTORY_VERSION.routeDetails);
    }
  } catch {
    console.warn(
      `Failed to update transactionHistoryVersion from ${HISTORY_VERSION.camelCase} to ${HISTORY_VERSION.routeDetails}`,
    );
  }
};

// history item HISTORY_VERSION.camelCase aka version 0
export type TransactionHistoryItem = {
  route: Route;
  timestamp: number;
  status: any;
  signatures: number;
  isSuccess: boolean;
  isSettled: boolean;
  transactionDetails: {
    chainId: string;
    txHash?: string;
    status?: TxStatusResponse;
    explorerLink?: string;
  }[];
  transferEvents: any[];
  lastTxStatus?: any;
  transferAssetRelease?: TransferAssetRelease;
};

const getSimpleRoute = (route?: Route) => {
  return {
    amountIn: route?.amountIn,
    amountOut: route?.amountOut,
    sourceAssetDenom: route?.sourceAssetDenom,
    sourceAssetChainId: route?.sourceAssetChainId,
    destAssetDenom: route?.destAssetDenom,
    destAssetChainId: route?.destAssetChainId,
    estimatedRouteDurationSeconds: route?.estimatedRouteDurationSeconds,
  };
};

const getTransactionStatus = (state?: TransactionState) => {
  switch (state) {
    case "STATE_SUBMITTED":
    case "STATE_PENDING":
      return "pending";
    case "STATE_COMPLETED_SUCCESS":
      return "success";
    case "STATE_COMPLETED_ERROR":
    case "STATE_PENDING_ERROR":
      return "failed";
    default:
      return "pending";
  }
};

const getTransactionDetailsWithSimpleTransactionDetailsStatus = (
  transactionDetails: {
    chainId: string;
    txHash?: string;
    status?: TxStatusResponse;
    explorerLink?: string;
  }[],
) => {
  return transactionDetails.map((txDetails) => {
    return {
      ...txDetails,
      status: getTransactionStatus(txDetails.status?.state),
    };
  });
};
