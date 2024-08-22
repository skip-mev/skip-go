import { ErrorPage } from "@/pages/ErrorPage/ErrorPage";
import { SwapExecutionPage } from "@/pages/SwapExecutionPage/SwapExecutionPage";
import { SwapPage } from "@/pages/SwapPage/SwapPage";
import { errorAtom } from "@/state/errorPage";
import { Routes, currentPageAtom } from "@/state/router";
import { useAtom } from "jotai";
import { ErrorBoundary } from "react-error-boundary";

export const Router = () => {
  const [currentPage] = useAtom(currentPageAtom);
  const [error, setError] = useAtom(errorAtom);

  if (error) {
    return <ErrorPage />;
  }

  switch (currentPage) {
    case Routes.SwapPage:
      return (
        <ErrorBoundary fallback={null} onError={(error) => setError(error)}>
          <SwapPage />
        </ErrorBoundary>
      );
    case Routes.SwapExecutionPage:
      return (
        <ErrorBoundary fallback={null} onError={(error) => setError(error)}>
          <SwapExecutionPage />
        </ErrorBoundary>
      );
  }
};
