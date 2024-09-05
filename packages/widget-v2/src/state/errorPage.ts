import { ErrorPageAuthFailedProps } from "@/pages/ErrorPage/ErrorPageAuthFailed";
import { ErrorPageTimeoutProps } from "@/pages/ErrorPage/ErrorPageTimeout";
import { ErrorPageTradeAdditionalSigningRequiredProps } from "@/pages/ErrorPage/ErrorPageTradeAdditionalSingingRequired";
import { ErrorPageTradeWarningProps } from "@/pages/ErrorPage/ErrorPageTradeWarning";
import { ErrorPageTransactionFailedProps } from "@/pages/ErrorPage/ErrorPageTransactionFailed";
import { ErrorPageTransactionRevertedProps } from "@/pages/ErrorPage/ErrorPageTransactionReverted";
import { ErrorPageUnexpectedProps } from "@/pages/ErrorPage/ErrorPageUnexpected";
import { atomWithReset } from "jotai/utils";

export const errorAtom = atomWithReset<ErrorPageVariants | undefined>(
  undefined
);

export type ErrorPageVariants =
  | ({ errorType: ErrorType.AuthFailed } & ErrorPageAuthFailedProps)
  | ({ errorType: ErrorType.Timeout } & ErrorPageTimeoutProps)
  | ({ errorType: ErrorType.AdditionalSigningRequired } & ErrorPageTradeAdditionalSigningRequiredProps)
  | ({ errorType: ErrorType.TradeWarning } & ErrorPageTradeWarningProps)
  | ({ errorType: ErrorType.TransactionFailed } & ErrorPageTransactionFailedProps)
  | ({ errorType: ErrorType.TransactionReverted } & ErrorPageTransactionRevertedProps)
  | ({ errorType: ErrorType.Unexpected } & ErrorPageUnexpectedProps);

export enum ErrorType {
  AuthFailed,
  Timeout,
  AdditionalSigningRequired,
  TradeWarning,
  TransactionFailed,
  TransactionReverted,
  Unexpected,
}
