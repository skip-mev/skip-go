import { useEffect, useState } from "react";
import { SwapExecutionState } from "./SwapExecutionPage";
import { setOverallStatusAtom, swapExecutionStateAtom } from "@/state/swapExecutionPage";
import { useAtomValue, useSetAtom } from "jotai";
import { blockingPageAtom, BlockingType } from "@/state/blockingPage";
import { track } from "@amplitude/analytics-browser";

export const useHandleTransactionTimeout = (swapExecutionState?: SwapExecutionState) => {
  const { route, transactionDetailsArray } = useAtomValue(swapExecutionStateAtom);
  const setError = useSetAtom(blockingPageAtom);
  const setOverallStatus = useSetAtom(setOverallStatusAtom);
  const [transactionTimeoutTimer, setTransactionTimeoutTimer] = useState<
    NodeJS.Timeout | undefined
  >();

  useEffect(() => {
    if (!route?.estimatedRouteDurationSeconds || !route?.txsRequired) return;
    if (
      swapExecutionState === SwapExecutionState.pending &&
      transactionTimeoutTimer === undefined &&
      route.txsRequired === transactionDetailsArray.length
    ) {
      const lastTransaction = transactionDetailsArray[transactionDetailsArray.length - 1];
      const timeoutTimer = setTimeout(
        () => {
          track("unexpected error page: transaction timeover", { route });
          setError({
            blockingType: BlockingType.Timeout,
            onClickBack: () => {
              setOverallStatus("unconfirmed");
            },
            explorerLink: lastTransaction?.explorerLink ?? "",
            txHash: lastTransaction?.txHash,
          });
        },
        route.estimatedRouteDurationSeconds * 1_000 * 3,
      );

      setTransactionTimeoutTimer(timeoutTimer);
    }

    return () => {
      clearTimeout(transactionTimeoutTimer);
    };
  }, [
    route,
    setError,
    setOverallStatus,
    swapExecutionState,
    transactionDetailsArray,
    transactionTimeoutTimer,
  ]);
};
