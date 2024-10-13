import { useEffect, useState } from "react";
import { SwapExecutionState } from "./SwapExecutionPage";
import {
  setOverallStatusAtom,
  swapExecutionStateAtom,
} from "@/state/swapExecutionPage";
import { useAtomValue, useSetAtom } from "jotai";
import { errorAtom, ErrorType } from "@/state/errorPage";

export const useHandleTransactionTimeout = (
  swapExecutionState?: SwapExecutionState
) => {
  const { route, transactionDetailsArray } = useAtomValue(
    swapExecutionStateAtom
  );
  const setError = useSetAtom(errorAtom);
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
      const lastTransaction =
        transactionDetailsArray[transactionDetailsArray.length - 1];
      const timeoutTimer = setTimeout(() => {
        setError({
          errorType: ErrorType.Timeout,
          onClickBack: () => {
            setOverallStatus("unconfirmed");
          },
          explorerLink: lastTransaction?.explorerLink ?? "",
        });
      }, route.estimatedRouteDurationSeconds * 1_000 * 2);

      setTransactionTimeoutTimer(timeoutTimer);
    }
    if (
      swapExecutionState === SwapExecutionState.confirmed &&
      transactionTimeoutTimer !== undefined
    ) {
      clearTimeout(transactionTimeoutTimer);
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
