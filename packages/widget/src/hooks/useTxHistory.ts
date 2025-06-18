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
        const newTxHistoryItem = {
          ...routeStatus,
          timestamp: txHistoryItem?.timestamp,
        };
        if (JSON.stringify(txHistoryItem) !== JSON.stringify(newTxHistoryItem)) {
          console.log("set transaction history");
          console.log(newTxHistoryItem);
          setTransactionHistory(newTxHistoryItem as TransactionHistoryItem);
        }
      },
    });
  }, []);

  return {
    status: txHistoryItem?.status,
    transferAssetRelease: txHistoryItem?.transferAssetRelease,
  };
};
