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
export type TransactionStatus = "pending" | "success" | "failed";

export type TransactionDetails = {
  chainId: string;
  txHash?: string;
  status?: TransactionStatus;
  statusResponse?: TxStatusResponse;
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

export function getSimpleOverallStatus(state?: TransactionState): TransactionStatus {
  switch (state) {
    case "STATE_SUBMITTED":
    case "STATE_PENDING":
      return "pending";
    case "STATE_COMPLETED_SUCCESS":
      return "success";
    case "STATE_COMPLETED_ERROR":
    case "STATE_PENDING_ERROR":
    default:
      return "failed";
  }
}

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
  status: "unconfirmed" as RouteStatus,
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
    if (transaction.status && isFinalState(transaction.statusResponse?.state)) {
      updateRouteDetails({
        transactionDetails,
        txsRequired,
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

        transaction.statusResponse = statusResponse;

        updateRouteDetails({
          transactionDetails,
          txsRequired,
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
  options?: Partial<ExecuteRouteOptions>;
  status?: RouteStatus;
}

export const updateRouteDetails = ({
  transactionDetails = currentRouteDetails.transactionDetails,
  txsRequired = currentRouteDetails.txsRequired,
  options,
  status,
}: updateRouteDetailsProps): RouteDetails => {

  if (status === "pending" && currentRouteDetails.status === "signing") {
    currentRouteDetails.txsSigned += 1;
  }

  const validStatuses = transactionDetails
    .map((tx) => tx.statusResponse)
    .filter((status): status is TxStatusResponse => status !== undefined);

  const transferEvents = getTransferEventsFromTxStatusResponse(validStatuses);

  const allTransactionsHaveDetails = transactionDetails.length >= txsRequired;
  const allKnownDetailsHaveFinalStatus = transactionDetails.every(
    (tx) => tx.status && isFinalState(tx.statusResponse?.state),
  );

  const isAllSettled = allTransactionsHaveDetails && allKnownDetailsHaveFinalStatus;

  const someTxSucceeded = validStatuses.some(
    (status) => isFinalState(status.state) && status.state === "STATE_COMPLETED_SUCCESS",
  );

  const someTxFailed = validStatuses.some(
    (status) => isFinalState(status.state) && status.state !== "STATE_COMPLETED_SUCCESS",
  );

  let routeStatus: RouteStatus = status ?? currentRouteDetails?.status;

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
    transactionDetails: transactionDetails.map(txDetails => ({
      ...txDetails,
      statusResponse: undefined,
      status: getSimpleOverallStatus(txDetails.statusResponse?.state),
    })),
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