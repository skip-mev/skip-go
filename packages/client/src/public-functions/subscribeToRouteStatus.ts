import { wait } from "../utils/timer";
import {
  transactionStatus,
  type TxStatusResponse,
} from "../api/postTransactionStatus";
import type {
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

export type RouteStatus = "pending" | "completed" | "incomplete" | "failed";

export type TransactionDetails = {
  chainId: string;
  txHash?: string;
  status?: TxStatusResponse;
  tracked?: boolean;
  explorerLink?: string;
};

export type RouteDetails = {
  id?: string;
  timestamp?: number;
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
  trackTxPollingOptions?: ExecuteRouteOptions["trackTxPollingOptions"];
  onRouteStatusUpdated?: ExecuteRouteOptions["onRouteStatusUpdated"];
};

export type executeAndSubscribeToRouteStatus = subscribeToRouteStatusProps & Partial<ExecuteRouteOptions> & {
  executeTransaction?: (index: number) => Promise<TxResult>;
  onTransactionTracked?: ExecuteRouteOptions["onTransactionTracked"];
  onTransactionCompleted?: ExecuteRouteOptions["onTransactionCompleted"];
};

export const subscribeToRouteStatus = async (props: subscribeToRouteStatusProps) => {
  return executeAndSubscribeToRouteStatus(props);
};

const id = uuidv4();
const timestamp = Date.now();

export const executeAndSubscribeToRouteStatus = async ({
  transactionDetails = [],
  txsRequired: totalTxsRequired,
  executeTransaction,
  trackTxPollingOptions,
  onTransactionTracked,
  onTransactionCompleted,
  onRouteStatusUpdated,
  userAddresses,
}: executeAndSubscribeToRouteStatus) => {

  for (const [transactionIndex, transaction] of transactionDetails.entries()) {
    if (transaction.status && isFinalState(transaction.status.state)) {
      const routeDetails = getRouteDetails(
        transactionDetails,
        totalTxsRequired,
        executeTransaction !== undefined,
      );
      onRouteStatusUpdated?.(routeDetails);
      continue;
    }

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

      transaction.tracked = true;
      transaction.explorerLink = explorerLink;
      await onTransactionTracked?.({ txHash: transaction.txHash, chainId: transaction.chainId, explorerLink });
    }

    if (transaction.txHash === undefined) {
      throw new Error("subscribeToRouteStatus error: txHash is undefined");
    }

    while (true) {
      try {
        const statusResponse = await transactionStatus({
          chainId: transaction.chainId,
          txHash: transaction.txHash,
        });

        transaction.status = statusResponse;

        const routeDetails = getRouteDetails(
          transactionDetails,
          totalTxsRequired,
          executeTransaction !== undefined,
        );

        onRouteStatusUpdated?.(routeDetails);

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

const getRouteDetails = (
  transactionDetails: TransactionDetails[],
  totalTxsRequired: number,
  shouldReturnIdAndTimestamp?: boolean,
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
  }

  const transferAssetRelease = validStatuses?.at(-1)?.transferAssetRelease;

  const newRouteDetails: RouteDetails = {
    status: routeStatus,
    transactionDetails,
    transferEvents,
    transferAssetRelease,
  };

  if (shouldReturnIdAndTimestamp) {
    newRouteDetails.id = id;
    newRouteDetails.timestamp = timestamp;
  }

  return newRouteDetails;
};