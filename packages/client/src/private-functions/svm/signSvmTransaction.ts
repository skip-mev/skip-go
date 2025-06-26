import type { SvmTx } from "src/types/swaggerTypes";
import { PublicKey, Transaction } from "@solana/web3.js";
import { ClientState } from "src/state/clientState";
import type { ExecuteRouteOptions } from "src/public-functions/executeRoute";
import { updateRouteDetails } from "src/public-functions/subscribeToRouteStatus";

export const signSvmTransaction = async ({
  tx,
  options,
  index,
}: {
  index: number;
  tx?: { svmTx?: SvmTx };
  options?: ExecuteRouteOptions;
}) => {
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
  if (options.svmFeePayer) {
    const message = transaction.serializeMessage();
    const resSignTx = await options.svmFeePayer.signTransaction(message);
    transaction.addSignature(
      new PublicKey(options.svmFeePayer.address),
      Buffer.from(resSignTx)
    );
  }

  if (!("signTransaction" in signer)) return;
  options?.onTransactionSignRequested?.({
    chainId: svmTx.chainId,
    signerAddress: signer.publicKey?.toBase58(),
    txIndex: index,
  });

  updateRouteDetails({
    status: "signing",
    options
  });

  const signedTx = await signer.signTransaction(transaction);

  options?.onTransactionSigned?.({ chainId: svmTx.chainId });

  updateRouteDetails({
    status: "pending",
    options
  });

  const serializedTx = signedTx.serialize();
  return serializedTx;
};
