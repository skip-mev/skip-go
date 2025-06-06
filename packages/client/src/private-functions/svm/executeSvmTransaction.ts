import type { SvmTx } from "src/types/swaggerTypes";
import { Connection, Transaction } from "@solana/web3.js";
import { getRpcEndpointForChain } from "../getRpcEndpointForChain";
import { submitTransaction } from "src/api/postSubmitTransaction";
import { wait } from "src/utils/timer";
import { ClientState } from "src/state/clientState";
import type { ExecuteRouteOptions } from "src/public-functions/executeRoute";
import { signSvmTransaction } from "./signSvmTransaction";

export const executeSvmTransaction = async (
  tx?: { svmTx?: SvmTx },
  options?: ExecuteRouteOptions
) => {
  const svmTx = tx?.svmTx;
  if (!svmTx?.chainId) {
    throw new Error("executeSvmTransaction error: chainId not found in svmTx");
  }
  const signedTx = await signSvmTransaction({ tx, options });
  if (!signedTx) {
    throw new Error("executeSvmTransaction error: signedTx is undefined");
  }

  const endpoint = await getRpcEndpointForChain(svmTx.chainId);
  const connection = new Connection(endpoint);

  let signature: string | undefined;

  await submitTransaction({
    chainId: svmTx.chainId,
    tx: signedTx.toString("base64"),
  }).then((res) => {
    signature = res?.txHash;
  });

  const rpcSig = await connection.sendRawTransaction(signedTx, {
    preflightCommitment: "confirmed",
    maxRetries: 5,
  });

  signature = rpcSig;
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
          `executeSvmTransaction error: waiting finalized status timed out for ${signature}`
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
