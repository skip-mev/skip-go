import { transactionStatus } from "../api/postTransactionStatus";
import { wait } from "../utils/timer";

export type WaitForTransactionProps = {
  chainId: string;
  txHash: string;
};

export const waitForTransaction = async ({
  chainId,
  txHash,
}: WaitForTransactionProps) => {

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
