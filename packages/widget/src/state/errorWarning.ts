import { ExpectedErrorPageAuthFailedProps } from "@/pages/ErrorWarningPage/ExpectedErrorPage/ExpectedErrorPageAuthFailed";
import { WarningCosmosLedgerProps } from "@/pages/ErrorWarningPage/WarningPage/WarningPageCosmosLedger";
import { WarningPageGoFastProps } from "@/pages/ErrorWarningPage/WarningPage/WarningPageGoFast";
import { WarningPageTradeAdditionalSigningRequiredProps } from "@/pages/ErrorWarningPage/WarningPage/WarningPageTradeAdditionalSigningRequired";
import { WarningPageBadPriceProps } from "@/pages/ErrorWarningPage/WarningPage/WarningPageBadPrice";
import { UnexpectedErrorPageTransactionFailedProps } from "@/pages/ErrorWarningPage/UnexpectedErrorPage/UnexpectedErrorPageTransactionFailed";
import { UnexpectedErrorPageTransactionRevertedProps } from "@/pages/ErrorWarningPage/UnexpectedErrorPage/UnexpectedErrorPageTransactionReverted";
import { UnexpectedErrorPageUnexpectedProps } from "@/pages/ErrorWarningPage/UnexpectedErrorPage/UnexpectedErrorPageUnexpected";
import { atomWithReset } from "jotai/utils";
import { WarningPageLowInfoProps } from "@/pages/ErrorWarningPage/WarningPage/WarningPageLowInfo";
import { ExpectedErrorPageInsufficientBalanceForGasProps } from "@/pages/ErrorWarningPage/ExpectedErrorPage/ExpectedErrorPageInsufficientGasBalance";
import { UnexpectedErrorPageTimeoutProps } from "@/pages/ErrorWarningPage/UnexpectedErrorPage/UnexpectedErrorPageTimeout";

export const errorWarningAtom = atomWithReset<ErrorWarningPageVariants | undefined>(undefined);

export type ErrorWarningPageVariants =
  | ({ errorWarningType: ErrorWarningType.AuthFailed } & ExpectedErrorPageAuthFailedProps)
  | ({ errorWarningType: ErrorWarningType.Timeout } & UnexpectedErrorPageTimeoutProps)
  | ({
      errorWarningType: ErrorWarningType.AdditionalSigningRequired;
    } & WarningPageTradeAdditionalSigningRequiredProps)
  | ({ errorWarningType: ErrorWarningType.BadPriceWarning } & WarningPageBadPriceProps)
  | ({ errorWarningType: ErrorWarningType.CosmosLedgerWarning } & WarningCosmosLedgerProps)
  | ({
      errorWarningType: ErrorWarningType.TransactionFailed;
    } & UnexpectedErrorPageTransactionFailedProps)
  | ({
      errorWarningType: ErrorWarningType.TransactionReverted;
    } & UnexpectedErrorPageTransactionRevertedProps)
  | ({ errorWarningType: ErrorWarningType.Unexpected } & UnexpectedErrorPageUnexpectedProps)
  | ({ errorWarningType: ErrorWarningType.GoFastWarning } & WarningPageGoFastProps)
  | ({ errorWarningType: ErrorWarningType.LowInfoWarning } & WarningPageLowInfoProps)
  | ({
      errorWarningType: ErrorWarningType.InsufficientBalanceForGas;
    } & ExpectedErrorPageInsufficientBalanceForGasProps)
  | ({
      errorWarningType: ErrorWarningType.ExpiredRelayFeeQuote;
    } & ExpiredRelayFeeQuoteProps);

export enum ErrorWarningType {
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
  ExpiredRelayFeeQuote
}
