import { errorWarningAtom, ErrorWarningType } from "@/state/errorWarning";
import { useAtom } from "jotai";
import { WarningPageBadPrice } from "./WarningPage/WarningPageBadPrice";
import { ExpectedErrorPageAuthFailed } from "./ExpectedErrorPage/ExpectedErrorPageAuthFailed";
import { UnexpectedErrorPageTransactionFailed } from "./UnexpectedErrorPage/UnexpectedErrorPageTransactionFailed";
import { UnexpectedErrorPageUnexpected } from "./UnexpectedErrorPage/UnexpectedErrorPageUnexpected";
import { useMemo } from "react";
import { Column } from "@/components/Layout";
import { UnexpectedErrorPageTimeout } from "./UnexpectedErrorPage/UnexpectedErrorPageTimeout";
import { WarningPageTradeAdditionalSigningRequired } from "./WarningPage/WarningPageTradeAdditionalSigningRequired";
import { UnexpectedErrorPageTransactionReverted } from "./UnexpectedErrorPage/UnexpectedErrorPageTransactionReverted";
import { WarningPageCosmosLedger } from "./WarningPage/WarningPageCosmosLedger";
import { WarningPageGoFast } from "./WarningPage/WarningPageGoFast";
import { WarningPageLowInfo } from "./WarningPage/WarningPageLowInfo";
import { ExpectedErrorPageInsufficientGasBalance } from "./ExpectedErrorPage/ExpectedErrorPageInsufficientGasBalance";

export const ErrorWarningPage = () => {
  const [errorWarningPage] = useAtom(errorWarningAtom);

  const renderErrorVariant = useMemo(() => {
    switch (errorWarningPage?.errorWarningType) {
      case ErrorWarningType.AuthFailed:
        return <ExpectedErrorPageAuthFailed {...errorWarningPage} />;
      case ErrorWarningType.GoFastWarning:
        return <WarningPageGoFast {...errorWarningPage} />;
      case ErrorWarningType.Timeout:
        return <UnexpectedErrorPageTimeout {...errorWarningPage} />;
      case ErrorWarningType.AdditionalSigningRequired:
        return <WarningPageTradeAdditionalSigningRequired {...errorWarningPage} />;
      case ErrorWarningType.BadPriceWarning:
        return <WarningPageBadPrice {...errorWarningPage} />;
      case ErrorWarningType.TransactionFailed:
        return <UnexpectedErrorPageTransactionFailed {...errorWarningPage} />;
      case ErrorWarningType.TransactionReverted:
        return <UnexpectedErrorPageTransactionReverted {...errorWarningPage} />;
      case ErrorWarningType.Unexpected:
        return <UnexpectedErrorPageUnexpected error={errorWarningPage.error} />;
      case ErrorWarningType.InsufficientBalanceForGas:
        return <ExpectedErrorPageInsufficientGasBalance error={errorWarningPage.error} />;
      case ErrorWarningType.CosmosLedgerWarning:
        return <WarningPageCosmosLedger {...errorWarningPage} />;
      case ErrorWarningType.LowInfoWarning:
        return <WarningPageLowInfo {...errorWarningPage} />;
      default:
        return;
    }
  }, [errorWarningPage]);

  if (errorWarningPage?.errorWarningType === undefined) return null;

  return <Column gap={5}>{renderErrorVariant}</Column>;
};
