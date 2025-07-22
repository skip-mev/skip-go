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
  routeKeyToStatus?: Record<string, TransactionStatus>;
  routeKey?: string;
  canExecuteInParallel?: boolean;
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
  transferIndexToRouteKey?: Record<number, string>;
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

export const executeAndSubscribeToRouteStatus = async (props: executeAndSubscribeToRouteStatusProps) => {
  let { routeId, routeDetails, transactionDetails } = props;
  removeRoutesWithFinalStatus();

  routeId ??= routeDetails?.id;
  const currentRouteDetails = routeDetailsMap.get(routeId ?? '');
  transactionDetails ??= routeDetails?.transactionDetails ?? currentRouteDetails?.transactionDetails ?? [];

  if (routeDetails && isFinalRouteStatus(routeDetails)) {
    return;
  }

  const parallelTxs = transactionDetails
  .map((tx, index) => ({ tx, index }))
  .filter(({ tx }) => tx.canExecuteInParallel);

  const serialTxs = transactionDetails
    .map((tx, index) => ({ tx, index }))
    .filter(({ tx }) => !tx.canExecuteInParallel);

  await Promise.all(
    parallelTxs.map(({ tx, index }) =>
      executeTransactionAndPollStatus({...props, index, transaction: tx})
    )
  );

  for (const { tx, index } of serialTxs) {
    await executeTransactionAndPollStatus({...props, index, transaction: tx})
  }

};

const executeTransactionAndPollStatus = async ({
  index,
  transaction,
  transactionDetails,
  executeTransaction,
  trackTxPollingOptions,
  onTransactionTracked,
  onTransactionCompleted,
  onRouteStatusUpdated,
  routeId,
  routeDetails,
  options,
  isCancelled,
}: executeAndSubscribeToRouteStatusProps & { index: number, transaction: TransactionDetails }) => {

  if (executeTransaction && !transaction.txHash) {
    let { txHash, explorerLink } = await executeTransaction(index);
    transaction.txHash = txHash;

    if (!explorerLink) {
      const trackResponse = await trackTransaction({
        chainId: transaction.chainId,
        txHash,
        ...trackTxPollingOptions,
      });
      explorerLink = trackResponse.explorerLink;
    }

    transaction.explorerLink = explorerLink;
    await onTransactionTracked?.({ txHash, chainId: transaction.chainId, explorerLink });
  }

  if (!transaction.txHash) {
    updateRouteDetails({
      routeId,
      routeDetails,
      transactionDetails,
      options: {
        ...options,
        onRouteStatusUpdated,
      },
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
          ...options,
          onRouteStatusUpdated,
        },
      });

      if (isFinalState(transaction)) {
        await onTransactionCompleted?.({
          chainId: transaction.chainId,
          txHash: transaction.txHash,
          status: statusResponse as TransferStatus,
        });
        break;
      }
    } catch (error) {
      console.error(`Polling error for tx ${transaction.txHash}`, error);
    } finally {
      await wait(1000);
    }
  }
};

type updateRouteDetailsProps = {
  routeDetails?: RouteDetails;
  transactionDetails?: TransactionDetails[];
  options?: Partial<ExecuteRouteOptions>;
  status?: RouteStatus;
  routeId?: string;
  transferIndexToRouteKey?: Record<number, string>;
}

export const updateRouteDetails = ({
  transactionDetails,
  routeDetails,
  options,
  status,
  routeId,
  transferIndexToRouteKey,
}: updateRouteDetailsProps): RouteDetails => {
  routeId ??= routeDetails?.id ?? '';

  let currentRouteDetails = routeDetails ?? routeDetailsMap.get(routeId);

  if (!routeId && currentRouteDetails == undefined) {
    currentRouteDetails = initializeNewRouteDetails(options);
    routeId = currentRouteDetails?.id;
  }
  transferIndexToRouteKey ??= currentRouteDetails?.transferIndexToRouteKey;
  if (currentRouteDetails === undefined) {
    throw new Error ("No route details found")
  }

  transactionDetails ??= currentRouteDetails?.transactionDetails ?? [];
  const txsRequired = currentRouteDetails?.txsRequired ?? options?.route?.txsRequired ?? 1;

  if (currentRouteDetails?.status === "signing" && status === "pending") {
    currentRouteDetails.txsSigned += 1;
  }

  const mainTransactionDetails = transactionDetails.filter(transactionDetail => transactionDetail.routeKey === undefined || transactionDetail.routeKey === "mainRoute")

  const transferEvents = routeDetails?.transferEvents ?? getTransferEventsFromTxStatusResponse(mainTransactionDetails
    .map((tx) => tx.statusResponse)
    .filter((status): status is TxStatusResponse => status !== undefined));

  const allExpectedTxsStarted =
    mainTransactionDetails.every(
      (tx) =>
        tx.txHash || tx.status === undefined
    );
  const allKnownDetailsHaveFinalStatus = mainTransactionDetails.every(
    (transaction) => isFinalState(transaction),
  );

  const isAllSettled = allExpectedTxsStarted && allKnownDetailsHaveFinalStatus;

  const someTxSucceeded = mainTransactionDetails.some(tx => isSuccessState(tx));
  const someTxFailed = mainTransactionDetails.some(tx => !isSuccessState(tx));

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

  const transferAssetRelease = mainTransactionDetails?.findLast(i => i.statusResponse?.transferAssetRelease)?.statusResponse?.transferAssetRelease;

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
    transferIndexToRouteKey,
  };

  const newRouteStatus = getRouteDetailsWithSimpleTransactionDetailsStatus(newRouteDetails, transferIndexToRouteKey);

  const previousRouteStatus = getRouteDetailsWithSimpleTransactionDetailsStatus(currentRouteDetails, transferIndexToRouteKey);

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

const getRouteDetailsWithSimpleTransactionDetailsStatus = (routeDetails: RouteDetails, transferIndexToRouteKey?: Record<number, string>) => {
  console.log('transferIndexToRouteKey', transferIndexToRouteKey);
  return {
    ...routeDetails,
    transactionDetails: routeDetails.transactionDetails.map(txDetails => {
      const { statusResponse, ...rest } = txDetails;
      console.log('transfers', statusResponse?.transfers);
      const newTxDetails = {
        ...rest,
        status: txDetails?.status ?? getTransactionStatus(statusResponse?.transfers?.[0]?.state),
        routeKeyToStatus: { ...(txDetails.routeKeyToStatus ?? {}) },
      };
      if (transferIndexToRouteKey) {
        statusResponse?.transfers?.forEach((transfer, index) => {
          const routeKey = transferIndexToRouteKey?.[index];
          if (routeKey !== undefined) {
            newTxDetails.routeKeyToStatus[routeKey] = getTransactionStatus(transfer.state);
          }
        })
      }

      if (txDetails.routeKey !== undefined) {
        newTxDetails.routeKeyToStatus[txDetails.routeKey] = txDetails?.status ?? getTransactionStatus(statusResponse?.transfers?.[0]?.state);
      }
      return newTxDetails;
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
