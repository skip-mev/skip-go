import type { TransactionState } from "src/types/swaggerTypes";
import { trackTransaction, type TrackTxRequest } from "../api/postTrackTransaction";
import { transactionStatus } from "../api/postTransactionStatus";
import type { TransactionCallbacks } from "../types/callbacks";
import { wait } from "../utils/timer";

export type WaitForTransactionProps = TrackTxRequest & {
  isEvm?: boolean;
  onTransactionTracked?: TransactionCallbacks["onTransactionTracked"];
};

const finalStates = ["STATE_COMPLETED_SUCCESS", "STATE_COMPLETED_ERROR", "STATE_ABANDONED"];

const isFinalState = (state: TransactionState) => {
  return finalStates.includes(state);
}

export const waitForTransaction = async ({
  chainId,
  txHash,
  isEvm,
  onTransactionTracked,
  ...trackTxPollingOptions
}: WaitForTransactionProps) => {
  if (isEvm) {
    try {
      const { explorerLink } = await trackTransaction({
        chainId,
        txHash,
        ...trackTxPollingOptions,
      });
      await onTransactionTracked?.({ txHash, chainId, explorerLink });
    } catch (error) {
      console.warn(`track failed for txHash:${txHash}, chainId: ${chainId}`);
    }
  }
  
  let txStatusResponse;

  while (txStatusResponse?.state && !isFinalState(txStatusResponse?.state)) {
    txStatusResponse = await transactionStatus({
      chainId,
      txHash,
    });

    if (txStatusResponse.state === "STATE_COMPLETED_ERROR") {
      throw new Error(`${txStatusResponse.error?.type}: ${txStatusResponse.error?.message}`);
    }
    if (txStatusResponse.state === "STATE_ABANDONED") {
      throw new Error("Tracking for the transaction has been abandoned");
    }

    await wait(1000);
  }

  return txStatusResponse;
};
