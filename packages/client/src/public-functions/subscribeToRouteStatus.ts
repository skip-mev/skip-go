import { wait } from "../utils/timer";
import {
  transactionStatus,
  type TxStatusResponse,
} from "../api/postTransactionStatus";
import type {
  Route,
  TransactionState,
  TransferAssetRelease,
  TransferStatus,
} from "../types/swaggerTypes";
import {
  getTransferEventsFromTxStatusResponse,
  type ClientTransferEvent,
} from "../utils/clientType";
import type { ExecuteRouteOptions } from "./executeRoute";
import { trackTransaction } from "../api/postTrackTransaction";
import type { TxResult, UserAddress } from "src/types";
import { v4 as uuidv4 } from 'uuid';

export type RouteStatus = "unconfirmed" | "validating" | "allowance" | "signing" | "pending" | "completed" | "incomplete" | "failed";

export type TransactionStatus = "pending" | "success" | "failed";

export type TransactionDetails = {
  chainId: string;
  txHash?: string;
  status?: TransactionStatus;
  statusResponse?: TxStatusResponse;
  explorerLink?: string;
};

type SimpleRoute = {
  amountIn?: Route["amountIn"];
  amountOut?: Route["amountOut"];
  sourceAssetDenom?: Route["sourceAssetDenom"];
  sourceAssetChainId?: Route["sourceAssetChainId"];
  destAssetDenom?: Route["destAssetDenom"];
  destAssetChainId?: Route["destAssetChainId"];
  estimatedRouteDurationSeconds?: Route["estimatedRouteDurationSeconds"];
}

export type RouteDetails = {
  id: string;
  timestamp: number;
  status: RouteStatus;
  route: SimpleRoute;
  txsRequired: number;
  txsSigned: number;
  transactionDetails: TransactionDetails[];
  transferEvents: ClientTransferEvent[];
  transferAssetRelease?: TransferAssetRelease;
  senderAddress: string;
  receiverAddress: string;
};

export function getTransactionStatus(state?: TransactionState): TransactionStatus {
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
}

const isFinalState = (state?: string): boolean => {
  return (
    state === "STATE_COMPLETED_SUCCESS" ||
    state === "STATE_COMPLETED_ERROR" ||
    state === "STATE_ABANDONED"
  );
};

const isFinalTransactionStatus = (status?: TransactionStatus) => {
  return (
    status === "failed" || status === "success"
  )
}

export type subscribeToRouteStatusProps = {
  routeDetails?: RouteDetails;
  onRouteStatusUpdated?: ExecuteRouteOptions["onRouteStatusUpdated"];
};

export type executeAndSubscribeToRouteStatusProps = {
  routeDetails?: RouteDetails;
  transactionDetails?: TransactionDetails[];
  trackTxPollingOptions?: ExecuteRouteOptions["trackTxPollingOptions"];
  onRouteStatusUpdated?: ExecuteRouteOptions["onRouteStatusUpdated"];
  executeTransaction?: (index: number) => Promise<TxResult>;
  onTransactionTracked?: ExecuteRouteOptions["onTransactionTracked"];
  onTransactionCompleted?: ExecuteRouteOptions["onTransactionCompleted"];
  options?: ExecuteRouteOptions;
};

let currentRouteDetails = {
  status: "unconfirmed" as RouteStatus,
  txsSigned: 0,
  transactionDetails: [] as TransactionDetails[],
  transferEvents: [] as ClientTransferEvent[],
} as RouteDetails;

const resetCurrentRouteDetails = (options?: ExecuteRouteOptions) => {
  currentRouteDetails = {
    status: "unconfirmed" as RouteStatus,
    id: uuidv4(),
    timestamp: Date.now(),
    txsRequired: options?.route?.txsRequired,
    txsSigned: 0,
    transactionDetails: [] as TransactionDetails[],
    transferEvents: [] as ClientTransferEvent[],
  } as RouteDetails;
}

export const subscribeToRouteStatus = async (props: subscribeToRouteStatusProps) => {
  return executeAndSubscribeToRouteStatus(props);
};

export const executeAndSubscribeToRouteStatus = async ({
  transactionDetails,
  executeTransaction,
  trackTxPollingOptions,
  onTransactionTracked,
  onTransactionCompleted,
  routeDetails,
  options,
}: executeAndSubscribeToRouteStatusProps) => {
  transactionDetails ??= routeDetails?.transactionDetails ?? currentRouteDetails?.transactionDetails;

  for (const [transactionIndex, transaction] of transactionDetails.entries()) {
    if (executeTransaction && !transaction.txHash) {
      let { txHash, explorerLink } = await executeTransaction?.(transactionIndex);
      transaction.txHash = txHash;
      if (!explorerLink) {
        const trackResponse = await trackTransaction({
          chainId: transaction.chainId,
          txHash: transaction.txHash,
          ...trackTxPollingOptions,
        });
        explorerLink = trackResponse.explorerLink;
      }

      transaction.explorerLink = explorerLink;
      await onTransactionTracked?.({ txHash: transaction.txHash, chainId: transaction.chainId, explorerLink });
    }

    if (transaction.txHash === undefined) {
      throw new Error("subscribeToRouteStatus error: txHash is undefined");
    }

    if (isFinalTransactionStatus(transaction.status) || isFinalState(transaction.statusResponse?.state)) {
      updateRouteDetails({
        transactionDetails,
        options
      });
      continue;
    }

    while (true) {
      try {
        const statusResponse = await transactionStatus({
          chainId: transaction.chainId,
          txHash: transaction.txHash,
        });

        transaction.statusResponse = statusResponse;

        updateRouteDetails({
          transactionDetails,
          options
        });

        if (isFinalState(statusResponse.state)) {
          onTransactionCompleted?.({
            chainId: transaction.chainId,
            txHash: transaction.txHash,
            status: statusResponse as TransferStatus,
          });
          break;
        }
      } catch (error) {
        console.error(error);
      } finally {
        await wait(1000);
      }
    }
  }
};

