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
import type { TxResult } from "src/types";
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

const isFinalState = (transaction?: TransactionDetails): boolean => {
  const transactionState = transaction?.statusResponse?.state;
  const transactionStatus = transaction?.status;

  return (
    transactionState === "STATE_COMPLETED_SUCCESS" ||
    transactionState === "STATE_COMPLETED_ERROR" ||
    transactionState === "STATE_ABANDONED" ||
    transactionStatus === "failed" ||
    transactionStatus === "success"
  );
};

const isSuccessState = (transaction?: TransactionDetails): boolean => {
  const transactionState = transaction?.statusResponse?.state;
  const transactionStatus = transaction?.status;
  return (
    transactionState === "STATE_COMPLETED_SUCCESS" ||
    transactionStatus === "success"
  );
}

export type subscribeToRouteStatusProps = {
  routeDetails?: RouteDetails;
  onRouteStatusUpdated?: ExecuteRouteOptions["onRouteStatusUpdated"];
  unsubscribe?: () => void;
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
  routeId?: string;
  isCancelled?: () => boolean;
};

const routeDetailsMap = new Map<string, RouteDetails>();

const initializeNewRouteDetails = (options?: Partial<ExecuteRouteOptions>) => {
  const newRouteId = uuidv4();
  const newRouteDetails = {
    id: newRouteId,
    timestamp: Date.now(),
    route: getSimpleRoute(options?.route),
    status: "unconfirmed" as RouteStatus,
    txsRequired: options?.route?.txsRequired ?? 1,
    txsSigned: 0,
    transactionDetails: [],
    transferEvents: [],
    senderAddress: options?.userAddresses?.[0]?.address ?? '',
    receiverAddress: options?.userAddresses?.at(-1)?.address ?? '',
  };
  routeDetailsMap.set(newRouteId, newRouteDetails);
  return newRouteDetails;
}

export const subscribeToRouteStatus = (props: subscribeToRouteStatusProps) => {
  let cancelled = false;

  const unsubscribe = () => {
    cancelled = true;
  };

  executeAndSubscribeToRouteStatus({
    ...props,
    isCancelled: () => cancelled,
  });

  return unsubscribe;
};

export const executeAndSubscribeToRouteStatus = async ({
  transactionDetails,
  executeTransaction,
  trackTxPollingOptions,
  onTransactionTracked,
  onTransactionCompleted,
  routeDetails,
  onRouteStatusUpdated,
  options,
  routeId,
  isCancelled,
}: executeAndSubscribeToRouteStatusProps) => {
  removeCompletedRoutes();

  routeId ??= routeDetails?.id;
  const currentRouteDetails = routeDetailsMap.get(routeId ?? '');
  transactionDetails ??= routeDetails?.transactionDetails ?? currentRouteDetails?.transactionDetails ?? [];

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

    while (!isFinalState(transaction)) {
      if (isCancelled?.()) {
        console.info(`Polling cancelled for route ${routeId}`);
        return;
      }
      try {
        const statusResponse = await transactionStatus({
          chainId: transaction.chainId,
          txHash: transaction.txHash,
        });

        transaction.statusResponse = statusResponse;

        updateRouteDetails({
          routeId,
          routeDetails,
          transactionDetails,
          options: {
            onRouteStatusUpdated,
            ...options,
          }
        });

        if (isFinalState(transaction)) {
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
  options?: Partial<ExecuteRouteOptions>;
  status?: RouteStatus;
  routeId?: string;
}

export const updateRouteDetails = ({
  transactionDetails,
  routeDetails,
  options,
  status,
  routeId,
}: updateRouteDetailsProps): RouteDetails => {
  routeId ??= routeDetails?.id ?? '';
  let currentRouteDetails = routeDetailsMap.get(routeId);
  if (currentRouteDetails == undefined) {
    currentRouteDetails = initializeNewRouteDetails(options);
    routeId = currentRouteDetails.id;
  }

  transactionDetails ??= routeDetails?.transactionDetails ?? currentRouteDetails?.transactionDetails ?? [];
  const txsRequired = routeDetails?.txsRequired ?? options?.route?.txsRequired ?? 1;

  if (currentRouteDetails?.status === "signing" && status === "pending") {
    currentRouteDetails.txsSigned += 1;
  }

  const transferEvents = routeDetails?.transferEvents ?? getTransferEventsFromTxStatusResponse(transactionDetails
    .map((tx) => tx.statusResponse)
    .filter((status): status is TxStatusResponse => status !== undefined));

  const allTransactionsHaveDetails = transactionDetails.length === txsRequired;
  const allKnownDetailsHaveFinalStatus = transactionDetails.every(
    (transaction) => isFinalState(transaction),
  );

  const isAllSettled = allTransactionsHaveDetails && allKnownDetailsHaveFinalStatus;

  const someTxSucceeded = transactionDetails.some(tx => isSuccessState(tx));
  const someTxFailed = transactionDetails.some(tx => !isSuccessState(tx));

  const getRouteStatus= () => {
    if (status) return status;
    if (someTxSucceeded && !allTransactionsHaveDetails) return "incomplete";
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

  const transferAssetRelease = transactionDetails?.at(-1)?.statusResponse?.transferAssetRelease;

  const senderAddress = options?.userAddresses?.at(0);
  const receiverAddress = options?.userAddresses?.at(-1);

  const newRouteDetails: RouteDetails = {
    id: routeId,
    timestamp: routeDetails?.timestamp ?? currentRouteDetails?.timestamp,
    status: getRouteStatus() as RouteStatus,
    route: getSimpleRoute(routeDetails?.route ?? options?.route),
    txsRequired,
    transactionDetails,
    transferEvents,
    transferAssetRelease,
    senderAddress: routeDetails?.senderAddress ?? senderAddress?.address ?? '',
    receiverAddress: routeDetails?.receiverAddress ?? receiverAddress?.address ?? '',
    txsSigned: routeDetails?.txsSigned ?? currentRouteDetails?.txsSigned,
  };

  const newRouteStatus = getRouteDetailsWithSimpleTransactionDetailsStatus(newRouteDetails);

  const previousRouteStatus = getRouteDetailsWithSimpleTransactionDetailsStatus(routeDetails ?? currentRouteDetails);

  if ((options?.onRouteStatusUpdated) && JSON.stringify(newRouteStatus) !== JSON.stringify(previousRouteStatus)) {
    options?.onRouteStatusUpdated?.(newRouteStatus);
  }

  if (routeId) {
    routeDetailsMap.set(routeId, newRouteDetails);
  }

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

const removeCompletedRoutes = () => {
  routeDetailsMap.forEach((routeDetails, routeId) => {
    if (routeDetails.status === "completed") {
      routeDetailsMap.delete(routeId);
    }
  });
};