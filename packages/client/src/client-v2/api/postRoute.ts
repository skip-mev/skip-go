import { api } from "../utils/generateApi";

export const route = api({
  methodName: "getRouteV2",
  method: "post",
  path: "/v2/fungible/route",
});
