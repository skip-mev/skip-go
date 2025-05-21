import { ErrorPageAuthFailedProps } from "@/pages/ErrorPage/ErrorPageAuthFailed";
import { ErrorCosmosLedgerWarningProps } from "@/pages/ErrorPage/ErrorPageCosmosLedgerWarning";
import { ErrorPageGoFastWarningProps } from "@/pages/ErrorPage/ErrorPageGoFastWarning";
import { ErrorPageTimeoutProps } from "@/pages/ErrorPage/ErrorPageTimeout";
import { ErrorPageTradeAdditionalSigningRequiredProps } from "@/pages/ErrorPage/ErrorPageTradeAdditionalSigningRequired";
import { ErrorPageBadPriceWarningProps } from "@/pages/ErrorPage/ErrorPageBadPriceWarning";
import { ErrorPageTransactionFailedProps } from "@/pages/ErrorPage/ErrorPageTransactionFailed";
import { ErrorPageTransactionRevertedProps } from "@/pages/ErrorPage/ErrorPageTransactionReverted";
import { ErrorPageUnexpectedProps } from "@/pages/ErrorPage/ErrorPageUnexpected";
import { atomWithReset } from "jotai/utils";
import { ErrorPageLowInfoWarningProps } from "@/pages/ErrorPage/ErrorPageLowInfoWarning";
import { InsufficientBalanceForGasProps } from "@/pages/ErrorPage/ErrorPageInsufficientGasBalance";

export const errorAtom = atomWithReset<ErrorPageVariants | undefined>(undefined);

export type ErrorPageVariants =
  | ({ errorType: ErrorType.AuthFailed } & ErrorPageAuthFailedProps)
  | ({ errorType: ErrorType.Timeout } & ErrorPageTimeoutProps)
  | ({
      errorType: ErrorType.AdditionalSigningRequired;
    } & ErrorPageTradeAdditionalSigningRequiredProps)
  | ({ errorType: ErrorType.BadPriceWarning } & ErrorPageBadPriceWarningProps)
  | ({ errorType: ErrorType.CosmosLedgerWarning } & ErrorCosmosLedgerWarningProps)
  | ({ errorType: ErrorType.TransactionFailed } & ErrorPageTransactionFailedProps)
  | ({ errorType: ErrorType.TransactionReverted } & ErrorPageTransactionRevertedProps)
  | ({ errorType: ErrorType.Unexpected } & ErrorPageUnexpectedProps)
  | ({ errorType: ErrorType.GoFastWarning } & ErrorPageGoFastWarningProps)
  | ({ errorType: ErrorType.LowInfoWarning } & ErrorPageLowInfoWarningProps)
  | ({ errorType: ErrorType.InsufficientBalanceForGas } & InsufficientBalanceForGasProps);

export enum ErrorType {
  AuthFailed,
  Timeout,
  AdditionalSigningRequired,
  BadPriceWarning,
  TransactionFailed,
  TransactionReverted,
  Unexpected,
  CosmosLedgerWarning,
  GoFastWarning,
  LowInfoWarning,
  InsufficientBalanceForGas,
}
