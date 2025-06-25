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

export type RouteStatus = "unconfirmed" | "allowance" | "signing" | "pending" | "completed" | "incomplete" | "failed";

export type TransactionDetails = {
  chainId: string;
  txHash?: string;
  status?: TxStatusResponse;
  tracked?: boolean;
  explorerLink?: string;
};

type SimpleRoute = {
  amountIn: Route["amountIn"];
  amountOut: Route["amountOut"];
  sourceAssetDenom: Route["sourceAssetDenom"];
  sourceAssetChainId: Route["sourceAssetChainId"];
  destAssetDenom: Route["destAssetDenom"];
  destAssetChainId: Route["destAssetChainId"];
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

let currentRouteDetails = {
  status: "unconfirmed",
  id: uuidv4(),
  timestamp: Date.now(),
  txsRequired: 1,
  txsSigned: 0,
  transactionDetails: [] as TransactionDetails[],
  transferEvents: [] as ClientTransferEvent[],
};

export const executeAndSubscribeToRouteStatus = async ({
  transactionDetails = currentRouteDetails.transactionDetails,
  txsRequired = currentRouteDetails.txsRequired,
  executeTransaction,
  trackTxPollingOptions,
  onTransactionTracked,
  onTransactionCompleted,
  onRouteStatusUpdated,
  ...options
}: executeAndSubscribeToRouteStatus) => {

  for (const [transactionIndex, transaction] of transactionDetails.entries()) {
    if (transaction.status && isFinalState(transaction.status.state)) {
      updateRouteDetails({
        transactionDetails,
        txsRequired,
        shouldReturnIdAndTimestamp: executeTransaction !== undefined,
        options
      });
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

        updateRouteDetails({
          transactionDetails,
          txsRequired,
          shouldReturnIdAndTimestamp: executeTransaction !== undefined,
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
  transactionDetails?: TransactionDetails[];
  txsRequired?: number;
  shouldReturnIdAndTimestamp?: boolean;
  options?: Partial<ExecuteRouteOptions>;
  status?: RouteStatus;
}

export const updateRouteDetails = ({
  transactionDetails = currentRouteDetails.transactionDetails,
  txsRequired = currentRouteDetails.txsRequired,
  shouldReturnIdAndTimestamp,
  options,
  status,
}: updateRouteDetailsProps): RouteDetails => {

  const validStatuses = transactionDetails
    .map((tx) => tx.status)
    .filter((status): status is TxStatusResponse => status !== undefined);

  const transferEvents = getTransferEventsFromTxStatusResponse(validStatuses);

  const allTransactionsHaveDetails = transactionDetails.length >= txsRequired;
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

  let routeStatus: RouteStatus = status ?? "pending";
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

  const senderAddress = options?.userAddresses?.at(0);
  const receiverAddress = options?.userAddresses?.at(-1);

  const newRouteDetails: RouteDetails = {
    id: currentRouteDetails.id,
    timestamp: currentRouteDetails.timestamp,
    status: routeStatus,
    route: {
      amountIn: options?.route?.amountIn ?? '',
      amountOut: options?.route?.amountOut ?? '',
      sourceAssetDenom:  options?.route?.sourceAssetDenom ?? '',
      sourceAssetChainId:  options?.route?.sourceAssetChainId ?? '',
      destAssetDenom:  options?.route?.destAssetDenom ?? '',
      destAssetChainId:  options?.route?.destAssetChainId ?? '',
    },
    txsRequired,
    transactionDetails,
    transferEvents,
    transferAssetRelease,
    senderAddress: senderAddress?.address ?? '',
    receiverAddress: receiverAddress?.address ?? '',
    txsSigned: currentRouteDetails.txsSigned,
  };

  if (options?.onRouteStatusUpdated) {
    options.onRouteStatusUpdated(newRouteDetails);
  }

  currentRouteDetails = newRouteDetails;

  return newRouteDetails;
};