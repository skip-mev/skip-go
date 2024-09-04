import { errorAtom, ErrorType } from "@/state/errorPage";
import { useAtom } from "jotai";
import { ErrorPageTradeWarning } from "./ErrorPageTradeWarning";
import { ErrorPageAuthFailed } from "./ErrorPageAuthFailed";
import { ErrorPageTransactionFailed } from "./ErrorPageTransactionFailed";
import { ErrorPageUnexpected } from "./ErrorPageUnexpected";

export const ErrorPage = () => {
  const [error] = useAtom(errorAtom);

  if (error?.errorType === undefined) return;

  switch (error.errorType) {
    case ErrorType.TradeWarning:
      return <ErrorPageTradeWarning {...error} />;
    case ErrorType.AuthFailed:
      return <ErrorPageAuthFailed {...error} />;
    case ErrorType.TransactionFailed: 
      return <ErrorPageTransactionFailed {...error} />;
    case ErrorType.Unexpected:
      return <ErrorPageUnexpected error={error.error} />;
    default:
      return;
  }
};
