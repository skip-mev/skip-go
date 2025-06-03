import { trackTransaction, type TrackTxRequest } from "../api/postTrackTransaction";
import { transactionStatus } from "../api/postTransactionStatus";
import type { TransactionCallbacks } from "../types/callbacks";
import { wait } from "../utils/timer";

export type WaitForTransactionProps = TrackTxRequest & {
  onTransactionTracked?: TransactionCallbacks["onTransactionTracked"];
};

export const waitForTransaction = async ({
  chainId,
  txHash,
  onTransactionTracked,
  ...trackTxPollingProps
}: WaitForTransactionProps) => {
  const { explorerLink } = await trackTransaction({
    chainId,
    txHash,
    ...trackTxPollingProps,
  });
  await onTransactionTracked?.({ txHash, chainId, explorerLink });

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const txStatusResponse = await transactionStatus({
      chainId,
      txHash,
    });

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
  }
};
