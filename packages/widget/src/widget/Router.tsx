import { BlockingPage } from "@/pages/BlockingPage/BlockingPage";
import { SwapExecutionPage } from "@/pages/SwapExecutionPage/SwapExecutionPage";
import { SwapPage } from "@/pages/SwapPage/SwapPage";
import { TransactionHistoryPage } from "@/pages/TransactionHistoryPage/TransactionHistoryPage";
import { blockingPageAtom, BlockingType } from "@/state/blockingPage";
import { Routes, currentPageAtom } from "@/state/router";
import { useAtom } from "jotai";
import { ErrorBoundary } from "react-error-boundary";
import { useKeepWalletStateSynced } from "@/hooks/useKeepWalletStateSynced";
import { track } from "@amplitude/analytics-browser";

export const Router = () => {
  useKeepWalletStateSynced();
  const [currentPage] = useAtom(currentPageAtom);
  const [blockingPage, setBlockingPage] = useAtom(blockingPageAtom);

  if (blockingPage) {
    return <BlockingPage />;
  }

  switch (currentPage) {
    case Routes.SwapPage:
      return (
        <ErrorBoundary
          fallback={null}
          onError={(error) => {
            track("error page: unexpected error from swap page", { error });
            setBlockingPage({ blockingType: BlockingType.Unexpected, error });
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
            setBlockingPage({ blockingType: BlockingType.Unexpected, error });
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
            setBlockingPage({ blockingType: BlockingType.Unexpected, error });
          }}
        >
          <TransactionHistoryPage />
        </ErrorBoundary>
      );
  }
};
