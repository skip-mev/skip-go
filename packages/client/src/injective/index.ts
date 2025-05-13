import {
  createTransactionWithSigners,
  CreateTransactionArgs as CreateTransactionArgsInjective,
} from "@injectivelabs/sdk-ts";
import { DEFAULT_STD_FEE } from "@injectivelabs/utils";

export type CreateTransactionArgs = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  message: any | any[]; // the message that should be packed into the transaction
} & CreateTransactionArgsInjective

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

  return createTransactionWithSigners({
    fee,
    memo,
    message,
    signers,
    chainId,
    signMode,
    timeoutHeight,
  });
}
