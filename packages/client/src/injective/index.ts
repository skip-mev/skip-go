import { StdFee } from "@cosmjs/amino";
import {
  CosmosTxSigningV1Beta1Signing,
  CosmosTxV1Beta1Tx,
} from "@injectivelabs/core-proto-ts/cjs";
import {
  createAuthInfo,
  createBody,
  createFee,
  createSignDoc,
  createSigners,
} from "@injectivelabs/sdk-ts/dist/esm/core/modules/tx/utils/tx";
import { DEFAULT_STD_FEE } from "@injectivelabs/utils";

import createKeccakHash from "keccak";

export interface CreateTransactionArgs {
  fee?: StdFee; // the fee to include in the transaction
  memo?: string; // the memo to include in the transaction
  chainId: string; // the chain id of the chain that the transaction is going to be broadcasted to
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  message: any | any[]; // the message that should be packed into the transaction
  pubKey: string; // the pubKey of the signer of the transaction in base64
  sequence: number; // the sequence (nonce) of the signer of the transaction
  accountNumber: number; // the account number of the signer of the transaction
  signMode?: CosmosTxSigningV1Beta1Signing.SignMode;
  timeoutHeight?: number; // the height at which the transaction should be considered invalid
}

export function createTransaction({
  chainId,
  message,
  timeoutHeight,
  memo = "",
  fee = DEFAULT_STD_FEE,
  signMode = 1,
  pubKey,
  accountNumber,
  sequence,
}: CreateTransactionArgs) {
  const signers = {
    pubKey: pubKey,
    accountNumber: accountNumber,
    sequence: sequence,
  };

  const actualSigners = Array.isArray(signers) ? signers : [signers];
  const [signer] = actualSigners;

  const body = createBody({ message, memo, timeoutHeight });

  if (!fee.amount[0]) {
    throw new Error("createTransaction error: unable to get fee amount");
  }

  const feeMessage = createFee({
    fee: fee.amount[0],
    payer: fee.payer,
    granter: fee.granter,
    gasLimit: parseInt(fee.gas, 10),
  });

  const signInfo = createSigners({
    chainId,
    mode: signMode,
    signers: actualSigners,
  });

  const authInfo = createAuthInfo({
    signerInfo: signInfo,
    fee: feeMessage,
  });

  const bodyBytes = CosmosTxV1Beta1Tx.TxBody.encode(body).finish();
  const authInfoBytes = CosmosTxV1Beta1Tx.AuthInfo.encode(authInfo).finish();

  const signDoc = createSignDoc({
    chainId,
    bodyBytes: bodyBytes,
    authInfoBytes: authInfoBytes,
    accountNumber: signer.accountNumber,
  });

  const signDocBytes = CosmosTxV1Beta1Tx.SignDoc.encode(signDoc).finish();
  const toSignBytes = Buffer.from(signDocBytes);
  const toSignHash = createKeccakHash("keccak256").update(toSignBytes).digest();
  const txRaw = CosmosTxV1Beta1Tx.TxRaw.create();
  txRaw.authInfoBytes = authInfoBytes;
  txRaw.bodyBytes = bodyBytes;

  return {
    txRaw,
    signDoc,
    signers,
    signer,
    signBytes: toSignBytes,
    signHashedBytes: toSignHash,
    bodyBytes: bodyBytes,
    authInfoBytes: authInfoBytes,
  };
}
