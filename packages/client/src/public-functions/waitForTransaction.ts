import type { TransactionCallbacks } from "src/types/callbacks";
import { transactionStatus, type TxStatusResponse } from "../api/postTransactionStatus";
import { wait } from "../utils/timer";
import { trackTransaction } from "src/api/postTrackTransaction";
import type { TxResult } from "src/types/client-types";

export type WaitForTransactionProps = TxResult & {
  onTransactionTracked?: TransactionCallbacks["onTransactionTracked"];
  doNotTrack?: boolean;
  onStatusUpdated?: (status: TxStatusResponse) => void;
  onError?: (error: Error) => void;
  isCancelled?: () => boolean;
};

export const waitForTransaction = async ({
  chainId,
  txHash,
  explorerLink,
  doNotTrack = false,
  onStatusUpdated,
  onError,
  onTransactionTracked,
  isCancelled,
  ...trackTxPollingOptions
}: WaitForTransactionProps) => {

  try {
    if (!explorerLink && !doNotTrack) {
      const response = await trackTransaction({
        chainId: chainId,
        txHash: txHash,
        ...trackTxPollingOptions,
      });
      explorerLink = response.explorerLink;
      await onTransactionTracked?.({ txHash, chainId, explorerLink });
    }
  } catch (error) {
    console.warn(`track failed for txHash:${txHash}, chainId: ${chainId}`);
  }

  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const txStatusResponse = await transactionStatus({
        isCancelled,
      })({
        chainId,
        txHash,
      });

      if (isCancelled?.()) {
        throw new Error("waitForTransaction was aborted");
      }
      
      onStatusUpdated?.(txStatusResponse);
  
      if (txStatusResponse.state === "STATE_COMPLETED_SUCCESS") {
        return txStatusResponse;
      }
  
      if (txStatusResponse.state === "STATE_COMPLETED_ERROR") {
        throw new Error(`${txStatusResponse.error?.type}: ${txStatusResponse.error?.message}`);
      }
      if (txStatusResponse.state === "STATE_ABANDONED") {
        throw new Error("Tracking for the transaction has been abandoned");
      }
  
      await wait(1000);
    } catch (error) {
      onError?.(error as Error);
      throw error;
    }
  }
};

export const waitForTransactionWithCancel = (props: WaitForTransactionProps) => {
  let isCancelled = false;
  
  const cancel = () => {
    isCancelled = true;
  };

  const wrappedPromise = waitForTransaction({...props, isCancelled: () => isCancelled});
  
  return { promise: wrappedPromise, cancel };
};