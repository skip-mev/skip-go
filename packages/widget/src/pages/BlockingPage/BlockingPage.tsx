import { blockingPageAtom, BlockingType } from "@/state/blockingPage";
import { useAtom } from "jotai";
import { WarningPageBadPrice } from "./WarningPage/WarningPageBadPrice";
import { ErrorPageAuthFailed } from "./ErrorPage/ErrorPageAuthFailed";
import { ErrorPageTransactionFailed } from "./ErrorPage/ErrorPageTransactionFailed";
import { ErrorPageUnexpected } from "./ErrorPage/ErrorPageUnexpected";
import { useMemo } from "react";
import { Column } from "@/components/Layout";
import { ErrorPageTimeout } from "./ErrorPage/ErrorPageTimeout";
import { WarningPageTradeAdditionalSigningRequired } from "./WarningPage/WarningPageTradeAdditionalSigningRequired";
import { ErrorPageTransactionReverted } from "./ErrorPage/ErrorPageTransactionReverted";
import { WarningPageCosmosLedger } from "./WarningPage/WarningPageCosmosLedger";
import { WarningPageGoFast } from "./WarningPage/WarningPageGoFast";
import { WarningPageLowInfo } from "./WarningPage/WarningPageLowInfo";
import { ErrorPageInsufficientGasBalance } from "./ErrorPage/ErrorPageInsufficientGasBalance";

export const BlockingPage = () => {
  const [blockingPage] = useAtom(blockingPageAtom);

  const renderErrorVariant = useMemo(() => {
    switch (blockingPage?.blockingType) {
      case BlockingType.AuthFailed:
        return <ErrorPageAuthFailed {...blockingPage} />;
      case BlockingType.GoFastWarning:
        return <WarningPageGoFast {...blockingPage} />;
      case BlockingType.Timeout:
        return <ErrorPageTimeout {...blockingPage} />;
      case BlockingType.AdditionalSigningRequired:
        return <WarningPageTradeAdditionalSigningRequired {...blockingPage} />;
      case BlockingType.BadPriceWarning:
        return <WarningPageBadPrice {...blockingPage} />;
      case BlockingType.TransactionFailed:
        return <ErrorPageTransactionFailed {...blockingPage} />;
      case BlockingType.TransactionReverted:
        return <ErrorPageTransactionReverted {...blockingPage} />;
      case BlockingType.Unexpected:
        return <ErrorPageUnexpected error={blockingPage.error} />;
      case BlockingType.InsufficientBalanceForGas:
        return <ErrorPageInsufficientGasBalance error={blockingPage.error} />;
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
