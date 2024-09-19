
import { convertHumanReadableAmountToCryptoAmount } from "@/utils/crypto";
import { RouteResponse } from "@skip-go/client";
import { getClientOperations } from "@/utils/clientType";

export function getGasFee(chainType: string, route: RouteResponse) {
  const clientOperations = getClientOperations(route?.operations);
  console.log(clientOperations);
  switch (chainType) {
    case "evm":
      return convertHumanReadableAmountToCryptoAmount(0.1);
    case "cosmos":
    case "svm":
    default:
      return 0;
  }
}

