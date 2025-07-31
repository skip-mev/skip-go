import { RouteDetailsWithRelatedRoutes, setTransactionHistoryAtom } from "@/state/history";
import { track } from "@amplitude/analytics-browser";
import { RouteDetails, subscribeToRouteStatus } from "@skip-go/client";
import { useSetAtom } from "jotai";
import { useEffect, useRef } from "react";

type useTxHistoryProps = {
  txHistoryItem?: RouteDetailsWithRelatedRoutes;
};

export const useTxHistory = ({ txHistoryItem }: useTxHistoryProps) => {
  const setTransactionHistory = useSetAtom(setTransactionHistoryAtom);
  const unsubscribersRef = useRef<(() => void)[] | null>(null);
  const subscribedIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!txHistoryItem) return;

    const unsubscribers: (() => void)[] = [];
    const subscribedRouteIds = new Set<string>();

    const subscribe = (route: RouteDetails) => {
      if (!route.id || subscribedRouteIds.has(route.id)) return;
      subscribedRouteIds.add(route.id);

      unsubscribers.push(
        subscribeToRouteStatus({
          routeDetails: route,
          onRouteStatusUpdated: (routeStatus) => {
            const failedFeeRoute = routeStatus?.relatedRoutes?.find(
              (relatedRoute) => relatedRoute.status === "failed",
            );
            if (failedFeeRoute) {
              track("gas on receive: fee route failed", { feeRoute: failedFeeRoute });
            }
            setTransactionHistory(routeStatus);
          },
        }),
      );
    };

    subscribe(txHistoryItem);

    txHistoryItem.relatedRoutes?.forEach((relatedRoute) => {
      if (relatedRoute && relatedRoute.id) {
        subscribe(relatedRoute as RouteDetails);
      }
    });

    unsubscribersRef.current = unsubscribers;
    subscribedIdsRef.current = subscribedRouteIds;

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [txHistoryItem, setTransactionHistory]);

  return txHistoryItem;
};