type updateRouteDetailsProps = {
  routeDetails?: RouteDetails;
  transactionDetails?: TransactionDetails[];
  options?: ExecuteRouteOptions;
  status?: RouteStatus;
  initialize?: boolean;
}

export const updateRouteDetails = ({
  transactionDetails,
  routeDetails,
  options,
  status,
  initialize,
}: updateRouteDetailsProps): RouteDetails => {
  if (initialize) {
    resetCurrentRouteDetails(options);
  }

  transactionDetails ??= routeDetails?.transactionDetails ?? currentRouteDetails?.transactionDetails;
  const txsRequired = routeDetails?.txsRequired ?? options?.route?.txsRequired ?? Infinity;

  if (currentRouteDetails.status === "signing" && status === "pending") {
    currentRouteDetails.txsSigned += 1;
  }

  const validStatuses = transactionDetails
    .map((tx) => tx.statusResponse)
    .filter((status): status is TxStatusResponse => status !== undefined);

  const transferEvents = getTransferEventsFromTxStatusResponse(validStatuses);

  const allTransactionsHaveDetails = transactionDetails.length >= txsRequired;
  const allKnownDetailsHaveFinalStatus = transactionDetails.every(
    (tx) => tx.statusResponse && isFinalState(tx.statusResponse?.state),
  );

  const isAllSettled = allTransactionsHaveDetails && allKnownDetailsHaveFinalStatus;

  const someTxSucceeded = validStatuses.some(
    (status) => isFinalState(status.state) && status.state === "STATE_COMPLETED_SUCCESS",
  );

  const someTxFailed = validStatuses.some(
    (status) => isFinalState(status.state) && status.state !== "STATE_COMPLETED_SUCCESS",
  );

  const getRouteStatus = () => {
    if (status) return status;
    if (isAllSettled) {
      if (!someTxFailed) {
        return "completed";
      } else if (someTxSucceeded && someTxFailed) {
        return "incomplete";
      } else if (someTxFailed) {
        return "failed";
      }
    }
    return currentRouteDetails?.status;
  }

  const transferAssetRelease = validStatuses?.at(-1)?.transferAssetRelease;

  const senderAddress = options?.userAddresses?.at(0);
  const receiverAddress = options?.userAddresses?.at(-1);

  const newRouteDetails: RouteDetails = {
    id: routeDetails?.id ?? currentRouteDetails.id,
    timestamp: routeDetails?.timestamp ?? currentRouteDetails.timestamp,
    status: getRouteStatus(),
    route: getSimpleRoute(routeDetails?.route ?? options?.route),
    txsRequired,
    transactionDetails,
    transferEvents,
    transferAssetRelease,
    senderAddress: routeDetails?.senderAddress ?? senderAddress?.address ?? '',
    receiverAddress: routeDetails?.receiverAddress ?? receiverAddress?.address ?? '',
    txsSigned: routeDetails?.txsSigned ?? currentRouteDetails.txsSigned,
  };

  const newRouteStatus = getRouteDetailsWithSimpleTransactionDetailsStatus(newRouteDetails)

  const previousRouteStatus = getRouteDetailsWithSimpleTransactionDetailsStatus(currentRouteDetails)

  if (options?.onRouteStatusUpdated && JSON.stringify(newRouteStatus) !== JSON.stringify(previousRouteStatus)) {
    options?.onRouteStatusUpdated?.(newRouteStatus);
  }

  currentRouteDetails = newRouteDetails;

  return newRouteDetails;
};

const getSimpleRoute = (route?: Route | SimpleRoute): SimpleRoute => {
  return {
    amountIn: route?.amountIn,
    amountOut: route?.amountOut,
    sourceAssetDenom: route?.sourceAssetDenom,
    sourceAssetChainId: route?.sourceAssetChainId,
    destAssetDenom: route?.destAssetDenom,
    destAssetChainId: route?.destAssetChainId,
    estimatedRouteDurationSeconds: route?.estimatedRouteDurationSeconds,
  }
}

const getRouteDetailsWithSimpleTransactionDetailsStatus = (routeDetails: RouteDetails) => {
  return {
    ...routeDetails,
    transactionDetails: routeDetails.transactionDetails.map(txDetails => {
      const { statusResponse, ...rest } = txDetails;
      return {
        ...rest,
        status: getTransactionStatus(txDetails.statusResponse?.state),
      }
    })
  };
}