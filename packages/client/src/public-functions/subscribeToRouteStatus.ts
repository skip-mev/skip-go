import { wait } from "../utils/timer";
import {
  transactionStatus,
  type TxStatusResponse,
} from "../api/postTransactionStatus";
import type {
  TransferAssetRelease,
  TransferStatus,
  Tx,
} from "../types/swaggerTypes";
import {
  getSimpleOverallStatus,
  getTransferEventsFromTxStatusResponse,
  type ClientTransferEvent,
  type OverallStatus,
} from "../utils/clientType";
import type { ExecuteRouteOptions } from "./executeRoute";
import { trackTransaction } from "../api/postTrackTransaction";
import type { TxResult } from "src/types";

export type RouteStatus = "pending" | "completed" | "incomplete" | "failed";

export type TransactionDetails = {
  chainId: string;
  txHash?: string;
  status?: TxStatusResponse;
  tracked?: boolean;
  explorerLink?: string;
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
  executeTransaction?: (index: number) => Promise<TxResult>;
  trackTxPollingOptions?: ExecuteRouteOptions["trackTxPollingOptions"];
  onTransactionTracked?: ExecuteRouteOptions["onTransactionTracked"];
  onTransactionCompleted?: ExecuteRouteOptions["onTransactionCompleted"];
  onRouteStatusUpdated?: ExecuteRouteOptions["onRouteStatusUpdated"];
};

export const subscribeToRouteStatus = async ({
  transactionDetails = [],
  txsRequired: totalTxsRequired,
  executeTransaction,
  trackTxPollingOptions,
  onTransactionTracked,
  onTransactionCompleted,
  onRouteStatusUpdated,
}: subscribeToRouteStatusProps) => {
  let overallRouteStatus: RouteStatus = "pending";

  for (const [transactionIndex, transaction] of transactionDetails.entries()) {
    if (transaction.status && isFinalState(transaction.status.state)) {
      const routeDetails = getRouteDetails(
        transactionDetails,
        totalTxsRequired,
      );
      onRouteStatusUpdated?.(routeDetails);
      overallRouteStatus = routeDetails.status;
      continue;
    }

    if (executeTransaction && !transaction.txHash) {
      const { txHash } = await executeTransaction?.(transactionIndex);
      transaction.txHash = txHash;
    }

    if (transaction.txHash === undefined) {
      throw new Error("subscribeToRouteStatus error: txHash is undefined");
    }

    if (transaction.tracked === undefined) {
      const { explorerLink } = await trackTransaction({
        chainId: transaction.chainId,
        txHash: transaction.txHash,
        ...trackTxPollingOptions,
      });
      transaction.tracked = true;
      transaction.explorerLink = explorerLink;
      await onTransactionTracked?.({ txHash: transaction.txHash, chainId: transaction.chainId, explorerLink });
    }

    while (true) {
      try {
        const statusResponse = await transactionStatus({
          chainId: transaction.chainId,
          txHash: transaction.txHash,
        });

        transaction.status = statusResponse;

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
    .filter((status): status is TxStatusResponse => status !== undefined);

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