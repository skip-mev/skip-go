import { useEffect } from "react";
import {
  swapExecutionStateAtom,
} from "@/state/swapExecutionPage";
import { useAtomValue, useSetAtom } from "jotai";
import { errorAtom, ErrorType } from "@/state/errorPage";

export const useHandleTransactionFailed = (
  transactionFailed?: boolean
) => {
  const setError = useSetAtom(errorAtom);

  const { transactionDetailsArray } = useAtomValue(
    swapExecutionStateAtom
  );

  const lastTransaction =
    transactionDetailsArray[transactionDetailsArray.length - 1];

  useEffect(() => {
    if (transactionFailed) {
      setError({
        errorType: ErrorType.TransactionFailed,
        onClickContactSupport: () => window.open("https://skip.build/discord", "_blank"),
        explorerLink: lastTransaction?.explorerLink ?? "",
        txHash: lastTransaction?.txHash,
      });
    }
  }, [lastTransaction?.explorerLink, lastTransaction?.txHash, setError, transactionFailed]);
};
