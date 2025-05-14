import { api } from "../utils/generateApi";
import type { ApiRequest } from "../utils/generateApi";
import { ApiState } from "src/state/apiState";
import type { SkipApiOptions } from "src/state/apiState";

export const route = async (request: RouteRequest) => {
  const requestWithAffiliateFeeBps = {
    ...request,
    cumulativeAffiliateFeeBps: ApiState.cumulativeAffiliateFeeBPS,
  };

  return api({
    methodName: "getRouteV2",
    method: "post",
    path: "/v2/fungible/route",
  })(requestWithAffiliateFeeBps);
};

export type RouteRequest = ApiRequest<"getRouteV2"> &
  SkipApiOptions & {
    abortDuplicateRequests?: boolean;
  };
