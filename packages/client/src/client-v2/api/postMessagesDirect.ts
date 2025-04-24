import { api } from "../utils/generateApi";

export const messagesDirect = api({
  methodName: "getMsgsDirectV2",
  method: "post",
  path: "/v2/fungible/msgs_direct",
});
