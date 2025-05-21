import { ErrorPageAuthFailedProps } from "@/pages/BlockingPage/ErrorPage/ErrorPageAuthFailed";
import { WarningCosmosLedgerProps } from "@/pages/BlockingPage/WarningPage/WarningPageCosmosLedger";
import { WarningPageGoFastProps } from "@/pages/BlockingPage/WarningPage/WarningPageGoFast";
import { ErrorPageTimeoutProps } from "@/pages/BlockingPage/ErrorPage/ErrorPageTimeout";
import { WarningPageTradeAdditionalSigningRequiredProps } from "@/pages/BlockingPage/WarningPage/WarningPageTradeAdditionalSigningRequired";
import { WarningPageBadPriceProps } from "@/pages/BlockingPage/WarningPage/WarningPageBadPrice";
import { ErrorPageTransactionFailedProps } from "@/pages/BlockingPage/ErrorPage/ErrorPageTransactionFailed";
import { ErrorPageTransactionRevertedProps } from "@/pages/BlockingPage/ErrorPage/ErrorPageTransactionReverted";
import { ErrorPageUnexpectedProps } from "@/pages/BlockingPage/ErrorPage/ErrorPageUnexpected";
import { atomWithReset } from "jotai/utils";
import { WarningPageLowInfoProps } from "@/pages/BlockingPage/WarningPage/WarningPageLowInfo";
import { InsufficientBalanceForGasProps } from "@/pages/BlockingPage/ErrorPage/ErrorPageInsufficientGasBalance";

export const blockingPageAtom = atomWithReset<BlockingPageVariants | undefined>(undefined);

export type BlockingPageVariants =
  | ({ blockingType: BlockingType.AuthFailed } & ErrorPageAuthFailedProps)
  | ({ blockingType: BlockingType.Timeout } & ErrorPageTimeoutProps)
  | ({
      blockingType: BlockingType.AdditionalSigningRequired;
    } & WarningPageTradeAdditionalSigningRequiredProps)
  | ({ blockingType: BlockingType.BadPriceWarning } & WarningPageBadPriceProps)
  | ({ blockingType: BlockingType.CosmosLedgerWarning } & WarningCosmosLedgerProps)
  | ({ blockingType: BlockingType.TransactionFailed } & ErrorPageTransactionFailedProps)
  | ({ blockingType: BlockingType.TransactionReverted } & ErrorPageTransactionRevertedProps)
  | ({ blockingType: BlockingType.Unexpected } & ErrorPageUnexpectedProps)
  | ({ blockingType: BlockingType.GoFastWarning } & WarningPageGoFastProps)
  | ({ blockingType: BlockingType.LowInfoWarning } & WarningPageLowInfoProps)
  | ({ blockingType: BlockingType.InsufficientBalanceForGas } & InsufficientBalanceForGasProps);

export enum BlockingType {
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
