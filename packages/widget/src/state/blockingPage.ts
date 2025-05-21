import { ExpectedErrorPageAuthFailedProps } from "@/pages/BlockingPage/ExpectedErrorPage/ExpectedErrorPageAuthFailed";
import { WarningCosmosLedgerProps } from "@/pages/BlockingPage/WarningPage/WarningPageCosmosLedger";
import { WarningPageGoFastProps } from "@/pages/BlockingPage/WarningPage/WarningPageGoFast";
import { WarningPageTradeAdditionalSigningRequiredProps } from "@/pages/BlockingPage/WarningPage/WarningPageTradeAdditionalSigningRequired";
import { WarningPageBadPriceProps } from "@/pages/BlockingPage/WarningPage/WarningPageBadPrice";
import { UnexpectedErrorPageTransactionFailedProps } from "@/pages/BlockingPage/UnexpectedErrorPage/UnexpectedErrorPageTransactionFailed";
import { UnexpectedErrorPageTransactionRevertedProps } from "@/pages/BlockingPage/UnexpectedErrorPage/UnexpectedErrorPageTransactionReverted";
import { UnexpectedErrorPageUnexpectedProps } from "@/pages/BlockingPage/UnexpectedErrorPage/UnexpectedErrorPageUnexpected";
import { atomWithReset } from "jotai/utils";
import { WarningPageLowInfoProps } from "@/pages/BlockingPage/WarningPage/WarningPageLowInfo";
import { ExpectedErrorPageInsufficientBalanceForGasProps } from "@/pages/BlockingPage/ExpectedErrorPage/ExpectedErrorPageInsufficientGasBalance";
import { UnexpectedErrorPageTimeoutProps } from "@/pages/BlockingPage/UnexpectedErrorPage/UnexpectedErrorPageTimeout";

export const blockingPageAtom = atomWithReset<BlockingPageVariants | undefined>(undefined);

export type BlockingPageVariants =
  | ({ blockingType: BlockingType.AuthFailed } & ExpectedErrorPageAuthFailedProps)
  | ({ blockingType: BlockingType.Timeout } & UnexpectedErrorPageTimeoutProps)
  | ({
      blockingType: BlockingType.AdditionalSigningRequired;
    } & WarningPageTradeAdditionalSigningRequiredProps)
  | ({ blockingType: BlockingType.BadPriceWarning } & WarningPageBadPriceProps)
  | ({ blockingType: BlockingType.CosmosLedgerWarning } & WarningCosmosLedgerProps)
  | ({ blockingType: BlockingType.TransactionFailed } & UnexpectedErrorPageTransactionFailedProps)
  | ({
      blockingType: BlockingType.TransactionReverted;
    } & UnexpectedErrorPageTransactionRevertedProps)
  | ({ blockingType: BlockingType.Unexpected } & UnexpectedErrorPageUnexpectedProps)
  | ({ blockingType: BlockingType.GoFastWarning } & WarningPageGoFastProps)
  | ({ blockingType: BlockingType.LowInfoWarning } & WarningPageLowInfoProps)
  | ({
      blockingType: BlockingType.InsufficientBalanceForGas;
    } & ExpectedErrorPageInsufficientBalanceForGasProps);

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
