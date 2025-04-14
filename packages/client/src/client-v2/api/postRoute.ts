import { api } from "./generateApi";

export const { request: postRoute, requestWithCancel: postRouteWithCancel } =
  api("getRouteV2", "/v2/fungible/route");
