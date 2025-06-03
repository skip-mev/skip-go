import { ErrorWarningPage } from "@/pages/ErrorWarningPage/ErrorWarningPage";
import { SwapExecutionPage } from "@/pages/SwapExecutionPage/SwapExecutionPage";
import { SwapPage } from "@/pages/SwapPage/SwapPage";
import { TransactionHistoryPage } from "@/pages/TransactionHistoryPage/TransactionHistoryPage";
import { errorWarningAtom, ErrorWarningType } from "@/state/errorWarning";
import { Routes, currentPageAtom } from "@/state/router";
import { useAtom } from "jotai";
import { ErrorBoundary } from "react-error-boundary";
import { useKeepWalletStateSynced } from "@/hooks/useKeepWalletStateSynced";
import { track } from "@amplitude/analytics-browser";

export const Router = () => {
  useKeepWalletStateSynced();
  const [currentPage] = useAtom(currentPageAtom);
  const [errorWarning, setErrorWarning] = useAtom(errorWarningAtom);

  if (errorWarning) {
    return <ErrorWarningPage />;
  }

  switch (currentPage) {
    case Routes.SwapPage:
      return (
        <ErrorBoundary
          fallback={null}
          onError={(error) => {
            console.log("error", error);
            track("unexpected error page: unexpected error from swap page", { error });
            setErrorWarning({ errorWarningType: ErrorWarningType.Unexpected, error });
          }}
        >
          <SwapPage />
        </ErrorBoundary>
      );
    case Routes.SwapExecutionPage:
      return (
        <ErrorBoundary
          fallback={null}
          onError={(error) => {
            track("unexpected error page: unexpected error from execution page", { error });
            setErrorWarning({ errorWarningType: ErrorWarningType.Unexpected, error });
          }}
        >
          <SwapExecutionPage />
        </ErrorBoundary>
      );
    case Routes.TransactionHistoryPage:
      return (
        <ErrorBoundary
          fallback={null}
          onError={(error) => {
            track("unexpected error page: unexpected error from transaction history page", {
              error,
            });
            setErrorWarning({ errorWarningType: ErrorWarningType.Unexpected, error });
          }}
        >
          <TransactionHistoryPage />
        </ErrorBoundary>
      );
  }
};
