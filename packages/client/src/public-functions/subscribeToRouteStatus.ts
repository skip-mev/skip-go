import { wait } from "../utils/timer";
import {
  transactionStatus,
  type TxStatusResponse,
} from "../api/postTransactionStatus";
import type {
  TransferAssetRelease,
  TransferStatus,
} from "../types/swaggerTypes";
import {
  getSimpleOverallStatus,
  getTransferEventsFromTxStatusResponse,
  type ClientTransferEvent,
  type OverallStatus,
} from "../utils/clientType";
import type { ExecuteRouteOptions } from "./executeRoute";
import { trackTransaction } from "../api/postTrackTransaction";

export type RouteStatus = "pending" | "completed" | "incomplete" | "failed";

export type TransactionDetails = {
  txHash: string;
  chainId: string;
  status?: TransferStatus;
};

export type RouteDetails = {
  status: RouteStatus;
  transactionDetails: TransactionDetails[];
  transferEvents: ClientTransferEvent[];
  transferAssetRelease?: TransferAssetRelease;
};

const isFinalState = (state?: string): boolean => {
  return (
    state === "STATE_COMPLETED_SUCCESS" ||
    state === "STATE_COMPLETED_ERROR" ||
    state === "STATE_ABANDONED"
  );
};

export type subscribeToRouteStatusProps = {
  transactionDetails?: TransactionDetails[];
  txsRequired: number;
  onTransactionCompleted: ExecuteRouteOptions["onTransactionCompleted"];
  onRouteStatusUpdated: ExecuteRouteOptions["onRouteStatusUpdated"];
  onTransactionTracked: ExecuteRouteOptions["onTransactionTracked"];
  trackTxPollingOptions: ExecuteRouteOptions["trackTxPollingOptions"];
};

export const subscribeToRouteStatus = async ({
  transactionDetails = [],
  txsRequired: totalTxsRequired,
  onTransactionCompleted,
  onRouteStatusUpdated,
  onTransactionTracked,
  trackTxPollingOptions,
}: subscribeToRouteStatusProps) => {
  let overallRouteStatus: RouteStatus = "pending";

  for (const transaction of transactionDetails) {
    const { explorerLink } = await trackTransaction({
      chainId: transaction.chainId,
      txHash: transaction.txHash,
      ...trackTxPollingOptions,
    });
    await onTransactionTracked?.({ txHash: transaction.txHash, chainId: transaction.chainId, explorerLink });

    if (transaction.status && isFinalState(transaction.status.state)) {
      const routeDetails = getRouteDetails(
        transactionDetails,
        totalTxsRequired,
      );
      onRouteStatusUpdated?.(routeDetails);
      overallRouteStatus = routeDetails.status;
    }

    while (true) {
      try {
        const statusResponse = await transactionStatus({
          chainId: transaction.chainId,
          txHash: transaction.txHash,
        });

        transaction.status = statusResponse as TransferStatus;

        const routeDetails  = getRouteDetails(
          transactionDetails,
          totalTxsRequired,
        );

        onRouteStatusUpdated?.(routeDetails);
        overallRouteStatus = routeDetails.status;

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
        await wait(500);
      }
    }
  }
};

const getRouteDetails = (
  transactionDetails: TransactionDetails[],
  totalTxsRequired: number,
): RouteDetails => {
  const validStatuses = transactionDetails
    .map((tx) => tx.status)
    .filter((status): status is TransferStatus => status !== undefined);

  const transferEvents = getTransferEventsFromTxStatusResponse(validStatuses);

  const allTransactionsHaveDetails = transactionDetails.length >= totalTxsRequired;
  const allKnownDetailsHaveFinalStatus = transactionDetails.every(
    (tx) => tx.status && isFinalState(tx.status.state),
  );

  const isAllSettled = allTransactionsHaveDetails && allKnownDetailsHaveFinalStatus;

  const someTxSucceeded = validStatuses.some(
    (status) => isFinalState(status.state) && status.state === "STATE_COMPLETED_SUCCESS",
  );

  const someTxFailed = validStatuses.some(
    (status) => isFinalState(status.state) && status.state !== "STATE_COMPLETED_SUCCESS",
  );

  let routeStatus: RouteStatus = "pending";
  if (isAllSettled) {
    if (!someTxFailed) {
      routeStatus = "completed";
    } else if (someTxSucceeded && someTxFailed) {
      routeStatus = "incomplete";
    } else if (someTxFailed) {
      routeStatus = "failed";
    }
  } else {
    routeStatus = "pending";
  }

  const transferAssetRelease = validStatuses?.at(-1)?.transferAssetRelease;

  const newRouteDetails: RouteDetails = {
    status: routeStatus,
    transactionDetails: [...transactionDetails],
    transferEvents,
    transferAssetRelease,
  };

  return newRouteDetails;
};