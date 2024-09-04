import { ErrorPageAuthFailedProps } from "@/pages/ErrorPage/ErrorPageAuthFailed";
import { ErrorPageTimeoutProps } from "@/pages/ErrorPage/ErrorPageTimeout";
import { ErrorPageTradeWarningProps } from "@/pages/ErrorPage/ErrorPageTradeWarning";
import { ErrorPageTransactionFailedProps } from "@/pages/ErrorPage/ErrorPageTransactionFailed";
import { ErrorPageUnexpectedProps } from "@/pages/ErrorPage/ErrorPageUnexpected";
import { atomWithReset } from "jotai/utils";

export const errorAtom = atomWithReset<ErrorPageVariants | undefined>(
  undefined
);

type ErrorPageVariants =
  | ({ errorType: ErrorType.Timeout } & ErrorPageTimeoutProps)
  | ({ errorType: ErrorType.TradeWarning } & ErrorPageTradeWarningProps)
  | ({ errorType: ErrorType.AuthFailed } & ErrorPageAuthFailedProps)
  | ({ errorType: ErrorType.TransactionFailed } & ErrorPageTransactionFailedProps)
  | ({ errorType: ErrorType.Unexpected } & ErrorPageUnexpectedProps);

export enum ErrorType {
  Timeout,
  TradeWarning,
  AuthFailed,
  TransactionFailed,
  Unexpected,
}
