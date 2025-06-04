import type { SvmTx } from "src/types/swaggerTypes";
import { Connection, Transaction } from "@solana/web3.js";
import { getRpcEndpointForChain } from "../getRpcEndpointForChain";
import { ClientState } from "src/state/clientState";
import type { ExecuteRouteOptions } from "src/public-functions/executeRoute";

export const signSvmTransaction = async (
  tx?: { svmTx?: SvmTx },
  options?: ExecuteRouteOptions
) => {
  const gasArray = ClientState.validateGasResults;

  if (tx === undefined) {
    throw new Error("executeSvmTransaction error: tx is undefined");
  }

  const gas = gasArray?.find(
    (gas) => gas?.error !== null && gas?.error !== undefined
  );
  if (typeof gas?.error === "string") {
    throw new Error(gas?.error);
  }

  const svmTx = tx?.svmTx;
  const getSvmSigner = options?.getSvmSigner;
  if (!getSvmSigner) {
    throw new Error(
      "executeSvmTransaction error: getSvmSigner is not provided"
    );
  }

  const signer = await getSvmSigner();

  if (!svmTx?.chainId) {
    throw new Error("executeSvmTransaction error: chainId not found in svmTx");
  }

  const txBuffer = Buffer.from(svmTx.tx ?? "", "base64");
  const transaction = Transaction.from(txBuffer);

  if (!("signTransaction" in signer)) return;

  const signedTx = await signer.signTransaction(transaction);
  options?.onTransactionSigned?.({ chainId: svmTx.chainId });

  const serializedTx = signedTx.serialize();
  return serializedTx.toString("base64");
};
