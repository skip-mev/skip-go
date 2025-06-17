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

export type TransactionDetails = {
  txHash: string;
  chainId: string;
  status?: TransferStatus;
};

export type RouteStatus = {
  isSuccess: boolean;
  isSettled: boolean;
  transactionDetails: TransactionDetails[];
  transferEvents: ClientTransferEvent[];
  lastTxStatus?: OverallStatus;
  transferAssetRelease?: TransferAssetRelease;
};

const isFinalState = (state?: string): boolean => {
  return (
    state === "STATE_COMPLETED_SUCCESS" ||
    state === "STATE_COMPLETED_ERROR" ||
    state === "STATE_ABANDONED"
  );
};

export type getRouteStatusProps = {
  transactionDetails?: TransactionDetails[];
  txsRequired: number;
  options: ExecuteRouteOptions;
};

let currentDetails: TransactionDetails[] = [];

export const getRouteStatus = async ({
  transactionDetails = [],
  txsRequired: totalTxsRequired,
  options,
}: getRouteStatusProps) => {
  currentDetails = transactionDetails;
  let isCompletelySettled = false;
  let previousTxsStatus: RouteStatus | undefined = undefined;

  const { onTransactionCompleted } = options;

  // eslint-disable-next-line no-constant-condition
  while (!isCompletelySettled) {
    const incompleteTxs = currentDetails.filter(
      (tx) => !tx.status || !isFinalState(tx.status.state)
    );

    if (incompleteTxs.length > 0) {
      const statusFetchPromises = incompleteTxs.map(async (txDetail) => {
        try {
          const status = await transactionStatus({
            chainId: txDetail.chainId,
            txHash: txDetail.txHash,
          });
          return {
            txHash: txDetail.txHash,
            chainId: txDetail.chainId,
            status: status as TransferStatus,
          };
        } catch (error) {
          console.warn(
            `Polling error for ${txDetail.txHash} on ${txDetail.chainId}:`,
            error
          );
        }
      });

      const results = await Promise.all(statusFetchPromises);

      results.forEach((result) => {
        const detailIndex = currentDetails.findIndex(
          (d) => d.txHash === result?.txHash && d.chainId === result?.chainId
        );
        if (detailIndex !== -1) {
          const oldStatus = currentDetails[detailIndex]?.status;
          if (currentDetails?.[detailIndex]?.status) {
            currentDetails[detailIndex].status = result?.status;
          }

          if (
            result?.status &&
            isFinalState(result.status.state) &&
            (!oldStatus || !isFinalState(oldStatus.state))
          ) {
            onTransactionCompleted?.({
              chainId: result.chainId,
              txHash: result.txHash,
              status: result.status,
            });
          }
        }
      });
    }

    const validStatuses = currentDetails
      .map((tx) => tx.status)
      .filter((status) => status !== undefined);

    const transferEvents = getTransferEventsFromTxStatusResponse(validStatuses);

    const isAllSettled =
      currentDetails.length === totalTxsRequired && // All expected txs are in our list
      validStatuses.length === totalTxsRequired && // All txs in our list have a status
      validStatuses.every((status) => isFinalState(status?.state));

    if (isAllSettled) {
      isCompletelySettled = true;
    }

    const someTxFailed = validStatuses.some(
      (status) =>
        isFinalState(status.state) && status.state !== "STATE_COMPLETED_SUCCESS"
    );

    const transferAssetRelease = validStatuses
      .slice()
      .reverse()
      .find((tx) => tx?.transferAssetRelease)?.transferAssetRelease;

    const newAggregatedStatus: RouteStatus = {
      isSuccess: isAllSettled && !someTxFailed,
      isSettled: isAllSettled,
      // lastTxStatus: lastTxOverallStatus,
      transactionDetails: [...currentDetails],
      transferEvents,
      transferAssetRelease,
    };

    console.log(newAggregatedStatus, previousTxsStatus);

    // Only call update if the status has actually changed to avoid redundant callbacks
    if (
      JSON.stringify(newAggregatedStatus) !== JSON.stringify(previousTxsStatus)
    ) {
      // await onTxsStatusUpdate?.(newAggregatedStatus);
      console.log(newAggregatedStatus);
      previousTxsStatus = newAggregatedStatus;
    }

    if (isCompletelySettled) break;

    await wait(1000);
  }
};
