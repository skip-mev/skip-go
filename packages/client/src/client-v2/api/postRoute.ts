import { api } from "./generateApi";

export const { request: postRoute, requestWithCancel: postRouteWithCancel } =
  api({
    methodName: "getRouteV2",
    method: "post",
    path: "/v2/fungible/route",
  });
