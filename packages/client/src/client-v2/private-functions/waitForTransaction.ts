import { trackTransaction } from "../api/postTrackTransaction";
import { transactionStatus } from "../api/postTransactionStatus";
import { TransactionCallbacks } from "../types/callbacks";
import { wait } from "../utils/timer";

export type WaitForTransactionProps = {
  chainId: string;
  txHash: string;
  onTransactionTracked?: TransactionCallbacks["onTransactionTracked"];
};

export const waitForTransaction = async ({
  chainId,
  txHash,
  onTransactionTracked,
}: WaitForTransactionProps) => {
  const { explorerLink } = (await trackTransaction.request({
    chainId,
    txHash,
    // TODO: remove after updating swagger
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  })) as any;
  await onTransactionTracked?.({ txHash, chainId, explorerLink });

  // eslint-disable-next-line no-constant-condition
  while (true) {
    // TODO: remove after updating swagger
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const txStatusResponse: any = await transactionStatus.request({
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
