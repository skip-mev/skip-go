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

type SimpleRoute = Partial<Pick<
  Route,
  | "amountIn"
  | "amountOut"
  | "sourceAssetDenom"
  | "sourceAssetChainId"
  | "destAssetDenom"
  | "destAssetChainId"
  | "estimatedRouteDurationSeconds"
>>;

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

const isFinalRouteStatus = (routeDetails: RouteDetails) => {
  if (routeDetails.status === "completed" || routeDetails.status === "failed" || routeDetails.status === "incomplete") {
    return true;
  }
  return false;
}

const isFinalState = (transaction?: TransactionDetails): boolean => {
  const transactionState = transaction?.statusResponse?.transfers?.[0]?.state;
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
  const transactionState = transaction?.statusResponse?.transfers?.[0]?.state;
  const transactionStatus = transaction?.status;
  return (
    transactionState === "STATE_COMPLETED_SUCCESS" ||
    transactionStatus === "success"
  );
}

export type subscribeToRouteStatusProps = {
  routeDetails?: RouteDetails | RouteDetails[];
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
  const { routeDetails, onRouteStatusUpdated } = props;
  const routeList = Array.isArray(routeDetails) ? routeDetails : [routeDetails];

  const cancelFlags = new Map<string, { cancelled: boolean }>();

  const unsubscribers: (() => void)[] = [];

  for (const route of routeList) {
    const cancelFlag = { cancelled: false };
    cancelFlags.set(route?.id ?? uuidv4(), cancelFlag);

    const unsubscribe = () => {
      cancelFlag.cancelled = true;
    };

    unsubscribers.push(unsubscribe);

    void executeAndSubscribeToRouteStatus({
      routeDetails: route,
      onRouteStatusUpdated,
      isCancelled: () => cancelFlag.cancelled,
    });
  }

  const unsubscribeAll = () => {
    for (const unsubscribe of unsubscribers) {
      unsubscribe();
    }
  };

  return unsubscribeAll;
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
  removeRoutesWithFinalStatus();

  routeId ??= routeDetails?.id;
  const currentRouteDetails = routeDetailsMap.get(routeId ?? '');
  transactionDetails ??= routeDetails?.transactionDetails ?? currentRouteDetails?.transactionDetails ?? [];

  if (routeDetails && isFinalRouteStatus(routeDetails)) {
    return;
  }

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
      updateRouteDetails({
        routeId,
        routeDetails,
        transactionDetails,
        options: {
          onRouteStatusUpdated,
          ...options,
        }
      });
      return;
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
  let currentRouteDetails = routeDetails ?? routeDetailsMap.get(routeId);
  if (!routeId && currentRouteDetails == undefined) {
    currentRouteDetails = initializeNewRouteDetails(options);
    routeId = currentRouteDetails?.id;
  }
  if (currentRouteDetails === undefined) {
    throw new Error ("No route details found")
  }

  transactionDetails ??= currentRouteDetails?.transactionDetails ?? [];
  const txsRequired = currentRouteDetails?.txsRequired ?? options?.route?.txsRequired ?? 1;

  if (currentRouteDetails?.status === "signing" && status === "pending") {
    currentRouteDetails.txsSigned += 1;
  }

  const transferEvents = routeDetails?.transferEvents ?? getTransferEventsFromTxStatusResponse(transactionDetails
    .map((tx) => tx.statusResponse)
    .filter((status): status is TxStatusResponse => status !== undefined));

  const allExpectedTxsStarted =
    transactionDetails.every(
      (tx) =>
        tx.txHash || tx.status === undefined
    );
  const allKnownDetailsHaveFinalStatus = transactionDetails.every(
    (transaction) => isFinalState(transaction),
  );

  const isAllSettled = allExpectedTxsStarted && allKnownDetailsHaveFinalStatus;

  const someTxSucceeded = transactionDetails.some(tx => isSuccessState(tx));
  const someTxFailed = transactionDetails.some(tx => !isSuccessState(tx));

  const getRouteStatus= () => {
    if (status) return status;
    if (someTxSucceeded && !allExpectedTxsStarted) return "incomplete";
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

  const transferAssetRelease = transactionDetails?.findLast(i => i.statusResponse?.transferAssetRelease)?.statusResponse?.transferAssetRelease;

  const senderAddress = options?.userAddresses?.at(0);
  const receiverAddress = options?.userAddresses?.at(-1);

  const newRouteDetails: RouteDetails = {
    id: routeId,
    timestamp: currentRouteDetails.timestamp,
    status: getRouteStatus() as RouteStatus,
    route: getSimpleRoute(currentRouteDetails?.route ?? options?.route),
    txsRequired,
    transactionDetails,
    transferEvents,
    transferAssetRelease,
    senderAddress: currentRouteDetails?.senderAddress ?? senderAddress?.address ?? '',
    receiverAddress: currentRouteDetails?.receiverAddress ?? receiverAddress?.address ?? '',
    txsSigned: currentRouteDetails?.txsSigned,
  };

  const newRouteStatus = getRouteDetailsWithSimpleTransactionDetailsStatus(newRouteDetails);

  const previousRouteStatus = getRouteDetailsWithSimpleTransactionDetailsStatus(currentRouteDetails);

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
  console.log(routeDetails);
  return {
    ...routeDetails,
    transactionDetails: routeDetails.transactionDetails.map(txDetails => {
      const { statusResponse, ...rest } = txDetails;
      return {
        ...rest,
        status: txDetails?.status ?? getTransactionStatus(txDetails.statusResponse?.state),
      }
    })
  };
}

const removeRoutesWithFinalStatus = () => {
  routeDetailsMap.forEach((routeDetails, routeId) => {
    if (routeDetails.status === "completed" || routeDetails.status === "failed" || routeDetails.status === "incomplete") {
      routeDetailsMap.delete(routeId);
    }
  });
};
