import type { TransactionCallbacks } from "src/types/callbacks";
import { transactionStatus } from "../api/postTransactionStatus";
import { wait } from "../utils/timer";
import { trackTransaction } from "src/api/postTrackTransaction";
import type { TxResult } from "src/types/client-types";

export type WaitForTransactionProps = TxResult & {
  onTransactionTracked?: TransactionCallbacks["onTransactionTracked"];
  doNotTrack?: boolean;
};

export const waitForTransaction = async ({
  chainId,
  txHash,
  explorerLink,
  doNotTrack = false,
  onTransactionTracked,
  ...trackTxPollingOptions
}: WaitForTransactionProps) => {
  try {
    if (!explorerLink) {
      const response = await trackTransaction({
        chainId: chainId,
        txHash: txHash,
        ...trackTxPollingOptions,
      });
      explorerLink = response.explorerLink;
    }
    await onTransactionTracked?.({ txHash, chainId, explorerLink });
  } catch (error) {
    console.warn(`track failed for txHash:${txHash}, chainId: ${chainId}`);
  }

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
