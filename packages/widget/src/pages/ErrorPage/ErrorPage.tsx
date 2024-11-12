import { errorAtom, ErrorType } from "@/state/errorPage";
import { useAtom } from "jotai";
import { ErrorPageTradeWarning } from "./ErrorPageTradeWarning";
import { ErrorPageAuthFailed } from "./ErrorPageAuthFailed";
import { ErrorPageTransactionFailed } from "./ErrorPageTransactionFailed";
import { ErrorPageUnexpected } from "./ErrorPageUnexpected";
import { useMemo } from "react";
import { ErrorPageTimeout } from "./ErrorPageTimeout";
import { ErrorPageTradeAdditionalSigningRequired } from "./ErrorPageTradeAdditionalSingingRequired";
import { ErrorPageTransactionReverted } from "./ErrorPageTransactionReverted";
import { PageContainer } from "@/components/Layout";

export const ErrorPage = () => {
  const [error] = useAtom(errorAtom);

  const renderErrorVariant = useMemo(() => {
    switch (error?.errorType) {
      case ErrorType.AuthFailed:
        return <ErrorPageAuthFailed {...error} />;
      case ErrorType.Timeout:
        return <ErrorPageTimeout {...error} />;
      case ErrorType.AdditionalSigningRequired:
        return <ErrorPageTradeAdditionalSigningRequired {...error} />;
      case ErrorType.TradeWarning:
        return <ErrorPageTradeWarning {...error} />;
      case ErrorType.TransactionFailed:
        return <ErrorPageTransactionFailed {...error} />;
      case ErrorType.TransactionReverted:
        return <ErrorPageTransactionReverted {...error} />;
      case ErrorType.Unexpected:
        return <ErrorPageUnexpected error={error.error} />;
      default:
        return;
    }
  }, [error]);

  if (error?.errorType === undefined) return;

  return <PageContainer>{renderErrorVariant}</PageContainer>;
};
