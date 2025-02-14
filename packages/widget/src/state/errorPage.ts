import { ErrorPageAuthFailedProps } from "@/pages/ErrorPage/ErrorPageAuthFailed";
import { ErrorCosmosLedgerWarningProps } from "@/pages/ErrorPage/ErrorPageCosmosLedgerWarning";
import { ErrorPageGoFastWarningProps } from "@/pages/ErrorPage/ErrorPageGoFastWarning";
import { ErrorPageTimeoutProps } from "@/pages/ErrorPage/ErrorPageTimeout";
import { ErrorPageTradeAdditionalSigningRequiredProps } from "@/pages/ErrorPage/ErrorPageTradeAdditionalSigningRequired";
import { ErrorPageTradeWarningProps } from "@/pages/ErrorPage/ErrorPageTradeWarning";
import { ErrorPageTransactionFailedProps } from "@/pages/ErrorPage/ErrorPageTransactionFailed";
import { ErrorPageTransactionRevertedProps } from "@/pages/ErrorPage/ErrorPageTransactionReverted";
import { ErrorPageUnexpectedProps } from "@/pages/ErrorPage/ErrorPageUnexpected";
import { atomWithReset } from "jotai/utils";

export const errorAtom = atomWithReset<ErrorPageVariants | undefined>(undefined);

export type ErrorPageVariants =
  | ({ errorType: ErrorType.AuthFailed } & ErrorPageAuthFailedProps)
  | ({ errorType: ErrorType.Timeout } & ErrorPageTimeoutProps)
  | ({
      errorType: ErrorType.AdditionalSigningRequired;
    } & ErrorPageTradeAdditionalSigningRequiredProps)
  | ({ errorType: ErrorType.TradeWarning } & ErrorPageTradeWarningProps)
  | ({ errorType: ErrorType.CosmosLedgerWarning } & ErrorCosmosLedgerWarningProps)
  | ({ errorType: ErrorType.TransactionFailed } & ErrorPageTransactionFailedProps)
  | ({ errorType: ErrorType.TransactionReverted } & ErrorPageTransactionRevertedProps)
  | ({ errorType: ErrorType.Unexpected } & ErrorPageUnexpectedProps)
  | ({ errorType: ErrorType.GoFastWarning } & ErrorPageGoFastWarningProps);

export enum ErrorType {
  AuthFailed,
  Timeout,
  AdditionalSigningRequired,
  TradeWarning,
  TransactionFailed,
  TransactionReverted,
  Unexpected,
  CosmosLedgerWarning,
  GoFastWarning
}
