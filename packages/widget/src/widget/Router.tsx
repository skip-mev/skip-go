import { ErrorPage } from "@/pages/ErrorPage/ErrorPage";
import { SwapExecutionPage } from "@/pages/SwapExecutionPage/SwapExecutionPage";
import { SwapPage } from "@/pages/SwapPage/SwapPage";
import { TransactionHistoryPage } from "@/pages/TransactionHistoryPage/TransactionHistoryPage";
import { errorAtom, ErrorType } from "@/state/errorPage";
import { Routes, currentPageAtom } from "@/state/router";
import { useAtom } from "jotai";
import { ErrorBoundary } from "react-error-boundary";
import { useKeepWalletStateSynced } from "@/hooks/useKeepWalletStateSynced";
import { track } from "@amplitude/analytics-browser";

export const Router = () => {
  useKeepWalletStateSynced();
  const [currentPage] = useAtom(currentPageAtom);
  const [error, setError] = useAtom(errorAtom);

  if (error) {
    return <ErrorPage />;
  }

  switch (currentPage) {
    case Routes.SwapPage:
      return (
        <ErrorBoundary
          fallback={null}
          onError={(error) => {
            track("error page: unexpected error from swap page", { error });
            setError({ errorType: ErrorType.Unexpected, error });
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
            track("error page: unexpected error from execution page", { error });
            setError({ errorType: ErrorType.Unexpected, error });
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
            track("error page: unexpected error from transaction history page", { error });
            setError({ errorType: ErrorType.Unexpected, error });
          }}
        >
          <TransactionHistoryPage />
        </ErrorBoundary>
      );
  }
};
