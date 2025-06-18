import { setTransactionHistoryAtom, TransactionHistoryItem } from "@/state/history";
import { subscribeToRouteStatus } from "@skip-go/client";
import { useSetAtom } from "jotai";
import { useEffect } from "react";

type useTxHistoryProps = {
  txHistoryItem?: TransactionHistoryItem;
};

export const useTxHistory = ({ txHistoryItem }: useTxHistoryProps) => {
  const setTransactionHistory = useSetAtom(setTransactionHistoryAtom);

  const transactionDetails = txHistoryItem?.transactionDetails;

  const txsRequired = txHistoryItem?.route?.txsRequired;

  useEffect(() => {
    subscribeToRouteStatus({
      transactionDetails: transactionDetails,
      txsRequired: txsRequired ?? 1,
      onRouteStatusUpdated: (routeStatus) => {
        if (JSON.stringify(txHistoryItem) !== JSON.stringify(routeStatus)) {
          console.log("set transaction history");
          setTransactionHistory(routeStatus as TransactionHistoryItem);
        }
      },
    });
  }, [setTransactionHistory, transactionDetails, txHistoryItem, txsRequired]);

  return {
    status: txHistoryItem?.status,
    transferAssetRelease: txHistoryItem?.transferAssetRelease,
  };
};
