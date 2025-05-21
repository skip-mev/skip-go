import { blockingPageAtom, BlockingType } from "@/state/blockingPage";
import { useAtom } from "jotai";
import { WarningPageBadPrice } from "./WarningPage/WarningPageBadPrice";
import { ExpectedErrorPageAuthFailed } from "./ExpectedErrorPages/ExpectedErrorPageAuthFailed";
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
import { ExpectedErrorPageInsufficientGasBalance } from "./ExpectedErrorPages/ExpectedErrorPageInsufficientGasBalance";

export const BlockingPage = () => {
  const [blockingPage] = useAtom(blockingPageAtom);

  const renderErrorVariant = useMemo(() => {
    switch (blockingPage?.blockingType) {
      case BlockingType.AuthFailed:
        return <ExpectedErrorPageAuthFailed {...blockingPage} />;
      case BlockingType.GoFastWarning:
        return <WarningPageGoFast {...blockingPage} />;
      case BlockingType.Timeout:
        return <UnexpectedErrorPageTimeout {...blockingPage} />;
      case BlockingType.AdditionalSigningRequired:
        return <WarningPageTradeAdditionalSigningRequired {...blockingPage} />;
      case BlockingType.BadPriceWarning:
        return <WarningPageBadPrice {...blockingPage} />;
      case BlockingType.TransactionFailed:
        return <UnexpectedErrorPageTransactionFailed {...blockingPage} />;
      case BlockingType.TransactionReverted:
        return <UnexpectedErrorPageTransactionReverted {...blockingPage} />;
      case BlockingType.Unexpected:
        return <UnexpectedErrorPageUnexpected error={blockingPage.error} />;
      case BlockingType.InsufficientBalanceForGas:
        return <ExpectedErrorPageInsufficientGasBalance error={blockingPage.error} />;
      case BlockingType.CosmosLedgerWarning:
        return <WarningPageCosmosLedger {...blockingPage} />;
      case BlockingType.LowInfoWarning:
        return <WarningPageLowInfo {...blockingPage} />;
      default:
        return;
    }
  }, [blockingPage]);

  if (blockingPage?.blockingType === undefined) return null;

  return <Column gap={5}>{renderErrorVariant}</Column>;
};
