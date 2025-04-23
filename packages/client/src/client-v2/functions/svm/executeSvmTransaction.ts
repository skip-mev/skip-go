import { Adapter } from "@solana/wallet-adapter-base/lib/types/types";
import { SvmTx } from "src/client-v2/types/swaggerTypes";
import { ExecuteRouteOptions } from "../executeRoute";
import { Connection, Transaction } from "@solana/web3.js";
import { getRpcEndpointForChain } from "../getRpcEndpointForChain";
import { submitTransaction } from "src/client-v2/api/postSubmitTransaction";
import { wait } from "src/client-v2/utils/timer";

export const executeSvmTx = async (
  tx: { svmTx: SvmTx },
  options: ExecuteRouteOptions,
): Promise<{ chainID: string; txHash: string }> => {
  const gasArray = await waitForVariable(() => this.validateGasResults);
  const gas = gasArray.find((gas) => gas?.error !== null && gas?.error !== undefined);
  if (typeof gas?.error === "string") {
    throw new Error(gas?.error);
  }
  const { svmTx } = tx;
  const getSVMSigner = options.getSVMSigner || this.getSVMSigner;
  if (!getSVMSigner) {
    throw new Error(
      "executeRoute error: 'getSVMSigner' is not provided or configured in skip router",
    );
  }
  const svmSigner = await getSVMSigner();

  const txReceipt = await this.executeSVMTransaction({
    signer: svmSigner,
    message: svmTx,
    options,
  });

  return {
    chainID: svmTx.chainID,
    txHash: txReceipt,
  };
};

export const executeSVMTransaction = async ({
  signer,
  message,
  options: options,
}: {
  signer: Adapter;
  message: SvmTx;
  options: ExecuteRouteOptions;
}) => {
  const { onTransactionSigned } = options;
  const _tx = Buffer.from(message.tx ?? "", "base64");
  const transaction = Transaction.from(_tx);

  if (!message.chainId) {
    throw new Error("executeSVMTransaction error: chainId not found in svmTx");
  }

  const endpoint = await getRpcEndpointForChain(message.chainId);
  const connection = new Connection(endpoint);
  let signature;
  if ("signTransaction" in signer) {
    const tx = await signer.signTransaction(transaction);
    onTransactionSigned?.({
      chainId: message.chainId,
    });
    const serializedTx = tx.serialize();

    await submitTransaction({
      chainId: message.chainId,
      tx: serializedTx.toString("base64"),
    })
      .request()
      .then((res) => {
        signature = res.txHash;
      });

    const sig = await connection.sendRawTransaction(serializedTx, {
      preflightCommitment: "confirmed",
      maxRetries: 5,
    });

    signature = sig;
  }

  if (!signature) {
    throw new Error("executeSVMTransaction error: signature not found");
  }

  let getStatusCount = 0;
  let errorCount = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const result = await connection.getSignatureStatus(signature, {
        searchTransactionHistory: true,
      });
      if (result?.value?.confirmationStatus === "confirmed") {
        return signature;
      } else if (getStatusCount > 12) {
        await wait(3000);
        throw new Error(
          `executeSVMTransaction error: waiting finalized status timed out for ${signature}`,
        );
      }
      getStatusCount++;

      await wait(3000);
    } catch (error) {
      errorCount++;
      if (errorCount > 12) {
        throw error;
      }
    }
  }
};
