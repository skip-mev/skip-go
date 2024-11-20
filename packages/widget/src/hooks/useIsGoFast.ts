import { RouteResponse } from "@skip-go/client";
import { getClientOperations } from "@/utils/clientType";
import { OperationType } from "@/utils/clientType";
import { useMemo } from "react";

export const useIsGoFast = (route: RouteResponse | undefined) => {
  return useMemo(() => {
    const clientOperations = getClientOperations(route?.operations);
    return clientOperations?.some(
      (item) => item.type === OperationType.goFastTransfer
    ) ?? false;
  }, [route?.operations]);
};
