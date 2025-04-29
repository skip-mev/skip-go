import { SvmTx } from "src/client-v2/types/swaggerTypes";
import { Connection, Transaction } from "@solana/web3.js";
import { getRpcEndpointForChain } from "../getRpcEndpointForChain";
import { submitTransaction } from "src/client-v2/api/postSubmitTransaction";
import { wait } from "src/client-v2/utils/timer";
import { ClientState } from "src/client-v2/state";
import { ExecuteRouteOptions } from "src/client-v2/public-functions/executeRoute";

export const executeSvmTransaction = async (
  tx?: { svmTx?: SvmTx },
  options?: ExecuteRouteOptions,
) => {
  const gasArray = ClientState.validateGasResults;

  if (tx === undefined) {
    throw new Error("executeSvmTransaction error: tx is undefined");
  }

  const gas = gasArray?.find((gas) => gas?.error !== null && gas?.error !== undefined);
  if (typeof gas?.error === "string") {
    throw new Error(gas?.error);
  }

  const svmTx = tx?.svmTx;
  const getSVMSigner = options?.getSVMSigner || ClientState.getSVMSigner;
  if (!getSVMSigner) {
    throw new Error(
      "executeRoute error: 'getSVMSigner' is not provided or configured in skip router",
    );
  }

  const signer = await getSVMSigner();

  if (!svmTx?.chainId) {
    throw new Error("executeSvmTransaction error: chainId not found in svmTx");
  }

  const txBuffer = Buffer.from(svmTx.tx ?? "", "base64");
  const transaction = Transaction.from(txBuffer);

  const endpoint = await getRpcEndpointForChain(svmTx.chainId);
  const connection = new Connection(endpoint);

  let signature: string | undefined;

  if ("signTransaction" in signer) {
    const signedTx = await signer.signTransaction(transaction);
    options?.onTransactionSigned?.({ chainId: svmTx.chainId });

    const serializedTx = signedTx.serialize();

    await submitTransaction({
      chainId: svmTx.chainId,
      tx: serializedTx.toString("base64"),
    }).then((res) => {
      signature = res.txHash;
    });

    const rpcSig = await connection.sendRawTransaction(serializedTx, {
      preflightCommitment: "confirmed",
      maxRetries: 5,
    });

    signature = rpcSig;
  }

  if (!signature) {
    throw new Error("executeSvmTransaction error: signature not found");
  }

  let getStatusCount = 0;
  let errorCount = 0;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const status = await connection.getSignatureStatus(signature, {
        searchTransactionHistory: true,
      });

      if (status?.value?.confirmationStatus === "confirmed") {
        return {
          chainId: svmTx.chainId,
          txHash: signature,
        };
      }

      if (getStatusCount > 12) {
        await wait(3000);
        throw new Error(
          `executeSvmTransaction error: waiting finalized status timed out for ${signature}`,
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
