import { RouteDetailsWithRelatedRoutes, setTransactionHistoryAtom } from "@/state/history";
import { track } from "@amplitude/analytics-browser";
import { subscribeToRouteStatus } from "@skip-go/client";
import { useSetAtom } from "jotai";
import { useEffect } from "react";

type useTxHistoryProps = {
  txHistoryItem?: RouteDetailsWithRelatedRoutes;
};

export const useTxHistory = ({ txHistoryItem }: useTxHistoryProps) => {
  const setTransactionHistory = useSetAtom(setTransactionHistoryAtom);

  useEffect(() => {
    if (!txHistoryItem) return;

    const unsubscribe = subscribeToRouteStatus({
      routeDetails: txHistoryItem,
      onRouteStatusUpdated: (routeStatus) => {
        const failedFeeRoute = routeStatus?.relatedRoutes?.find(
          (relatedRoute) => relatedRoute.status === "failed",
        );
        if (failedFeeRoute) {
          track("gas on receive: fee route failed", { feeRoute: failedFeeRoute });
        }
        setTransactionHistory(routeStatus);
      },
    });

    return unsubscribe;
  }, [txHistoryItem, setTransactionHistory]);

  return txHistoryItem;
};
