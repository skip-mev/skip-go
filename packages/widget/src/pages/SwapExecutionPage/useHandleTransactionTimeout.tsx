import { useEffect, useState } from "react";
import { SwapExecutionState } from "./SwapExecutionPage";
import { useAtomValue, useSetAtom } from "jotai";
import { errorWarningAtom, ErrorWarningType } from "@/state/errorWarning";
import { track } from "@amplitude/analytics-browser";
import { createSkipExplorerLink } from "@/utils/explorerLink";
import { currentTransactionAtom } from "@/state/history";

export const useHandleTransactionTimeout = (swapExecutionState?: SwapExecutionState) => {
  const currentTransaction = useAtomValue(currentTransactionAtom);
  const setError = useSetAtom(errorWarningAtom);
  const [transactionTimeoutTimer, setTransactionTimeoutTimer] = useState<
    NodeJS.Timeout | undefined
  >();

  useEffect(() => {
    if (
      !currentTransaction?.route?.estimatedRouteDurationSeconds ||
      !currentTransaction?.txsRequired
    )
      return;
    if (
      swapExecutionState === SwapExecutionState.pending &&
      transactionTimeoutTimer === undefined &&
      currentTransaction?.txsRequired === currentTransaction?.transactionDetails?.length
    ) {
      const timeoutTimer = setTimeout(
        () => {
          track("unexpected error page: transaction timeover", {
            route: currentTransaction?.route,
          });
          setError({
            errorWarningType: ErrorWarningType.Timeout,
            explorerLink: currentTransaction?.transactionDetails
              ? createSkipExplorerLink(currentTransaction.transactionDetails)
              : "",
            txHash: currentTransaction?.transactionDetails?.at(-1)?.txHash ?? "",
          });
        },
        currentTransaction?.route?.estimatedRouteDurationSeconds * 1_000 * 3,
      );

      setTransactionTimeoutTimer(timeoutTimer);
    }

    return () => {
      clearTimeout(transactionTimeoutTimer);
    };
  }, [
    currentTransaction?.route,
    currentTransaction?.transactionDetails,
    currentTransaction?.txsRequired,
    setError,
    swapExecutionState,
    transactionTimeoutTimer,
  ]);
};
